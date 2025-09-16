import express from 'express';
import {askToAssistant} from '../controllers/assistant.controller.js';
import isAuthenticated from '../middlewares/authentication.middleware.js';

const router = express.Router();

router.post('/ask-to-assistant', isAuthenticated, askToAssistant);

export default router;
