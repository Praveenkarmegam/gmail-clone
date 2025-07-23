import React, { useState, useEffect } from 'react';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Box, Button, Collapse, Tooltip, IconButton
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import InboxIcon from '@mui/icons-material/Inbox';
import StarIcon from '@mui/icons-material/Star';
import SnoozeIcon from '@mui/icons-material/Snooze';
import SendIcon from '@mui/icons-material/Send';
import DraftsIcon from '@mui/icons-material/Drafts';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const expandedWidth = 240;
const collapsedWidth = 72;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const handleToggle = (e) => setCollapsed(!e.detail);
    window.addEventListener('toggleSidebar', handleToggle);
    return () => window.removeEventListener('toggleSidebar', handleToggle);
  }, []);

  const menuItems = [
    { label: 'Inbox', icon: <InboxIcon />, path: '/inbox' },
    { label: 'Starred', icon: <StarIcon />, path: '/starred' },
    { label: 'Snoozed', icon: <SnoozeIcon />, path: '/snoozed' },
    { label: 'Sent', icon: <SendIcon />, path: '/sent' },
    { label: 'Drafts', icon: <DraftsIcon />, path: '/drafts' },
  ];

  const moreItems = [
    { label: 'Trash', icon: <DeleteOutlineIcon />, path: '/trash' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : expandedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? collapsedWidth : expandedWidth,
          transition: 'width 0.3s ease',
          backgroundColor: '#f9fafe',
          borderRight: '1px solid #f9fafe',
          overflowX: 'hidden',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ padding: '16px 12px' }}>
        <Tooltip title="Compose" placement="right" disableHoverListener={!collapsed}>
          <Button
            variant="contained"
            onClick={() => navigate('/compose')}
            startIcon={!collapsed && <EditIcon />}
            sx={{
              backgroundColor: '#c2e7ff',
              color: '#001d35',
              fontWeight: 600,
              borderRadius: '30px',
              marginBottom: 3,
              textTransform: 'none',
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? 1 : '10px 20px',
              width: collapsed ? 48 : '100%',
              minWidth: collapsed ? 48 : undefined,
              height: collapsed ? 48 : undefined,
            }}
          >
            {collapsed ? <EditIcon /> : 'Compose'}
          </Button>
        </Tooltip>

        <List>
          {[...menuItems, { label: 'More', icon: showMore ? <ExpandLessIcon /> : <ExpandMoreIcon />, path: null }].map((item, index) => {
            if (item.label === 'More') {
              return (
                <Tooltip title={collapsed ? 'More' : ''} placement="right" key={item.label}>
                  <ListItemButton
                    onClick={() => setShowMore(!showMore)}
                    sx={{
                      borderRadius: collapsed ? 2 : '0 20px 20px 0',
                      padding: '8px 12px',
                      marginBottom: '4px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      '&:hover': { backgroundColor: '#f1f3f4' },
                    }}
                  >
                    <ListItemIcon sx={{ color: '#5f6368', minWidth: 0, marginRight: collapsed ? 0 : 2 }}>{item.icon}</ListItemIcon>
                    {!collapsed && <ListItemText primary={item.label} />}
                  </ListItemButton>
                </Tooltip>
              );
            }

            const isActive = location.pathname === item.path;
            return (
              <Tooltip title={collapsed ? item.label : ''} placement="right" key={item.label}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: collapsed ? 2 : '0 20px 20px 0',
                    padding: '8px 12px',
                    marginBottom: '4px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    backgroundColor: isActive ? '#e8f0fe' : 'inherit',
                    borderLeft: isActive ? '4px solid #1a73e8' : 'none',
                    '&:hover': { backgroundColor: '#f1f3f4' },
                  }}
                >
                  <ListItemIcon sx={{
                    color: isActive ? '#1a73e8' : '#5f6368',
                    minWidth: 0,
                    marginRight: collapsed ? 0 : 2,
                  }}>{item.icon}</ListItemIcon>
                  {!collapsed && <ListItemText primary={item.label} sx={{
                    '& .MuiTypography-root': {
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.95rem',
                      color: isActive ? '#1a73e8' : '#202124',
                    }
                  }} />}
                </ListItemButton>
              </Tooltip>
            );
          })}

          <Collapse in={showMore}>
            {moreItems.map(({ label, icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <Tooltip title={collapsed ? label : ''} placement="right" key={label}>
                  <ListItemButton
                    onClick={() => navigate(path)}
                    sx={{
                      pl: collapsed ? 1.5 : 4,
                      borderRadius: collapsed ? 2 : '0 20px 20px 0',
                      padding: '8px 12px',
                      marginBottom: '4px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      backgroundColor: isActive ? '#e8f0fe' : 'inherit',
                      borderLeft: isActive ? '4px solid #1a73e8' : 'none',
                      '&:hover': { backgroundColor: '#f1f3f4' },
                    }}
                  >
                    <ListItemIcon sx={{ color: isActive ? '#1a73e8' : '#5f6368', minWidth: 0, marginRight: collapsed ? 0 : 2 }}>{icon}</ListItemIcon>
                    {!collapsed && <ListItemText primary={label} sx={{
                      '& .MuiTypography-root': {
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.95rem',
                        color: isActive ? '#1a73e8' : '#202124',
                      }
                    }} />}
                  </ListItemButton>
                </Tooltip>
              );
            })}
          </Collapse>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
