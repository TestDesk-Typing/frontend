import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
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

// Initialize socket connection
const socket = io(process.env.REACT_APP_API_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const ChatModal = ({ open, onClose }) => {
  const { userDetails, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/chat-history`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    if (open) {
      fetchChatHistory();
    }
  }, [open, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const handleReceiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        userId: userDetails.id, // Ensure correct userId is sent
        message: newMessage,
        repliedTo: replyingTo?._id || null,
      };

      console.log("Sending Message:", messageData);

      socket.emit("sendMessage", messageData);
      setMessages((prev) => [...prev, messageData]); // Optimistic UI update
      setNewMessage("");
      setReplyingTo(null);
    }
  };

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
        <Typography variant="h6">Test Desk</Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: "#f3e8ff", height: "500px", overflowY: "auto", p: 1 }}>
        <List>
          {messages.map((msg) => (
            <ListItem
              key={msg._id || Math.random()} // Ensure unique keys
              sx={{
                justifyContent: msg.userId === userDetails.id ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                sx={{
                  p: 1,
                  borderRadius: 2,
                  maxWidth: "75%",
                  bgcolor: msg.userId === userDetails.id ? "#d6b3ff" : "white",
                  boxShadow: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  <strong>{msg.full_name || "User"}</strong>
                </Typography>
                {msg.repliedTo && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                    Replying to:{" "}
                    <strong>
                      {messages.find((m) => m._id === msg.repliedTo)?.full_name || "Unknown"}
                    </strong>
                  </Typography>
                )}
                <Typography variant="body2">{msg.message}</Typography>
              </Paper>
              <IconButton onClick={() => setReplyingTo(msg)} size="small" sx={{ ml: 1 }}>
                <ReplyIcon fontSize="small" />
              </IconButton>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 1, bgcolor: "#f3e8ff" }}>
        <Box sx={{ width: "100%" }}>
          {replyingTo && (
            <Paper sx={{ p: 1, mb: 1, bgcolor: "#FFF", borderRadius: 2, display: "flex", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                Replying to: <strong>{replyingTo.full_name || "User"}</strong>
              </Typography>
              <IconButton size="small" onClick={() => setReplyingTo(null)}>
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
