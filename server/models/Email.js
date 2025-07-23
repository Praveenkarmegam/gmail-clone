// models/Email.js
import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  /* ───── sender / recipients ───── */
  from:  { type: String, default: '' },   // not required for drafts
  to:    { type: String, default: '' },
  cc:    { type: String, default: '' },
  bcc:   { type: String, default: '' },

  /* ───── content ───── */
  subject:     { type: String, default: '' },
  body:        { type: String, default: '' },
  attachments: [{ type: String }],

  /* ───── meta ───── */
  date:    { type: Date, default: Date.now },
  folder:  {
    type: String,
    enum: ['inbox', 'sent', 'drafts', 'trash', 'snoozed'],
    default: 'inbox',
  },
  starred:  { type: Boolean, default: false },
  isUnread: { type: Boolean, default: true },
});

export default mongoose.model('Email', EmailSchema);
