import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type RefreshContextType = {
  refreshProfileScreen: number;
  setRefreshProfileScreen: Dispatch<SetStateAction<number>>;
  notificationData: any;
  setNotificationData: Dispatch<SetStateAction<any>>;
  clearNotificationData: () => void;
};

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);
RefreshContext;
export function RefreshProvider({children}: {children: ReactNode}) {
  const [refreshProfileScreen, setRefreshProfileScreen] = useState(0);
  const [notificationData, setNotificationData] = useState<any>();

  const clearNotificationData = () => {
    setNotificationData(null);
  };
  return (
    <RefreshContext.Provider
      value={{
        refreshProfileScreen,
        setRefreshProfileScreen,
        notificationData,
        setNotificationData,
        clearNotificationData,
      }}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefreshContext() {
  const context = useContext(RefreshContext);
  if (context === undefined) {
    throw new Error('usePDF must be used within a PdfProvider');
  }
  return context;
}
