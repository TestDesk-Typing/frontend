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
  Avatar,
  Modal,
  Divider,
  Grid
} from "@mui/material";
import { Close as CloseIcon, Reply as ReplyIcon, Send as SendIcon } from "@mui/icons-material";
import { useAuth } from "../AuthContext/AuthContext";
import { useSocket } from "../SocketProvider";
import axios from "axios";

const ChatModal = ({ open, onClose }) => {
  const { userDetails, isLoggedIn } = useAuth();
  const { messages, sendMessage, loadMessages, hasMore } = useSocket();

  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);

  const messageContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 100);
    }
  }, [open]);

  const handleScroll = useCallback(() => {
    if (!messageContainerRef.current || loadingRef.current || !hasMore) return;

    if (messageContainerRef.current.scrollTop < 100) {
      loadingRef.current = true;
      const previousScrollHeight = messageContainerRef.current.scrollHeight;
      loadMessages();
      setTimeout(() => {
        const newScrollHeight = messageContainerRef.current.scrollHeight;
        messageContainerRef.current.scrollTop = newScrollHeight - previousScrollHeight;
        loadingRef.current = false;
      }, 500);
    }
  }, [hasMore, loadMessages]);

  useEffect(() => {
    if (!open) return;
    const container = messageContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll, open]);

  const sendChatMessage = () => {
    if (!newMessage.trim() || !userDetails) return;

    sendMessage({
      userId: userDetails.id,
      userName: userDetails.fullName,
      profile_pic: userDetails.profile_pic,
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
      if (typeof msg.userId === "object" && msg.userId.full_name) return msg.userId.full_name;
      if (typeof msg.userId === "string" || typeof msg.userId === "number") return `User ${msg.userId}`;
    }
    return "User";
  };

  const getUserProfilePic = (msg) => {
    if (msg.profile_pic) return `${process.env.REACT_APP_API_URL}${msg.profile_pic}`;
    if (msg.userId && typeof msg.userId === "object" && msg.userId.profile_pic)
      return `${process.env.REACT_APP_API_URL}${msg.userId.profile_pic}`;
    return require("../i/profile.png");
  };

  const handleAvatarClick = async (msg) => {
    try {
      const id = typeof msg.userId === "object" ? msg.userId._id : msg.userId;
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get-user-details/${id}`);
      setSelectedUser(res.data);
      setUserModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const closeUserModal = () => {
    setUserModalOpen(false);
    setSelectedUser(null);
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
                {!isOwnMessage && (
                  <Avatar
                    src={getUserProfilePic(msg)}
                    alt={getUserName(msg)}
                    sx={{ width: 32, height: 32, mr: 1, cursor: "pointer" }}
                    onClick={() => handleAvatarClick(msg)}
                  />
                )}
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
                {isOwnMessage && (
                  <Avatar
                    src={getUserProfilePic(msg)}
                    alt={getUserName(msg)}
                    sx={{ width: 32, height: 32, ml: 1, cursor: "pointer" }}
                    onClick={() => handleAvatarClick(msg)}
                  />
                )}
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

      <Modal open={userModalOpen} onClose={closeUserModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#fff",
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
            minWidth: 350,
            maxWidth: 500,
          }}
        >
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={closeUserModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedUser && (
            <>
              <Box textAlign="center" mb={2}>
                <Avatar
                  src={`${process.env.REACT_APP_API_URL}${selectedUser.profile_pic}`}
                  sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}
                />
                <Typography variant="h6">{selectedUser.full_name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUser.email_id}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Gender:</Typography>
                  <Typography variant="body1">{selectedUser.gender}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">DOB:</Typography>
                  <Typography variant="body1">{new Date(selectedUser.dob).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">City:</Typography>
                  <Typography variant="body1">{selectedUser.city_name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Category:</Typography>
                  <Typography variant="body1">{selectedUser.category}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Membership:</Typography>
                  <Typography variant="body1">{selectedUser.membership}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Exam:</Typography>
                  <Typography variant="body1">{selectedUser.exam_shortcut}</Typography>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Modal>
    </Dialog>
  );
};

export default ChatModal;
