import { createContext, useContext, useState, type ReactNode } from "react";

type ChannelSelection = {
  channelIndex: number;
  setChannelIndex: (value: number) => void;
};

const ChannelSelectionContext = createContext<ChannelSelection | null>(null);

// Lives above the router <Outlet /> so the selected channel survives page navigation.
export function ChannelSelectionProvider({ children }: { children: ReactNode }) {
  const [channelIndex, setChannelIndex] = useState(0);
  return (
    <ChannelSelectionContext.Provider value={{ channelIndex, setChannelIndex }}>
      {children}
    </ChannelSelectionContext.Provider>
  );
}

export function useChannelSelection() {
  const selection = useContext(ChannelSelectionContext);
  if (!selection) throw new Error("useChannelSelection requires ChannelSelectionProvider");
  return selection;
}
