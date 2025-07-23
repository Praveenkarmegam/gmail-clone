import React, { useEffect, useState } from "react";
import MailCard from "./MailCard";
import { Stack, Typography } from "@mui/material";
import {
  getInboxEmails,
  getStarredEmails,
  getSentEmails,
  getDraftEmails,
  getSnoozedEmails,
  getTrashEmails,
} from "../services/emailService";

const MailList = ({ folder }) => {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        let data = [];

        switch (folder) {
          case "starred":
            data = (await getStarredEmails()).filter(email => email.starred);
            break;
          case "sent":
            data = await getSentEmails();
            break;
          case "drafts":
            data = (await getDraftEmails()).filter(email => !email.sent);
            break;
          case "snoozed":
            data = await getSnoozedEmails();
            break;
          case "trash":
            data = await getTrashEmails();
            break;
          default:
            data = await getInboxEmails();
        }

        setEmails(data);
      } catch (err) {
        console.error("Failed to fetch emails:", err);
      }
    };

    fetchEmails();
  }, [folder]);

  if (!emails.length) {
    const emptyMsgs = {
      inbox: "No emails in your inbox",
      starred: "No starred emails yet",
      sent: "No sent emails",
      drafts: "No drafts saved",
      snoozed: "No snoozed emails",
      trash: "Trash is empty",
    };
    return (
      <Typography variant="body2" sx={{ color: '#888', mt: 3, textAlign: 'center' }}>
        {emptyMsgs[folder] || "No emails found"}
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {emails.map((email) => (
        <MailCard key={email._id} email={email} folder={folder} />
      ))}
    </Stack>
  );
};

export default MailList;