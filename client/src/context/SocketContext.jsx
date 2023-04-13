import { createContext } from "react";
import io from "socket.io-client";

// const IP = "http://192.168.2.10";
// const IP = "http://192.168.1.10";
// const IP = "http://192.168.1.104";
// const IP = "http://192.168.1.101";
const IP = "http://192.168.1.107";
const PORT = 3000;
const socket = io(`${IP}:${PORT}`);

export const SocketProvider = ({ children }) => {
  const value = { socket };
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const SocketContext = createContext();
