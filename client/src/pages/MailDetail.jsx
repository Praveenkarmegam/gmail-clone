import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  Avatar,
  CircularProgress,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getEmailById, markAsRead } from "../services/emailService";

const MailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the email by ID
  useEffect(() => {
    const fetchMail = async () => {
      try {
        const data = await getEmailById(id);
        setEmail(data);

        // Mark as read if unread
        if (data?.isUnread) {
          await markAsRead(id);
        }
      } catch (error) {
        console.error("Failed to fetch mail:", error);
        setEmail(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMail();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!email) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
        Mail not found
      </Typography>
    );
  }

  const {
    subject = "No Subject",
    from = "Unknown sender",
    to = "you",
    body = "(No message)",
    date,
    attachments = [],
  } = email;

  const formattedDate = date
    ? new Date(date).toLocaleString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Invalid Date";

  return (
    <Box sx={{ width: "100%", backgroundColor: "#fff", p: 2 }}>
      {/* Back Button */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Tooltip title="Back">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Subject */}
      <Typography variant="h5" fontWeight={600} gutterBottom sx={{ wordBreak: "break-word" }}>
        {subject}
      </Typography>

      {/* Sender Info */}
      <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar>{from[0]?.toUpperCase()}</Avatar>
          <Box>
            <Typography fontWeight={500}>{from}</Typography>
            <Typography variant="body2" color="text.secondary">to {to}</Typography>
          </Box>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
          {formattedDate}
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Body */}
      <Typography
        variant="body1"
        sx={{
          whiteSpace: "pre-wrap",
          lineHeight: 1.8,
          color: "#444",
        }}
      >
        {body}
      </Typography>

      {/* Attachments */}
      {attachments.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Attachments:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {attachments.map((file, index) => {
              const fileUrl = `http://localhost:5000/${file}`;
              const filename = file.split("/").pop();
              const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);

              return (
                <Box key={index} sx={{ maxWidth: 200 }}>
                  {isImage ? (
                    <img
                      src={fileUrl}
                      alt={`attachment-${index}`}
                      style={{
                        width: '100%',
                        borderRadius: 4,
                        objectFit: 'cover',
                        border: '1px solid #ccc',
                      }}
                    />
                  ) : (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: '#1a73e8' }}
                    >
                      📎 {filename}
                    </a>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MailDetail;
