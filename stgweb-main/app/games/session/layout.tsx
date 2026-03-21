import {WebSocketContextProvider} from '@/providers/WebSocketContext';
import DirectusAuthRefresh from '@/components/DirectusAuthRefresh';

type SessionLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({children}: SessionLayoutProps) {
  return (
    <>
      <DirectusAuthRefresh />
      <WebSocketContextProvider>{children}</WebSocketContextProvider>
    </>
  );
}
