import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CHANNELS, PROGRAMS } from "@/data/ramadan-tv";
import { getProgramVideoStatus } from "@/lib/video";

interface ChannelSelectionValue {
  selectedChannelId: string;
  selectedProgramId: string | null;
  tvPoweredOn: boolean;
  selectChannel: (channelId: string) => void;
  selectProgram: (programId: string) => void;
  tuneProgram: (programId: string) => void;
  setTvPoweredOn: (poweredOn: boolean) => void;
}

const ChannelSelectionContext = createContext<ChannelSelectionValue | null>(null);

export function ChannelSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedChannelId, setSelectedChannelId] = useState(CHANNELS[0]?.id ?? "");
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [tvPoweredOn, setTvPoweredOn] = useState(false);

  const selectChannel = useCallback((channelId: string) => {
    if (!CHANNELS.some((channel) => channel.id === channelId)) return;

    setSelectedChannelId(channelId);
    const firstPlayableProgram = PROGRAMS.find(
      (program) => program.channelId === channelId && getProgramVideoStatus(program.id) === "available",
    );
    setSelectedProgramId(firstPlayableProgram?.id ?? null);
  }, []);

  const selectProgram = useCallback((programId: string) => {
    const program = PROGRAMS.find((item) => item.id === programId);
    if (!program) return;

    setSelectedChannelId(program.channelId);
    setSelectedProgramId(program.id);
  }, []);

  const tuneProgram = useCallback((programId: string) => {
    selectProgram(programId);
    setTvPoweredOn(true);
  }, [selectProgram]);

  const value = useMemo(
    () => ({
      selectedChannelId,
      selectedProgramId,
      tvPoweredOn,
      selectChannel,
      selectProgram,
      tuneProgram,
      setTvPoweredOn,
    }),
    [selectedChannelId, selectedProgramId, tvPoweredOn, selectChannel, selectProgram, tuneProgram],
  );

  return <ChannelSelectionContext.Provider value={value}>{children}</ChannelSelectionContext.Provider>;
}

export function useChannelSelection() {
  const value = useContext(ChannelSelectionContext);
  if (!value) throw new Error("useChannelSelection must be used within ChannelSelectionProvider");
  return value;
}