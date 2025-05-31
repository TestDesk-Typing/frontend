import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext/AuthContext";

const SocketContext = createContext(null);

const BATCH_SIZE = 12;

export const SocketProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();

  const socketRef = useRef(null);
  const loadingRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Initialize socket connection once on login
  useEffect(() => {
    if (isLoggedIn && !socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_API_URL, {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });

      socketRef.current.on("receiveMessage", (message) => {
        setMessages((prev) => [...prev, message]);
        setSkip((prev) => prev + 1);
      });
    }

    // Cleanup on logout or unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isLoggedIn]);

  // Function to load messages with pagination (skip, limit)
  const loadMessages = useCallback(() => {
    if (!socketRef.current || loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    socketRef.current.emit("getMessages", { skip, limit: BATCH_SIZE });

    socketRef.current.once("chatHistory", ({ messages: newMessages }) => {
      if (Array.isArray(newMessages) && newMessages.length > 0) {
        const orderedMessages = [...newMessages].reverse();

        // For initial load, replace messages, for later loads prepend older messages
        setMessages((prev) => (skip === 0 ? orderedMessages : [...orderedMessages, ...prev]));

        setSkip((prev) => prev + newMessages.length);
        setHasMore(newMessages.length === BATCH_SIZE);
      } else {
        setHasMore(false);
      }
      loadingRef.current = false;
    });
  }, [skip, hasMore]);

  // Initial load on login (or could be triggered from ChatModal when it opens)
  useEffect(() => {
    if (isLoggedIn) {
      loadMessages();
    }
  }, [isLoggedIn, loadMessages]);

  // Function to send message
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
