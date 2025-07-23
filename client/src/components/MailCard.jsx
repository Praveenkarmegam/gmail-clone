import React, { useState } from 'react';
import {
  Box, Typography, IconButton, Checkbox, Tooltip
} from '@mui/material';
import {
  StarOutline, Star, Delete, MarkEmailRead, Snooze,
  RestoreFromTrash as RestoreIcon, DeleteForever as DeleteForeverIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  deleteEmailById,
  toggleStar,
  snoozeEmail,
  markAsRead,
  restoreFromTrash,
  deleteForever
} from '../services/emailService'; // Ensure these exist in backend & service

const MailCard = ({ email, folder }) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [localEmail, setLocalEmail] = useState(email);

  const isUnread = localEmail.isUnread;

  // Functions
  const handleStarToggle = async () => {
    try {
      await toggleStar(localEmail._id);
      setLocalEmail(prev => ({ ...prev, starred: !prev.starred }));
    } catch (err) {
      console.error("Error toggling star", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEmailById(localEmail._id);
      window.location.reload(); // Optional: replace with state update for better UX
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      await markAsRead(localEmail._id);
      setLocalEmail(prev => ({ ...prev, isUnread: false }));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleSnooze = async () => {
    try {
      await snoozeEmail(localEmail._id);
      window.location.reload();
    } catch (err) {
      console.error("Snooze failed", err);
    }
  };

  const handleRestore = async () => {
    try {
      await restoreFromTrash(localEmail._id);
      window.location.reload();
    } catch (err) {
      console.error("Restore failed", err);
    }
  };

  const handleDeleteForever = async () => {
    try {
      await deleteForever(localEmail._id);
      window.location.reload();
    } catch (err) {
      console.error("Delete forever failed", err);
    }
  };

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => navigate(`/mail/${localEmail._id}`)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: 56,
        px: 2,
        borderBottom: '1px solid #e0e0e0',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        backgroundColor: hover ? '#f1f3f4' : 'transparent',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 72 }}>
        <Checkbox size="small" onClick={(e) => e.stopPropagation()} />
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleStarToggle(); }}>
          {localEmail.starred ? <Star color="warning" /> : <StarOutline />}
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, pl: 2 }}>
        <Typography
          noWrap
          sx={{
            fontSize: '0.9rem',
            fontWeight: isUnread ? 500 : 400,
            color: isUnread ? '#202124' : '#5f6368',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}
        >
          {localEmail.from}
        </Typography>
        <Typography
          noWrap
          sx={{
            fontSize: '0.9rem',
            color: '#5f6368',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}
        >
          {folder === "drafts" ? "(Draft) " : ""}
          <strong style={{ fontWeight: isUnread ? 'bold' : 'normal' }}>{localEmail.subject}</strong>
          {' — '}
          <span style={{ fontWeight: folder === 'drafts' ? 'normal' : undefined }}>
            {localEmail.body?.replace(/<[^>]+>/g, '').slice(0, 60) || ''}
          </span>
        </Typography>
      </Box>

      <Box sx={{ minWidth: 150, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {folder === "trash" && hover ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Restore">
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleRestore(); }}>
                <RestoreIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Forever">
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteForever(); }}>
                <DeleteForeverIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : hover ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Mark as read">
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleMarkAsRead(); }}>
                <MarkEmailRead fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Snooze">
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleSnooze(); }}>
                <Snooze fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{ fontSize: '0.8rem', color: '#5f6368', display: { xs: 'none', sm: 'block' } }}
          >
            {new Date(localEmail.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default MailCard;
