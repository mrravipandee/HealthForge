import HealthLock from '../models/healthLockModel.js';
import AccessLog from '../models/accessLogModel.js';
import User from '../models/userModel.js';
import Doctor from '../models/doctorModel.js';
import encryptionService from '../utils/encryption.js';
import qrGenerator from '../utils/qrGenerator.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/healthlock';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'healthlock-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and images are allowed.'), false);
        }
    }
});

// Upload and encrypt document
const uploadDocument = async (req, res) => {
    try {
        const { doctorId, role, permissions, description, expiryMinutes } = req.body;
        const patientId = req.userId;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Validate doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Read file buffer
        const fileBuffer = fs.readFileSync(req.file.path);
        
        // Encrypt file
        const { encryptedData, hash } = encryptionService.encryptFile(fileBuffer);
        
        // Save encrypted file
        const encryptedFileName = `encrypted-${req.file.filename}`;
        const encryptedFilePath = path.join('uploads/healthlock', encryptedFileName);
        fs.writeFileSync(encryptedFilePath, encryptedData);

        // Determine file type
        let fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
        if (req.file.originalname.toLowerCase().includes('prescription')) {
            fileType = 'prescription';
        } else if (req.file.originalname.toLowerCase().includes('lab') || req.file.originalname.toLowerCase().includes('report')) {
            fileType = 'lab-report';
        } else if (req.file.originalname.toLowerCase().includes('xray')) {
            fileType = 'xray';
        }

        // Create HealthLock record
        const healthLock = new HealthLock({
            patientId,
            doctorId,
            fileName: encryptedFileName,
            originalFileName: req.file.originalname,
            fileType,
            fileSize: req.file.size,
            encryptedFileUrl: encryptedFilePath,
            fileHash: hash,
            role: role || 'doctor',
            permissions: permissions || 'full',
            description: description || ''
        });

        await healthLock.save();

        // Generate QR code data
        const qrData = qrGenerator.generateQRData(healthLock, parseInt(expiryMinutes) || 30);

        // Clean up original file
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: 'Document uploaded and encrypted successfully',
            data: {
                healthLockId: healthLock._id,
                qrData: qrData.qrData,
                expiry: qrData.expiry,
                fileName: req.file.originalname,
                fileType,
                fileSize: req.file.size
            }
        });

    } catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload document',
            error: error.message
        });
    }
};

// Scan QR code and access document
const scanQRCode = async (req, res) => {
    try {
        const { qrData } = req.body;
        const doctorId = req.doctorId || req.userId;

        if (!qrData) {
            return res.status(400).json({
                success: false,
                message: 'QR data is required'
            });
        }

        // Parse QR data
        let parsedData;
        try {
            parsedData = JSON.parse(qrData);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid QR data format'
            });
        }

        // Verify JWT token
        const tokenVerification = qrGenerator.verifyAccessToken(parsedData.token);
        if (!tokenVerification.valid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired QR code',
                error: tokenVerification.error
            });
        }

        const payload = tokenVerification.payload;

        // Verify doctor access
        if (payload.doctorId !== doctorId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. This QR code is not for you.'
            });
        }

        // Get HealthLock record
        const healthLock = await HealthLock.findById(payload.healthLockId)
            .populate('patientId', 'name email')
            .populate('doctorId', 'name email speciality');

        if (!healthLock) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Log access
        const accessLog = new AccessLog({
            healthLockId: healthLock._id,
            patientId: healthLock.patientId._id,
            doctorId: doctorId,
            accessType: 'qr-scan',
            accessMethod: 'qr-code',
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            success: true
        });

        await accessLog.save();

        res.json({
            success: true,
            message: 'QR code scanned successfully',
            data: {
                healthLockId: healthLock._id,
                fileName: healthLock.originalFileName,
                fileType: healthLock.fileType,
                fileSize: healthLock.fileSize,
                description: healthLock.description,
                patientName: healthLock.patientId.name,
                doctorName: healthLock.doctorId.name,
                role: healthLock.role,
                permissions: healthLock.permissions,
                createdAt: healthLock.createdAt,
                accessToken: parsedData.token
            }
        });

    } catch (error) {
        console.error('Scan QR code error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to scan QR code',
            error: error.message
        });
    }
};

// Get document content (decrypted)
const getDocumentContent = async (req, res) => {
    try {
        const { healthLockId } = req.params;
        const doctorId = req.doctorId || req.userId;
        const { accessToken } = req.headers;

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        // Verify access token
        const tokenVerification = qrGenerator.verifyAccessToken(accessToken);
        if (!tokenVerification.valid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired access token'
            });
        }

        const payload = tokenVerification.payload;

        // Verify HealthLock access
        if (payload.healthLockId !== healthLockId || payload.doctorId !== doctorId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Get HealthLock record
        const healthLock = await HealthLock.findById(healthLockId);
        if (!healthLock) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Read encrypted file
        const encryptedBuffer = fs.readFileSync(healthLock.encryptedFileUrl);
        
        // Decrypt file
        const decryptedBuffer = encryptionService.decryptFile(encryptedBuffer);

        // Verify file integrity
        if (!encryptionService.verifyFileIntegrity(decryptedBuffer, healthLock.fileHash)) {
            return res.status(500).json({
                success: false,
                message: 'File integrity check failed'
            });
        }

        // Log access
        const accessLog = new AccessLog({
            healthLockId: healthLock._id,
            patientId: healthLock.patientId,
            doctorId: doctorId,
            accessType: 'file-view',
            accessMethod: 'api',
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            success: true
        });

        await accessLog.save();

        // Set response headers
        res.setHeader('Content-Type', healthLock.fileType === 'pdf' ? 'application/pdf' : 'image/jpeg');
        res.setHeader('Content-Disposition', `inline; filename="${healthLock.originalFileName}"`);
        res.setHeader('Content-Length', decryptedBuffer.length);

        res.send(decryptedBuffer);

    } catch (error) {
        console.error('Get document content error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve document',
            error: error.message
        });
    }
};

// Get patient's HealthLock documents
const getPatientDocuments = async (req, res) => {
    try {
        const patientId = req.userId;

        const documents = await HealthLock.find({ patientId, isActive: true })
            .populate('doctorId', 'name email speciality')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: documents
        });

    } catch (error) {
        console.error('Get patient documents error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve documents',
            error: error.message
        });
    }
};

// Get doctor's accessible documents
const getDoctorDocuments = async (req, res) => {
    try {
        const doctorId = req.doctorId || req.userId;

        const documents = await HealthLock.find({ doctorId, isActive: true })
            .populate('patientId', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: documents
        });

    } catch (error) {
        console.error('Get doctor documents error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve documents',
            error: error.message
        });
    }
};

// Get access logs for patient
const getAccessLogs = async (req, res) => {
    try {
        const patientId = req.userId;
        const { healthLockId } = req.params;

        const query = { patientId };
        if (healthLockId) {
            query.healthLockId = healthLockId;
        }

        const logs = await AccessLog.find(query)
            .populate('healthLockId', 'originalFileName fileType')
            .populate('doctorId', 'name email speciality')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            data: logs
        });

    } catch (error) {
        console.error('Get access logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve access logs',
            error: error.message
        });
    }
};

// Delete HealthLock document
const deleteDocument = async (req, res) => {
    try {
        const { healthLockId } = req.params;
        const patientId = req.userId;

        const healthLock = await HealthLock.findOne({ _id: healthLockId, patientId });
        if (!healthLock) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Delete encrypted file
        if (fs.existsSync(healthLock.encryptedFileUrl)) {
            fs.unlinkSync(healthLock.encryptedFileUrl);
        }

        // Soft delete the record
        healthLock.isActive = false;
        await healthLock.save();

        res.json({
            success: true,
            message: 'Document deleted successfully'
        });

    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete document',
            error: error.message
        });
    }
};

// Get available doctors for sharing
const getAvailableDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ isActive: true })
            .select('name email speciality degree experience')
            .sort({ name: 1 });

        res.json({
            success: true,
            data: doctors
        });

    } catch (error) {
        console.error('Get available doctors error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve doctors',
            error: error.message
        });
    }
};

export {
    uploadDocument,
    scanQRCode,
    getDocumentContent,
    getPatientDocuments,
    getDoctorDocuments,
    getAccessLogs,
    deleteDocument,
    getAvailableDoctors,
    upload
};
