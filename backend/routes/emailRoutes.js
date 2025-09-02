import express from 'express';
import upload from '../utils/multer.js';
import {
  sendEmail, getEmailsByFolder, toggleReadStatus,
  toggleStarStatus, moveToTrash, updateFolder, saveDraft,
  emptyTrash, getEmailById, restoreFromTrash, deleteForever,
  snoozeEmailById
} from '../controllers/emailController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(verifyToken); // ⬅️ protect all routes

router.post('/send', upload, sendEmail);
router.get('/item/:id', getEmailById);
router.put('/:id/read', toggleReadStatus);
router.put('/:id/star', toggleStarStatus);
router.patch('/:id/snooze', snoozeEmailById); // ✅ MOVE ABOVE
router.patch('/restore/:id', restoreFromTrash);
router.delete('/delete-forever/:id', deleteForever);
router.delete('/folder/trash', emptyTrash);
router.patch('/:id', updateFolder);
router.delete('/:id', moveToTrash);
router.post('/draft', upload, saveDraft);

// 🚨 KEEP THIS LAST
router.get('/:folder', getEmailsByFolder);

export default router;
