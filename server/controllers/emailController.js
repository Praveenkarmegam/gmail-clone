import path from "path";
import Email from "../models/Email.js";
import sendMail from "../utils/nodemailer.js";

// helper for uniform replies
const ok = (res, data, msg = "OK") =>
  res.json({ success: true, message: msg, data });
const fail = (res, code, msg) =>
  res.status(code).json({ success: false, message: msg });

export const sendEmail = async (req, res) => {
  try {
    /* ---------------------------------------------------------- */
    /* 1. Validate input                                          */
    /* ---------------------------------------------------------- */
    const { to, subject = '', body = '' } = req.body;
    if (!to) return fail(res, 400, '“to” field is required');

    /* ---------------------------------------------------------- */
    /* 2. Build attachment paths                                  */
    /* ---------------------------------------------------------- */
    const files     = req.files ?? [];
    const absPaths  = files.map(f => path.resolve(f.path));
    const relPaths  = files.map(f => f.path);

    /* ---------------------------------------------------------- */
    /* 3. Always send “from” as your Gmail login                  */
    /*    (Gmail blocks spoofed from addresses)                   */
    /* ---------------------------------------------------------- */
    const fromAddr  = process.env.EMAIL_USER; // e.g. you@gmail.com

    /* ---------------------------------------------------------- */
    /* 4. Send email via reusable util                            */
    /* ---------------------------------------------------------- */
    await sendMail({
      from: fromAddr,
      to,
      subject,
      text: body.replace(/<[^>]*>?/gm, ''),   // plain text
      html: body,                             // keep formatting
      attachments: absPaths.map(p => ({ path: p })),
    });

    /* ---------------------------------------------------------- */
    /* 5. Save in DB (mark “from” as logged‑in user email)        */
    /* ---------------------------------------------------------- */
    const emailDoc = await Email.create({
      userId: req.user.userId,
      from:   fromAddr,
      to,
      subject,
      body,
      folder: 'sent',
      attachments: relPaths,
    });

    return ok(res, emailDoc, 'Email sent & saved');
  } catch (err) {
    /* ---------------------------------------------------------- */
    /* 6. Log full stack and return 500 for debugging             */
    /* ---------------------------------------------------------- */
    console.error('❌ sendEmail error:', err);
    return fail(res, 500, err.message);
  }
};

export const getEmailsByFolder = async (req, res) => {
  const { folder } = req.params;
  try {
    const filter = { userId: req.user.userId };

    if (folder === 'starred') {
      filter.starred = true;
    } else {
      filter.folder = folder;
    }

    const emails = await Email.find(filter).sort({ date: -1 });
    ok(res, emails);
  } catch (err) {
    fail(res, 500, err.message);
  }
};

export const getEmailById = async (req, res) => {
  try {
    const email = await Email.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!email) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    return res.json({ success: true, message: "OK", data: email });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const toggleReadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const email = await Email.findOne({ _id: id, userId });

    if (!email) return res.status(404).json({ message: "Email not found" });

    email.isUnread = false; // mark as read
    await email.save();

    res.json({ success: true, message: "Marked as read", data: email });
  } catch (err) {
    console.error("❌ toggleReadStatus error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const toggleStarStatus = async (req, res) => {
  try {
    const email = await Email.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!email) return fail(res, 404, 'Email not found');

    email.starred = !email.starred;
    await email.save();

    ok(res, email, 'Star status toggled');
  } catch (err) {
    console.error('❌ toggleStarStatus error:', err);
    fail(res, 500, err.message);
  }
};


export const moveToTrash = async (req, res) => {
  try {
    await Email.updateOne(
      { _id: req.params.id, userId: req.user.userId },
      { folder: "trash" }
    );
    ok(res, null, "Moved to trash");
  } catch (err) {
    fail(res, 500, err.message);
  }
};

// inside controllers/emailController.js
export const updateFolder = async (req, res) => {
  const { folder } = req.body; // e.g. 'inbox'
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { folder },
      { new: true }
    );
    res.json({ success: true, message: "Folder updated", data: email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// add / replace inside controllers/emailController.js
export const saveDraft = async (req, res) => {
  try {
    const {
      from = process.env.EMAIL_USER,  // fall back to logged‑in address
      to   = '',
      cc   = '',
      bcc  = '',
      subject = '',
      body    = '',
    } = req.body;

    const files    = req.files ?? [];
    const relPaths = files.map(f => f.path);

    const draft = await Email.create({
      userId: req.user.userId,
      from,
      to,
      cc,
      bcc,
      subject,
      body,
      folder: 'drafts',
      attachments: relPaths,
    });

    res.json({ success: true, message: 'Draft saved', data: draft });
  } catch (err) {
    console.error('❌ saveDraft error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const emptyTrash = async (req, res) => {
  try {
    await Email.deleteMany({ folder: 'trash', userId: req.user.userId });
    res.json({ success: true, message: 'Trash emptied' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const restoreFromTrash = async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, folder: 'trash', userId: req.user.userId },
      { folder: 'inbox' }, // or 'drafts' based on need
      { new: true }
    );
    res.json({ success: true, message: 'Restored from trash', data: email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const deleteForever = async (req, res) => {
  try {
    await Email.deleteOne({ _id: req.params.id, folder: 'trash', userId: req.user.userId });
    res.json({ success: true, message: 'Deleted permanently' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const snoozeEmailById = async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { folder: 'snoozed' },
      { new: true }
    );
    res.json({ success: true, message: 'Email snoozed', data: email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


