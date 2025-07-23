import React from 'react';
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const MailToolbar = () => {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 70,
        zIndex: 10,
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        px: 1,
        py: 1,
        mb: 1,
      }}
    >
      <Checkbox size="small" />
      <Tooltip title="Refresh">
        <IconButton size="small"><RefreshIcon /></IconButton>
      </Tooltip>
      <Tooltip title="More">
        <IconButton size="small"><MoreVertIcon /></IconButton>
      </Tooltip>
    </Box>
  );
};

export default MailToolbar;
