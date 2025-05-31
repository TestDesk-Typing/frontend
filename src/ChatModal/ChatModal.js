import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Close as CloseIcon, Reply as ReplyIcon, Send as SendIcon } from "@mui/icons-material";
import { useAuth } from "../AuthContext/AuthContext";

const BATCH_SIZE = 12;

const ChatModal = ({ open, onClose }) => {
  const { userDetails, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState([]); // Always start with an array
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const socketRef = useRef(null);
  const loadingRef = useRef(false);

  // Connect socket & handle incoming messages
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

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isLoggedIn]);

  // Load initial batch of messages when modal opens
  useEffect(() => {
    if (!isLoggedIn || !open || !socketRef.current) return;

    loadingRef.current = true;
    socketRef.current.emit("getMessages", { skip: 0, limit: BATCH_SIZE });

    socketRef.current.on("chatHistory", ({ messages: newMessages }) => {
      if (Array.isArray(newMessages)) {
        setMessages(newMessages);
        setSkip(newMessages.length);
        setHasMore(newMessages.length === BATCH_SIZE);
      } else {
        setMessages([]);
        setHasMore(false);
      }
      loadingRef.current = false;

      // Scroll to bottom on first load
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("chatHistory");
      }
    };
  }, [open, isLoggedIn]);

  // Lazy load older messages when scrolling near top
  const handleScroll = useCallback(() => {
    if (!messageContainerRef.current || loadingRef.current || !hasMore) return;

    const scrollTop = messageContainerRef.current.scrollTop;
    if (scrollTop < 100) {
      loadingRef.current = true;

      socketRef.current.emit("getMessages", { skip, limit: BATCH_SIZE });

      socketRef.current.once("chatHistory", ({ messages: olderMessages }) => {
        if (Array.isArray(olderMessages) && olderMessages.length > 0) {
          setMessages((prev) => [...olderMessages, ...prev]);
          setSkip((prev) => prev + olderMessages.length);

          // Maintain scroll position approximately
          if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight / 2;
          }
        } else {
          setHasMore(false);
        }
        loadingRef.current = false;
      });
    }
  }, [skip, hasMore]);

  // Attach scroll listener
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Send a new message
  const sendMessage = () => {
    if (newMessage.trim() && socketRef.current && userDetails?.id) {
      const messageData = {
        userId: userDetails.id,
        userName: userDetails.fullName,
        message: newMessage,
        repliedTo: replyingTo?._id || null,
      };

      socketRef.current.emit("sendMessage", messageData);
      setNewMessage("");
      setReplyingTo(null);
    }
  };

  // Get username safely
  const getUserName = (msg) => {
    if (!msg) return "Unknown";
    if (msg.userName) return msg.userName;
    if (msg.userId && typeof msg.userId === "object" && msg.userId.fullName)
      return msg.userId.fullName;
    return "User";
  };

  if (!isLoggedIn) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          bgcolor: "#6f42c1",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">Test Desk Chat</Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        ref={messageContainerRef}
        sx={{ bgcolor: "#f3e8ff", height: "500px", overflowY: "auto", p: 1 }}
      >
        <List>
          {Array.isArray(messages) &&
            messages.map((msg) => {
              const isOwnMessage =
                msg.userId === userDetails.id ||
                (typeof msg.userId === "object" && msg.userId._id === userDetails.id);

              const senderName = getUserName(msg);

              return (
                <ListItem
                  key={msg._id || Math.random()}
                  sx={{
                    justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                  }}
                >
                  <Paper
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      maxWidth: "75%",
                      bgcolor: isOwnMessage ? "#d6b3ff" : "white",
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      <strong>{senderName}</strong>
                    </Typography>
                    {msg.repliedTo && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 0.5 }}
                      >
                        Replying to:{" "}
                        <strong>
                          {getUserName(messages.find((m) => m._id === msg.repliedTo))}
                        </strong>
                      </Typography>
                    )}
                    <Typography variant="body2">{msg.message}</Typography>
                  </Paper>
                  <IconButton
                    onClick={() => setReplyingTo(msg)}
                    size="small"
                    sx={{ ml: 1 }}
                    aria-label="Reply"
                  >
                    <ReplyIcon fontSize="small" />
                  </IconButton>
                </ListItem>
              );
            })}
          <div ref={messagesEndRef} />
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 1, bgcolor: "#f3e8ff" }}>
        <Box sx={{ width: "100%" }}>
          {replyingTo && (
            <Paper
              sx={{
                p: 1,
                mb: 1,
                bgcolor: "#FFF",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                Replying to: <strong>{getUserName(replyingTo)}</strong>
              </Typography>
              <IconButton
                size="small"
                onClick={() => setReplyingTo(null)}
                aria-label="Cancel Reply"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Paper>
          )}
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              component="input"
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              sx={{
                flex: 1,
                p: 1,
                borderRadius: 2,
                border: "1px solid #ccc",
                bgcolor: "white",
                outline: "none",
              }}
            />
            <IconButton
              color="primary"
              onClick={sendMessage}
              sx={{ bgcolor: "#6f42c1", color: "white", p: 1.5, borderRadius: "50%" }}
              aria-label="Send Message"
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ChatModal;
