import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  Lamp,
  Maximize,
  Menu,
  Minus,
  Moon,
  Music2,
  Power,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tv,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CHANNELS,
  ERA_OPTIONS,
  PROGRAMS,
  SCHEDULES,
  filterPrograms,
  type Channel,
  type HistoricalEra,
  type Program,
} from "@/data/ramadan-tv";

import televisionRoom from "@/assets/ramadan-tv-room.png";

type Section = "tv" | "channels" | "guide" | "archive" | "favorites" | "about";

const NAV_ITEMS: { id: Section; label: string; to: string }[] = [
  { id: "tv", label: "التلفزيون", to: "/" },
  { id: "channels", label: "القنوات", to: "/channels" },
  { id: "guide", label: "دليل البرامج", to: "/guide" },
  { id: "archive", label: "أرشيف الذكريات", to: "/archive" },
  { id: "favorites", label: "المفضّلة", to: "/favorites" },
  { id: "about", label: "عن المشروع", to: "/about" },
];

const readFavorites = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem("ramadan-tv-favorites") ?? "[]");
    return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
};

function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  useEffect(() => setFavoriteIds(readFavorites()), []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ramadan-tv-favorites", JSON.stringify(favoriteIds));
    }
  }, [favoriteIds]);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return { favoriteIds, toggleFavorite };
}

function SiteHeader({ section, favoriteCount }: { section: Section; favoriteCount: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header" dir="rtl">
      <Link to="/" className="brand-mark" aria-label="رمضان زمان — الصفحة الرئيسية">
        <span className="brand-icon"><Tv size={20} strokeWidth={1.8} /></span>
        <span className="brand-copy">
          <strong>رمضان زمان</strong>
          <small>تلفزيون الحكايات</small>
        </span>
      </Link>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="mobile-menu-trigger"
        aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X /> : <Menu />}
      </Button>
      <nav className={`site-nav${menuOpen ? " is-open" : ""}`} aria-label="التنقل الرئيسي">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            aria-current={section === item.id ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
            className="nav-link"
          >
            {item.label}
            {item.id === "favorites" && favoriteCount > 0 && (
              <span className="nav-count">{favoriteCount}</span>
            )}
          </Link>
        ))}
      </nav>
      <div className="header-mark" aria-label="ليالي رمضان">
        <Moon size={17} />
        <span>ليالي رمضان</span>
      </div>
    </header>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="section-heading" dir="rtl">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

function EraSelect({ value, onChange }: { value: HistoricalEra | "all"; onChange: (value: HistoricalEra | "all") => void }) {
  return (
    <label className="select-wrap">
      <SlidersHorizontal size={16} aria-hidden="true" />
      <select aria-label="اختر الفترة الزمنية" value={value} onChange={(event) => onChange(event.target.value as HistoricalEra | "all")}>
        {ERA_OPTIONS.map((era) => <option key={era.value} value={era.value}>{era.label}</option>)}
      </select>
      <ChevronDown size={14} aria-hidden="true" />
    </label>
  );
}

function ProgramCard({ program, favorite, onFavorite, compact = false }: { program: Program; favorite: boolean; onFavorite: () => void; compact?: boolean }) {
  const channel = CHANNELS.find((item) => item.id === program.channelId);
  return (
    <article className={`program-card${compact ? " program-card-compact" : ""}`} dir="rtl">
      <div className="program-art">
        <img src={televisionRoom} alt="رسم لبيت مصري هادئ وتلفزيون قديم وفانوس مضيء" loading="lazy" />
        <span className="demo-ribbon">عينة توضيحية</span>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={`favorite-toggle${favorite ? " is-favorite" : ""}`}
          aria-label={favorite ? `إزالة ${program.title} من المفضّلة` : `إضافة ${program.title} إلى المفضّلة`}
          aria-pressed={favorite}
          onClick={onFavorite}
        >
          <Bookmark size={17} fill={favorite ? "currentColor" : "none"} />
        </Button>
      </div>
      <div className="program-copy">
        <div className="program-meta"><span>{channel?.name ?? program.category}</span><span>{program.era}</span></div>
        <h3>{program.title}</h3>
        {!compact && <p>{program.description}</p>}
        <div className="availability-note"><Info size={14} /><span>{program.rightsNote}</span></div>
      </div>
    </article>
  );
}

function ChannelMark({ icon }: { icon: Channel["icon"] }) {
  const iconMap = { drama: Tv, fawazeer: Sparkles, kids: Moon, ads: Lamp, variety: Tv, music: Music2 };
  const Icon = iconMap[icon];
  return <Icon size={21} strokeWidth={1.6} aria-hidden="true" />;
}

function TelevisionExperience({ channelIndex, setChannelIndex }: { channelIndex: number; setChannelIndex: (value: number) => void }) {
  const [powered, setPowered] = useState(false);
  const [volume, setVolume] = useState(4);
  const [muted, setMuted] = useState(false);
  const [infoVisible, setInfoVisible] = useState(true);
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [messageVisible, setMessageVisible] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);
  const channel = CHANNELS[channelIndex];

  const moveChannel = (direction: number) => {
    setChannelIndex((channelIndex + direction + CHANNELS.length) % CHANNELS.length);
    setPowered(true);
    setInfoVisible(true);
  };
  const togglePower = () => {
    setPowered((value) => !value);
    setMessageVisible(false);
  };
  const enterFullscreen = async () => {
    if (!screenRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (screenRef.current.requestFullscreen) {
      await screenRef.current.requestFullscreen();
    }
  };

  return (
    <section className="tv-experience" dir="rtl" aria-label="تجربة التلفزيون">
      <div className="tv-scene">
        <div className="scene-ornament ornament-one"><Moon size={25} /></div>
        <div className="scene-ornament ornament-two"><Lamp size={25} /></div>
        <div className="tv-artwork-wrap" ref={screenRef}>
          <img className="tv-room-art" src={televisionRoom} alt="تلفزيون خشبي قديم في غرفة مصرية مزينة بفانوس رمضان" />
          <div className={`crt-screen${powered ? " is-powered" : ""}${effectsEnabled ? " has-effects" : ""}`}>
            {powered ? (
              <>
                {effectsEnabled && <span className="crt-scanlines" aria-hidden="true" />}
                {messageVisible ? (
                  <div className="crt-message"><Sparkles size={25} /><strong>أهلاً بيكم</strong><span>رمضان زمان… حكايات بتجمعنا</span><Button variant="outline" size="sm" onClick={() => setMessageVisible(false)}>مشاهدة القناة</Button></div>
                ) : (
                  <div className="crt-channel-content">
                    {infoVisible && <><span className="screen-channel-id">قناة رقم {channel.number}</span><div className="screen-on-label"><span className="screen-live-dot" /> شاشة أرشيفية تجريبية</div><strong>{channel.name}</strong><span className="screen-screening-label">لا يوجد تسجيل معتمد للعرض حالياً</span><span className="screen-category">{channel.category}</span></>}
                    {!infoVisible && <Button variant="outline" size="sm" onClick={() => setInfoVisible(true)}>عرض معلومات القناة</Button>}
                  </div>
                )}
                <span className="screen-vignette" aria-hidden="true" />
              </>
            ) : (
              <div className="crt-off"><span className="off-indicator" /><small>للبدء… شغّل التلفزيون</small></div>
            )}
          </div>
        </div>
        <div className="ambient-caption"><span className="ambient-rule" /> <span>من ذكريات التلفزيون المصري</span> <span className="ambient-rule" /></div>
      </div>

      <div className="tv-console" aria-label="أزرار التلفزيون">
        <div className="console-channel">
          <span className="console-label">القناة</span>
          <div className="console-channel-name"><span>{channel.number}</span><strong>{channel.name}</strong></div>
          <div className="console-button-pair">
            <Button type="button" variant="outline" size="icon" title="القناة السابقة" aria-label="القناة السابقة" onClick={() => moveChannel(-1)}><ChevronRight /></Button>
            <Button type="button" variant="outline" size="icon" title="القناة التالية" aria-label="القناة التالية" onClick={() => moveChannel(1)}><ChevronLeft /></Button>
          </div>
        </div>
        <div className="console-divider" />
        <div className="console-power">
          <span className="console-label">التشغيل</span>
          <Button type="button" variant="outline" className="power" size="icon" title={powered ? "إيقاف التلفزيون" : "تشغيل التلفزيون"} aria-label={powered ? "إيقاف التلفزيون" : "تشغيل التلفزيون"} aria-pressed={powered} onClick={togglePower}><Power /></Button>
          <span className={`power-status${powered ? " is-on" : ""}`}>{powered ? "يعمل" : "متوقف"}</span>
        </div>
        <div className="console-divider" />
        <div className="console-volume">
          <span className="console-label">الصوت</span>
          <div className="volume-controls">
            <Button type="button" variant="outline" size="icon" aria-label="خفض الصوت" onClick={() => setVolume((current) => Math.max(0, current - 1))}><Minus size={16} /></Button>
            <div className="volume-meter" role="meter" aria-label="مستوى الصوت" aria-valuemin={0} aria-valuemax={5} aria-valuenow={muted ? 0 : volume}>
              {Array.from({ length: 5 }, (_, index) => <span key={index} className={index < (muted ? 0 : volume) ? "meter-on" : ""} />)}
            </div>
            <Button type="button" variant="outline" size="icon" aria-label="رفع الصوت" onClick={() => setVolume((current) => Math.min(5, current + 1))}><Volume2 size={16} /></Button>
            <Button type="button" variant="outline" size="icon" aria-label={muted ? "إلغاء كتم الصوت" : "كتم الصوت"} aria-pressed={muted} onClick={() => setMuted((current) => !current)}>{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</Button>
          </div>
        </div>
        <div className="console-divider console-divider-end" />
        <div className="console-extras">
          <Button type="button" variant="ghost" size="icon" title="معلومات القناة" aria-label="معلومات القناة" aria-pressed={infoVisible} onClick={() => setInfoVisible((current) => !current)}><Info /></Button>
          <Button type="button" variant="ghost" size="icon" title="العرض الكامل" aria-label="العرض الكامل" onClick={() => void enterFullscreen()}><Maximize /></Button>
          <Button type="button" variant="ghost" size="icon" title={effectsEnabled ? "إيقاف تأثير الشاشة" : "تشغيل تأثير الشاشة"} aria-label={effectsEnabled ? "إيقاف تأثير الشاشة" : "تشغيل تأثير الشاشة"} aria-pressed={effectsEnabled} onClick={() => setEffectsEnabled((current) => !current)}><Sparkles /></Button>
          <Button type="button" variant="ghost" size="icon" title="الترحيب" aria-label="رسالة ترحيب" onClick={() => { setPowered(true); setMessageVisible(true); }}><Moon /></Button>
        </div>
      </div>
      <div className="channel-now" aria-live="polite">
        <div className="now-indicator"><span className="screen-live-dot" /> <span>على الشاشة</span></div>
        <div><span className="now-channel">{channel.number} / {channel.name}</span><p>لا يتوفر تسجيل معتمد حالياً؛ هذه قناة تجريبية لاستعراض التجربة.</p></div>
        <Link to="/guide" className="text-link">تصفّح دليل الذكريات <ChevronLeft size={15} /></Link>
      </div>
    </section>
  );
}

function TelevisionPage({ channelIndex, setChannelIndex }: { channelIndex: number; setChannelIndex: (value: number) => void }) {
  return (
    <main className="home-view" dir="rtl">
      <div className="home-intro">
        <span className="eyebrow"><span className="eyebrow-dot" /> سهرات من ذاكرة البيت المصري</span>
        <h1>افتح التلفزيون... <em>ورجّع أيام زمان</em></h1>
        <p>لمة العيلة، صوت التترات، ورمضان اللي ساكن في قلوبنا.</p>
      </div>
      <TelevisionExperience channelIndex={channelIndex} setChannelIndex={setChannelIndex} />
      <div className="channel-strip-heading">
        <div><span className="eyebrow">اختار حكايتك</span><h2>قنوات من زمن جميل</h2></div>
        <Link to="/channels" className="text-link">كل القنوات <ChevronLeft size={15} /></Link>
      </div>
      <div className="channel-strip">
        {CHANNELS.map((channel, index) => (
          <button type="button" key={channel.id} className={`channel-tile${index === channelIndex ? " is-selected" : ""}`} onClick={() => setChannelIndex(index)}>
            <span className="channel-tile-icon"><ChannelMark icon={channel.icon} /></span>
            <span className="channel-tile-copy"><small>قناة {channel.number}</small><strong>{channel.name}</strong><span>{channel.category}</span></span>
            <ChevronLeft size={16} className="channel-tile-arrow" />
          </button>
        ))}
      </div>
      <section className="home-archive-prompt">
        <div className="prompt-icon"><Lamp size={27} /></div>
        <div><span className="eyebrow">من الأرشيف</span><h2>ذكريات لسه بتلمّنا</h2><p>عناوين تجريبية بانتظار المواد الموثوقة والمصرح بها.</p></div>
        <Link to="/archive" className="text-link">افتح الأرشيف <ChevronLeft size={15} /></Link>
      </section>
    </main>
  );
}

function ChannelsPage({ channelIndex, setChannelIndex }: { channelIndex: number; setChannelIndex: (value: number) => void }) {
  return (
    <main className="content-view" dir="rtl">
      <SectionHeading eyebrow="محطات من ليالي زمان" title="قنواتنا الست" description="كل قناة لها حكاية ونكهة خاصة. المحتوى هنا توضيحي إلى أن تتوفر تسجيلات موثّقة ومصرّح بها." />
      <div className="channel-grid">
        {CHANNELS.map((channel, index) => (
          <article key={channel.id} className={`channel-card${index === channelIndex ? " is-selected" : ""}`}>
            <span className="channel-card-number">{channel.number}</span>
            <div className="channel-card-icon"><ChannelMark icon={channel.icon} /></div>
            <span className="eyebrow">{channel.category}</span>
            <h2>{channel.name}</h2>
            <p>{channel.description}</p>
            <Button variant={index === channelIndex ? "default" : "outline"} onClick={() => setChannelIndex(index)}>
              <Tv size={16} /> {index === channelIndex ? "القناة المختارة" : "اختيار القناة"}
            </Button>
          </article>
        ))}
      </div>
    </main>
  );
}

function GuidePage({ channelIndex, setChannelIndex }: { channelIndex: number; setChannelIndex: (value: number) => void }) {
  const [activeChannelId, setActiveChannelId] = useState(CHANNELS[channelIndex]?.id ?? CHANNELS[0].id);
  const guidePrograms = useMemo(() => {
    const schedule = SCHEDULES.find((entry) => entry.channelId === activeChannelId);
    return PROGRAMS.filter((program) => schedule?.programIds.includes(program.id));
  }, [activeChannelId]);
  const activeChannel = CHANNELS.find((channel) => channel.id === activeChannelId) ?? CHANNELS[0];
  return (
    <main className="content-view" dir="rtl">
      <SectionHeading eyebrow="رفوف من الذاكرة" title="دليل البرامج" description="تصفّح عناوين مقترحة حسب القناة. هذا الدليل ليس جدول بث حيّاً." />
      <div className="guide-disclaimer"><Info size={18} /><span>عرض تجريبي — ترتيب للتصفح فقط، وليس موعداً أو جدولاً للبث.</span></div>
      <div className="guide-layout">
        <div className="guide-channel-list" aria-label="اختيار قناة الدليل">
          {CHANNELS.map((channel) => <button key={channel.id} type="button" className={`guide-channel${activeChannelId === channel.id ? " is-active" : ""}`} onClick={() => { setActiveChannelId(channel.id); setChannelIndex(CHANNELS.findIndex((item) => item.id === channel.id)); }}><span>{channel.number}</span><strong>{channel.name}</strong><ChevronLeft size={15} /></button>)}
        </div>
        <section className="guide-schedule" aria-live="polite">
          <div className="guide-schedule-head"><div><span className="eyebrow">قناة {activeChannel.number}</span><h2>{activeChannel.name}</h2></div><span className="guide-sample-mark"><Sparkles size={15} /> قائمة تجريبية</span></div>
          <p className="guide-sample-caption">عناوين نموذجية من مجموعة {activeChannel.category}، بلا أوقات بث.</p>
          {guidePrograms.map((program, index) => <button key={program.id} type="button" className="guide-row" onClick={() => setChannelIndex(CHANNELS.findIndex((item) => item.id === program.channelId))}><span className="guide-row-number">{String(index + 1).padStart(2, "0")}</span><div><strong>{program.title}</strong><span>{program.description}</span></div><span className="guide-row-era">{program.era}</span><ChevronLeft size={17} /></button>)}
        </section>
      </div>
    </main>
  );
}

function ArchivePage({ favoriteIds, toggleFavorite }: { favoriteIds: string[]; toggleFavorite: (id: string) => void }) {
  const [era, setEra] = useState<HistoricalEra | "all">("all");
  const [channelId, setChannelId] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => filterPrograms(PROGRAMS, era, channelId, query), [era, channelId, query]);
  return (
    <main className="content-view" dir="rtl">
      <SectionHeading eyebrow="ذاكرة بتتفتح على مهل" title="أرشيف الذكريات" description="فتّش بين عناوين توضيحية، واختار الفترة والقناة اللي بتحبها." />
      <div className="archive-toolbar">
        <label className="search-control"><Search size={18} /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="دوّر على عنوان أو حكاية..." aria-label="البحث في الأرشيف" /><Button type="button" variant="ghost" size="icon" aria-label="مسح البحث" onClick={() => setQuery("")}><X size={17} /></Button></label>
        <EraSelect value={era} onChange={setEra} />
        <label className="select-wrap channel-filter"><Tv size={16} /><select aria-label="اختر قناة الأرشيف" value={channelId} onChange={(event) => setChannelId(event.target.value)}><option value="all">كل القنوات</option>{CHANNELS.map((channel) => <option key={channel.id} value={channel.id}>{channel.name}</option>)}</select><ChevronDown size={14} /></label>
      </div>
      <div className="archive-results-label"><span>{filtered.length} من الذكريات</span><span className="archive-demo-note"><Info size={14} /> كل العناصر الحالية تجريبية</span></div>
      {filtered.length ? <div className="program-grid">{filtered.map((program) => <ProgramCard key={program.id} program={program} favorite={favoriteIds.includes(program.id)} onFavorite={() => toggleFavorite(program.id)} />)}</div> : <div className="empty-state"><Search size={25} /><h2>ما لقيناش نتيجة</h2><p>جرّب كلمة تانية أو غيّر اختيار الفترة والقناة.</p><Button variant="outline" onClick={() => { setQuery(""); setEra("all"); setChannelId("all"); }}>عرض الأرشيف كله</Button></div>}
    </main>
  );
}

function FavoritesPage({ favoriteIds, toggleFavorite }: { favoriteIds: string[]; toggleFavorite: (id: string) => void }) {
  const favorites = PROGRAMS.filter((program) => favoriteIds.includes(program.id));
  return (
    <main className="content-view" dir="rtl">
      <SectionHeading eyebrow="حاجات بنحب نرجعلها" title="المفضّلة" description="ذكرياتك المختارة تفضل محفوظة على جهازك." />
      {favorites.length ? <div className="program-grid">{favorites.map((program) => <ProgramCard key={program.id} program={program} favorite onFavorite={() => toggleFavorite(program.id)} />)}</div> : <div className="empty-state"><Bookmark size={25} /><h2>لسه ما اخترتش حاجة</h2><p>احفظ العناوين اللي تحب ترجع لها من أرشيف الذكريات.</p><Link to="/archive" className="text-link">روح للأرشيف <ChevronLeft size={15} /></Link></div>}
    </main>
  );
}

function AboutPage() {
  return (
    <main className="content-view" dir="rtl">
      <SectionHeading eyebrow="حكاية المشروع" title="لمة واحدة… وذكريات كتير" description="رمضان زمان مساحة رقمية تحتفي بإحساس أمسيات التلفزيون المصري في الثمانينيات والتسعينيات وبدايات الألفينات." />
      <section className="about-illustration"><img src={televisionRoom} alt="تلفزيون قديم وفانوس رمضان في بيت مصري دافئ" /></section>
      <div className="about-copy">
        <article><span className="about-number">01</span><h2>التلفزيون في قلب البيت</h2><p>تجربة تفاعلية تستلهم التلفزيون الخشبي، جلسات العيلة، وفانوس رمضان — من غير ما تدّعي عرض تسجيلات غير متاحة.</p></article>
        <article><span className="about-number">02</span><h2>أرشيف يحترم الذاكرة والحقوق</h2><p>المعروض حالياً بيانات تجريبية. لا توجد فيديوهات أو تسجيلات متاحة حتى يُضاف محتوى موثّق ومصرّح باستخدامه.</p></article>
        <article><span className="about-number">03</span><h2>حكايات تتّسع مع الوقت</h2><p>القنوات والفترات والعناوين مفصولة ومنظمة لتستقبل مواد أرشيفية جديدة كلما توفرت معلومات ومصادر معتمدة.</p></article>
      </div>
      <div className="about-footer-note"><Check size={17} /> لا تسجيلات أو مواعيد بث حقيقية ضمن النسخة الحالية.</div>
    </main>
  );
}

export function RamadanExperience({ section }: { section: Section }) {
  const [channelIndex, setChannelIndex] = useState(0);
  const { favoriteIds, toggleFavorite } = useFavorites();

  return (
    <div className="app-shell">
      <div className="page-grain" aria-hidden="true" />
      <SiteHeader section={section} favoriteCount={favoriteIds.length} />
      {section === "tv" && <TelevisionPage channelIndex={channelIndex} setChannelIndex={setChannelIndex} />}
      {section === "channels" && <ChannelsPage channelIndex={channelIndex} setChannelIndex={setChannelIndex} />}
      {section === "guide" && <GuidePage channelIndex={channelIndex} setChannelIndex={setChannelIndex} />}
      {section === "archive" && <ArchivePage favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} />}
      {section === "favorites" && <FavoritesPage favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} />}
      {section === "about" && <AboutPage />}
      <footer className="site-footer" dir="rtl"><span>رمضان زمان</span><span>حكايات من نور شاشة قديمة <Lamp size={15} /></span><span>كل الحقوق محفوظة لأصحابها</span></footer>
    </div>
  );
}