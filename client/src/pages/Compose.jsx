import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Collapse,
  IconButton,
  Input,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  EmojiEmotions,
  AttachFile,
  Close,
  OpenInFull,
  CloseFullscreen,
} from "@mui/icons-material";
import EmojiPicker from "emoji-picker-react";
import { sendEmail, saveDraft } from "../services/emailService";
import { toast } from "react-toastify";

const defaultEmail = {
  to: "",
  cc: "",
  bcc: "",
  subject: "",
  body: "",
  attachments: [],
};

export default function Compose({ onClose }) {
  const [email, setEmail] = useState(defaultEmail);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isFull, setFull] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const editorRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = email.body || "";
  }, []);

  const change = (e) =>
    setEmail((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const attach = (e) =>
    setEmail((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...e.target.files],
    }));

  const updateBody = (html) => setEmail((prev) => ({ ...prev, body: html }));

  const addEmoji = (emojiData) => {
    const emoji = emojiData.emoji;
    if (editorRef.current) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(emoji));
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      updateBody(editorRef.current.innerHTML);
    }
  };

  const buildForm = () => {
    const form = new FormData();
    form.append("from", localStorage.getItem("email") || "");
    ["to", "cc", "bcc", "subject", "body"].forEach((field) =>
      form.append(field, email[field] || "")
    );
    email.attachments.forEach((file) => form.append("attachments", file));
    return form;
  };

  const handleSend = async () => {
    if (!email.to.trim()) {
      return toast.error("Recipient email is required.");
    }

    if (isSending) return;
    setIsSending(true);

    try {
      await sendEmail(buildForm());
      toast.success("✅ Email sent successfully");
      setEmail(defaultEmail);
      setVisible(false);
      navigate("/inbox"); // ← Go to inbox
    } catch (error) {
      console.error("Send failed:", error);
      toast.error("❌ Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = async () => {
    const hasContent =
      email.to ||
      email.cc ||
      email.bcc ||
      email.subject ||
      email.body.trim() ||
      email.attachments.length;

    if (hasContent) {
      try {
        await saveDraft(buildForm());
        toast.info("💾 Draft saved");
      } catch (err) {
        console.error("Draft save failed:", err);
      }
    }

    onClose ? onClose() : setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {isFull && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.35)",
            zIndex: 1500,
          }}
        />
      )}

      <Box
        sx={{
          position: "fixed",
          bottom: isFull ? "50%" : 20,
          right: isFull ? "50%" : 80,
          transform: isFull ? "translate(50%,50%)" : "none",
          width: isFull ? "85vw" : 680,
          height: isFull ? "85vh" : 520,
          bgcolor: "#fff",
          boxShadow: 4,
          borderRadius: 2,
          zIndex: 1501,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1,
            bgcolor: "#f2f6fc",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Typography fontSize={14} fontWeight={600}>
            New Message
          </Typography>
          <Box>
            <IconButton size="small" onClick={() => setFull((prev) => !prev)}>
              {isFull ? (
                <CloseFullscreen fontSize="small" />
              ) : (
                <OpenInFull fontSize="small" />
              )}
            </IconButton>
            <IconButton size="small" onClick={handleClose}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Form */}
        <Box sx={{ px: 2, pt: 1, flex: 1, overflowY: "auto" }}>
          <Box display="flex" alignItems="center">
            <Typography sx={{ width: 50 }}>To</Typography>
            <Input
              fullWidth
              name="to"
              disableUnderline
              value={email.to}
              onChange={change}
            />
            <Button size="small" onClick={() => setShowCc((prev) => !prev)}>
              Cc
            </Button>
            <Button size="small" onClick={() => setShowBcc((prev) => !prev)}>
              Bcc
            </Button>
          </Box>
          <Box sx={{ borderBottom: "1px solid #ddd", my: 1 }} />

          <Collapse in={showCc}>
            <Box display="flex" alignItems="center">
              <Typography sx={{ width: 50 }}>Cc</Typography>
              <Input
                fullWidth
                name="cc"
                disableUnderline
                value={email.cc}
                onChange={change}
              />
            </Box>
            <Box sx={{ borderBottom: "1px solid #ddd", my: 1 }} />
          </Collapse>

          <Collapse in={showBcc}>
            <Box display="flex" alignItems="center">
              <Typography sx={{ width: 50 }}>Bcc</Typography>
              <Input
                fullWidth
                name="bcc"
                disableUnderline
                value={email.bcc}
                onChange={change}
              />
            </Box>
            <Box sx={{ borderBottom: "1px solid #ddd", my: 1 }} />
          </Collapse>

          <Box display="flex" alignItems="center">
            <Typography sx={{ width: 50 }}>Subject</Typography>
            <Input
              fullWidth
              name="subject"
              disableUnderline
              value={email.subject}
              onChange={change}
            />
          </Box>
          <Box sx={{ borderBottom: "1px solid #ddd", my: 1 }} />

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => updateBody(e.currentTarget.innerHTML)}
            style={{
              minHeight: "200px",
              padding: "8px",
              outline: "none",
              fontFamily: "Arial, sans-serif",
              fontSize: "14px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          />

          {showEmoji && (
            <Box
              sx={{
                position: "absolute",
                bottom: 90,
                left: 100,
                zIndex: 2000,
                bgcolor: "#fff",
                boxShadow: 3,
                borderRadius: 2,
                p: 1,
              }}
            >
              <Box sx={{ textAlign: "right" }}>
                <IconButton size="small" onClick={() => setShowEmoji(false)}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              <EmojiPicker onEmojiClick={addEmoji} />
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#0b57d0",
                borderRadius: 20,
                textTransform: "none",
                px: 3,
              }}
              onClick={handleSend}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send"}
            </Button>

            <Tooltip title="Attach file">
              <label>
                <IconButton component="span">
                  <AttachFile />
                </IconButton>
                <input type="file" hidden multiple onChange={attach} />
              </label>
            </Tooltip>

            <Tooltip title="Emoji">
              <IconButton onClick={() => setShowEmoji((prev) => !prev)}>
                <EmojiEmotions />
              </IconButton>
            </Tooltip>
          </Box>

          <Box display="flex" gap={1}>
            {email.attachments.map((file, index) => (
              <Typography key={index} fontSize={12}>
                {file.name}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
