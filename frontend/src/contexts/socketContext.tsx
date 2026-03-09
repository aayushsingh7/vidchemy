import { createContext, useContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { useGuestAccount } from "../hooks/useGuestAccount";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const guest = useGuestAccount();
  const socket = useMemo(() => {
    return io(`${import.meta.env.VITE_SOCKET_URL}`, {
      transports: ["websocket"],
      auth: {
        token: guest,
      },
    });
  }, [guest]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket(): Socket {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }
  return context;
}
