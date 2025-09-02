import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  from:  { type: String, default: '' }, 
  to:    { type: String, default: '' },
  cc:    { type: String, default: '' },
  bcc:   { type: String, default: '' },

  subject:     { type: String, default: '' },
  body:        { type: String, default: '' },
  attachments: [{ type: String }],

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
