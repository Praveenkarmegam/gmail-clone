import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box sx={{ display: 'flex' }}>
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <Box sx={{ flexGrow: 1, p: 2, mt: '64px' }}>
          {children}
        </Box>
      </Box>
    </>
  );
};

export default AppLayout;
