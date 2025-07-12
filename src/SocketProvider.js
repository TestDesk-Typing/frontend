import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext/AuthContext";
import { useCookies } from "react-cookie";

const SocketContext = createContext(null);
const BATCH_SIZE = 12;

export const SocketProvider = ({ children }) => {
  const { isLoggedIn, userDetails } = useAuth();
  const [cookies] = useCookies(["session_id"]);

  const socketRef = useRef(null);
  const loadingRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [connectedUsers, setConnectedUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);

  const fetchConnectedUsers = () => {
    if (socketRef.current) {
      socketRef.current.emit("getConnectedUsers");
      socketRef.current.once("connectedUsers", ({ count, users }) => {
        setUserCount(count);
        setConnectedUsers(users || []);
      });
    }
  };

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleCountUpdate = (count) => setUserCount(count);
    socket.on("updateUserCount", handleCountUpdate);

    return () => {
      if (socket) {
        socket.off("updateUserCount", handleCountUpdate);
      }
    };
  }, []);

  useEffect(() => {
    console.log("cookies => ", cookies)
    if (isLoggedIn && !socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_API_URL, {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });

      socketRef.current.on("receiveMessage", (message) => {
        setMessages((prev) => [...prev, message]);
        setSkip((prev) => prev + 1);
      });

      // ✅ Immediately register the user on socket connection
      if (cookies.session_id) {
        socketRef.current.emit("registerUser", { userId: cookies?.SSDSD?.id || 0 });
      }

      // ✅ Get list of connected users
      socketRef.current.emit("getConnectedUsers");
      socketRef.current.once("connectedUsers", ({ count, users }) => {
        setUserCount(count);
        setConnectedUsers(users || []);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isLoggedIn, cookies.session_id]);

  const loadMessages = useCallback(() => {
    if (!socketRef.current || loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    socketRef.current.emit("getMessages", { skip, limit: BATCH_SIZE });

    socketRef.current.once("chatHistory", ({ messages: newMessages }) => {
      if (Array.isArray(newMessages) && newMessages.length > 0) {
        const orderedMessages = [...newMessages].reverse();

        setMessages((prev) =>
          skip === 0 ? orderedMessages : [...orderedMessages, ...prev]
        );

        setSkip((prev) => prev + newMessages.length);
        setHasMore(newMessages.length === BATCH_SIZE);
      } else {
        setHasMore(false);
      }
      loadingRef.current = false;
    });
  }, [skip, hasMore]);

  useEffect(() => {
    if (isLoggedIn) {
      loadMessages();
    }
  }, [isLoggedIn, loadMessages]);

  const sendMessage = (messageData) => {
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", messageData);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        messages,
        sendMessage,
        loadMessages,
        hasMore,
        fetchConnectedUsers,
        connectedUsers,
        userCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
