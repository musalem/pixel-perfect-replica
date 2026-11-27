import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ParsedVideoSource } from "@/lib/video";

interface VideoPlayerProps {
  source: ParsedVideoSource;
  volume: number;
  muted: boolean;
  placement: "screen" | "external";
}

interface YouTubePlayer {
  playVideo: () => void;
  stopVideo: () => void;
  destroy: () => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
}

interface YouTubePlayerEvent {
  target: YouTubePlayer;
}

interface YouTubeStateEvent {
  data: number;
}

interface YouTubeErrorEvent {
  data: number;
}

interface YouTubeApi {
  PlayerState: { PLAYING: number };
  Player: new (
    target: HTMLElement,
    options: {
      host: string;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: YouTubePlayerEvent) => void;
        onStateChange: (event: YouTubeStateEvent) => void;
        onError: (event: YouTubeErrorEvent) => void;
      };
    },
  ) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubeApi> | null = null;

function loadYouTubeApi(): Promise<YouTubeApi> {
  if (window.YT) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<YouTubeApi>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error("YouTube API timed out")), 15_000);
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      if (!window.YT) return;
      window.clearTimeout(timeout);
      resolve(window.YT);
    };

    let script = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error("YouTube API failed to load"));
      };
      document.head.append(script);
    }
  }).catch((error: unknown) => {
    youtubeApiPromise = null;
    throw error;
  });

  return youtubeApiPromise;
}

function youTubeErrorMessage(code: number): string {
  if (code === 2) return "رابط يوتيوب غير صالح أو غير مدعوم.";
  if (code === 100) return "هذا الفيديو غير متاح للمشاهدة.";
  if (code === 101 || code === 150) return "لا يسمح مالك الفيديو بتشغيله داخل الموقع.";
  return "تعذّر تشغيل فيديو يوتيوب؛ تحقّق من الرابط والاتصال.";
}

function YouTubeVideo({ source, volume, muted, placement }: VideoPlayerProps & { source: Extract<ParsedVideoSource, { kind: "youtube" }> }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [needsPlay, setNeedsPlay] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let readyTimer: number | undefined;
    setNeedsPlay(true);
    setError(null);

    void loadYouTubeApi().then((api) => {
      if (cancelled || !targetRef.current) return;
      playerRef.current = new api.Player(targetRef.current, {
        host: "https://www.youtube-nocookie.com",
        videoId: source.videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          enablejsapi: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(Math.round((volume / 5) * 100));
            if (muted) event.target.mute();
            else event.target.unMute();
            event.target.playVideo();
            readyTimer = window.setTimeout(() => setNeedsPlay(true), 1800);
          },
          onStateChange: (event) => {
            if (event.data === api.PlayerState.PLAYING) {
              if (readyTimer !== undefined) window.clearTimeout(readyTimer);
              setNeedsPlay(false);
            }
          },
          onError: (event) => setError(youTubeErrorMessage(event.data)),
        },
      });
    }).catch(() => {
      if (!cancelled) setError("تعذّر تحميل مشغل يوتيوب؛ تحقّق من الاتصال.");
    });

    return () => {
      cancelled = true;
      if (readyTimer !== undefined) window.clearTimeout(readyTimer);
      playerRef.current?.stopVideo();
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [source.videoId]);

  useEffect(() => {
    playerRef.current?.setVolume(Math.round((volume / 5) * 100));
    if (muted) playerRef.current?.mute();
    else playerRef.current?.unMute();
  }, [volume, muted]);

  return (
    <div className={`video-player video-player-${placement}`} dir="ltr">
      <div className="video-player-frame"><div ref={targetRef} className="youtube-player-target" /></div>
      {error ? <p className="video-player-error" role="alert" dir="rtl">{error}</p> : needsPlay ? (
        <Button type="button" variant="outline" size="sm" className="video-play-button" onClick={() => playerRef.current?.playVideo()} dir="rtl">
          تشغيل الفيديو
        </Button>
      ) : null}
    </div>
  );
}

function Mp4Video({ source, volume, muted, placement }: VideoPlayerProps & { source: Extract<ParsedVideoSource, { kind: "mp4" }> }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsPlay, setNeedsPlay] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = Math.min(1, Math.max(0, volume / 5));
    video.muted = muted;
    void video.play().then(() => setNeedsPlay(false)).catch(() => setNeedsPlay(true));
  }, [source.url, volume, muted]);

  return (
    <div className={`video-player video-player-${placement}`} dir="ltr">
      <div className="video-player-frame">
        <video
          ref={videoRef}
          src={source.url}
          controls
          autoPlay
          playsInline
          onPlay={() => setNeedsPlay(false)}
          onError={() => setError("تعذّر تشغيل ملف الفيديو؛ تحقّق من الرابط وصيغة MP4." )}
        />
      </div>
      {error ? <p className="video-player-error" role="alert" dir="rtl">{error}</p> : needsPlay ? (
        <Button type="button" variant="outline" size="sm" className="video-play-button" onClick={() => void videoRef.current?.play()} dir="rtl">
          تشغيل الفيديو
        </Button>
      ) : null}
    </div>
  );
}

export function VideoPlayer(props: VideoPlayerProps) {
  if (props.source.kind === "youtube") return <YouTubeVideo {...props} source={props.source} />;
  return <Mp4Video {...props} source={props.source} />;
}