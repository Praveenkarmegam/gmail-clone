import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import MailToolbar from "../components/MailToolbar";
import MailList from "../components/MailList";

const tabStyles = {
  minWidth: 120,
  fontWeight: 500,
  textTransform: "none",
  color: "#5f6368",
  "&.Mui-selected": {
    color: "#1a73e8",
    borderBottom: "2px solid #1a73e8",
  },
};

const Inbox = () => {
  const [activeTab, setActiveTab] = useState("primary");

  return (
    <Box>
      <MailToolbar />
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{
          borderBottom: "1px solid #ddd",
          mt: 1,
        }}
        TabIndicatorProps={{ style: { display: "none" } }}
      >
        <Tab label="Primary" value="primary" sx={tabStyles} />
        <Tab label="Promotions" value="promotions" sx={tabStyles} />
        <Tab label="Social" value="social" sx={tabStyles} />
      </Tabs>

      <MailList folder="inbox" category={activeTab} />
    </Box>
  );
};

export default Inbox;
