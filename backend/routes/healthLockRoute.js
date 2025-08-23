import express from 'express';
import { uploadDocument, scanQRCode, getDocumentContent, getPatientDocuments, getDoctorDocuments, getAccessLogs, deleteDocument, getAvailableDoctors, upload } from '../controllers/healthLockController.js';
import authUser from '../middleware/authUser.js';
import authDoctor from '../middleware/authDoctor.js';

const router = express.Router();

// Patient routes (require user authentication)
router.post('/upload', authUser, upload.single('file'), uploadDocument);
router.get('/patient/documents', authUser, getPatientDocuments);
router.get('/patient/logs/:healthLockId?', authUser, getAccessLogs);
router.delete('/patient/documents/:healthLockId', authUser, deleteDocument);
router.get('/available-doctors', authUser, getAvailableDoctors);

// Doctor routes (require doctor authentication)
router.post('/scan-qr', authDoctor, scanQRCode);
router.get('/doctor/documents', authDoctor, getDoctorDocuments);
router.get('/document/:healthLockId/content', authDoctor, getDocumentContent);

export default router;
