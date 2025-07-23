import React from 'react'
import { Typography, Box, Divider } from '@mui/material'
import MailList from '../components/MailList'
import MailToolbar from "../components/MailToolbar";


const Sent = () => {
  return (
    <Box >
      {/* Sticky Gmail-style Toolbar */}
      <MailToolbar />
      <MailList folder="sent" />
    </Box>
  )
}

export default Sent
