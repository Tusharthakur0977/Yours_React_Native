import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

type DeepLinkContextType = {
  deepLinkUrl: string | null;
  setDeepLinkUrl: Dispatch<SetStateAction<string | null>>;
  appEntry: 'deepLink' | 'normal';
  setAppEntry: Dispatch<SetStateAction<'deepLink' | 'normal'>>;
  resetDeepLinking: () => void;
};

const DeepLinkContext = createContext<DeepLinkContextType | undefined>(
  undefined,
);

export function DeepLinkProvider({children}: {children: ReactNode}) {
  const [deepLinkUrl, setDeepLinkUrl] = useState<string | null>(null);
  const [appEntry, setAppEntry] = useState<'deepLink' | 'normal'>('normal');

  const resetDeepLinking = () => {
    setAppEntry('normal');
    setDeepLinkUrl(null);
  };

  return (
    <DeepLinkContext.Provider
      value={{
        deepLinkUrl,
        setDeepLinkUrl,
        appEntry,
        setAppEntry,
        resetDeepLinking,
      }}>
      {children}
    </DeepLinkContext.Provider>
  );
}

export function useDeepLinkContext() {
  const context = useContext(DeepLinkContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
