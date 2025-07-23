// Header.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Paper,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AppsIcon from '@mui/icons-material/Apps';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleClose();
    logout();
  };

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setSidebarOpen(newState);
    window.dispatchEvent(new CustomEvent('toggleSidebar', { detail: newState }));
  };

  return (
    <AppBar position="fixed" elevation={0} sx={{
      backgroundColor: '#f9fafe',
      color: 'black',
      borderBottom: '1px solid #f9fafe',
      height: '70px',
      zIndex: 1300,
    }}>
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '70px',
        px: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={toggleSidebar} sx={{ color: '#5f6368' }}>
            <MenuIcon />
          </IconButton>
          <img
            src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png"
            alt="Gmail"
            style={{ height: 36 }}
          />
        </Box>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Paper component="form" sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f1f3f4',
            borderRadius: '24px',
            px: 2,
            height: 44,
            width: '60%',
            maxWidth: 800,
            boxShadow: 'none',
          }}>
            <SearchIcon sx={{ mr: 1.5, color: '#5f6368' }} />
            <InputBase
              placeholder="Search mail"
              inputProps={{ 'aria-label': 'search mail' }}
              sx={{ flex: 1, fontSize: 15 }}
            />
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton sx={{ color: '#5f6368' }}>
            <AppsIcon />
          </IconButton>
          <IconButton sx={{ color: '#5f6368' }}>
            <NotificationsIcon />
          </IconButton>
          <IconButton onClick={handleAvatarClick}>
            <Avatar sx={{ width: 36, height: 36, backgroundColor: '#1a73e8' }}>U</Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
