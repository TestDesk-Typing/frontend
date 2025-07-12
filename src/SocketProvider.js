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

const SocketContext = createContext(null);

const BATCH_SIZE = 12;

export const SocketProvider = ({ children }) => {
  const { isLoggedIn, userDetails } = useAuth();

  const socketRef = useRef(null);
  const loadingRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [connectedUsers, setConnectedUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);

  // ✅ Fetch connected users manually
  const fetchConnectedUsers = () => {
    if (socketRef.current) {
      socketRef.current.emit("getConnectedUsers");
      socketRef.current.once("connectedUsers", ({ count, users }) => {
        setUserCount(count);
        setConnectedUsers(users || []);
      });
    }
  };

  // ✅ Listen for live user count updates
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

  // ✅ Initialize socket connection once on login
  useEffect(() => {
    if (isLoggedIn && !socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_API_URL, {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });

      // ✅ Register user on connect
      if (userDetails?.id) {
        socketRef.current.emit("registerUser", {
          userId: userDetails.id,
        });
      }

      // ✅ Fetch user list on connect
      socketRef.current.emit("getConnectedUsers");
      socketRef.current.once("connectedUsers", ({ count, users }) => {
        setUserCount(count);
        setConnectedUsers(users || []);
      });

      // ✅ Listen for new messages
      socketRef.current.on("receiveMessage", (message) => {
        setMessages((prev) => [...prev, message]);
        setSkip((prev) => prev + 1);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isLoggedIn, userDetails]);

  // ✅ Load messages with pagination
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

  // ✅ Load messages on login
  useEffect(() => {
    if (isLoggedIn) {
      loadMessages();
    }
  }, [isLoggedIn, loadMessages]);

  // ✅ Send message
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

        // ✅ Connected user info
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
