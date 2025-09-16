import express from 'express';
import { getCurrentUser, updateAssistant } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/authentication.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.get('/current-user', isAuthenticated, getCurrentUser);
router.put('/update-assistant', isAuthenticated, upload.single('assistantImage'), updateAssistant);


export default router;