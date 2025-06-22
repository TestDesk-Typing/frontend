import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  List,
  ListItem,
  Paper,
  Box,
} from "@mui/material";
import { Close as CloseIcon, Reply as ReplyIcon, Send as SendIcon } from "@mui/icons-material";
import { useAuth } from "../AuthContext/AuthContext";
import { useSocket } from "../SocketProvider";

const ChatModal = ({ open, onClose }) => {
  const { userDetails, isLoggedIn } = useAuth();
  const { messages, sendMessage, loadMessages, hasMore } = useSocket();

  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const messageContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const loadingRef = useRef(false);

  // Lazy loading older messages when scrolled near top
  const handleScroll = useCallback(() => {
    if (!messageContainerRef.current || loadingRef.current || !hasMore) return;

    if (messageContainerRef.current.scrollTop < 100) {
      loadingRef.current = true;
      loadMessages();
      setTimeout(() => {
        loadingRef.current = false;
      }, 1000);
    }
  }, [hasMore, loadMessages]);

  // Attach scroll event listener
  useEffect(() => {
    if (!open) return;

    const container = messageContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll, open]);

  // Scroll to bottom only once when modal is opened
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 100);
    }
  }, [open]);

  const sendChatMessage = () => {
    if (!newMessage.trim() || !userDetails) return;

    sendMessage({
      userId: userDetails.id,
      userName: userDetails.fullName,
      message: newMessage,
      repliedTo: replyingTo?._id || null,
    });

    setNewMessage("");
    setReplyingTo(null);
  };

  const getUserName = (msg) => {
    if (!msg) return "Unknown";
    if (msg.userName) return msg.userName;
    if (msg.userId) {
      if (typeof msg.userId === "object" && msg.userId.fullName) return msg.userId.fullName;
      if (typeof msg.userId === "string" || typeof msg.userId === "number") return `User ${msg.userId}`;
    }
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
          {messages.map((msg) => {
            const isOwnMessage =
              msg.userId === userDetails.id ||
              (typeof msg.userId === "object" && msg.userId._id === userDetails.id);

            return (
              <ListItem
                key={msg._id || Math.random()}
                sx={{ justifyContent: isOwnMessage ? "flex-end" : "flex-start" }}
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
                    <strong>{getUserName(msg)}</strong>
                  </Typography>
                  {msg.repliedTo && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.5, fontStyle: "italic" }}
                    >
                      {msg.repliedTo.message || "Unknown message"}
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
              onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
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
              onClick={sendChatMessage}
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
