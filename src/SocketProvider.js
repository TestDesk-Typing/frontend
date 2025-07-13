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
    if (isLoggedIn && !socketRef.current) {
      const socket = io(process.env.REACT_APP_API_URL, {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });
      socketRef.current = socket;

      const handleNewMessage = (message) => {
        setMessages((prev) => [...prev, message]);
        setSkip((prev) => prev + 1);
      };

      const handleConnectedUsers = ({ count, users }) => {
        setUserCount(count);
        setConnectedUsers(users || []);
      };

      const handleCountUpdate = (count) => setUserCount(count);

      socket.on("receiveMessage", handleNewMessage);
      socket.on("connectedUsers", handleConnectedUsers);
      socket.on("updateUserCount", handleCountUpdate);

      // Register user
      if (cookies.session_id) {
        socket.emit("registerUser", {
          userId: userDetails?.id || cookies?.userId || 0
        });
      }

      return () => {
        socket.off("receiveMessage", handleNewMessage);
        socket.off("connectedUsers", handleConnectedUsers);
        socket.off("updateUserCount", handleCountUpdate);
        // Don't disconnect here - we want to maintain the connection
      };
    }
  }, [isLoggedIn, cookies.session_id, userDetails]);

  useEffect(() => {
    return () => {
      if (socketRef.current && !isLoggedIn) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isLoggedIn]);

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
