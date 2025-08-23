import jwt from 'jsonwebtoken';
import crypto from 'crypto';

class QRGenerator {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'healthforge-secure-qr-secret';
    }

    // Generate JWT token for QR code
    generateAccessToken(healthLockData, expiryMinutes = 30) {
        try {
            const payload = {
                healthLockId: healthLockData._id,
                patientId: healthLockData.patientId,
                doctorId: healthLockData.doctorId,
                fileId: healthLockData.fileName,
                role: healthLockData.role,
                permissions: healthLockData.permissions,
                type: 'healthlock-access',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (expiryMinutes * 60)
            };

            const token = jwt.sign(payload, this.jwtSecret, {
                algorithm: 'HS256',
                issuer: 'healthforge',
                audience: 'healthlock-access'
            });

            return {
                token,
                expiry: new Date(Date.now() + (expiryMinutes * 60 * 1000)),
                payload
            };
        } catch (error) {
            console.error('Token generation error:', error);
            throw new Error('Failed to generate access token');
        }
    }

    // Verify JWT token
    verifyAccessToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret, {
                algorithms: ['HS256'],
                issuer: 'healthforge',
                audience: 'healthlock-access'
            });

            // Additional validation
            if (decoded.type !== 'healthlock-access') {
                throw new Error('Invalid token type');
            }

            if (Date.now() >= decoded.exp * 1000) {
                throw new Error('Token expired');
            }

            return {
                valid: true,
                payload: decoded
            };
        } catch (error) {
            console.error('Token verification error:', error);
            return {
                valid: false,
                error: error.message
            };
        }
    }

    // Generate QR code data URL
    generateQRData(healthLockData, expiryMinutes = 30) {
        try {
            const { token } = this.generateAccessToken(healthLockData, expiryMinutes);
            
            // Create QR data object
            const qrData = {
                token,
                timestamp: Date.now(),
                version: '1.0',
                type: 'healthlock-access'
            };

            return {
                qrData: JSON.stringify(qrData),
                token,
                expiry: new Date(Date.now() + (expiryMinutes * 60 * 1000))
            };
        } catch (error) {
            console.error('QR data generation error:', error);
            throw new Error('Failed to generate QR data');
        }
    }

    // Generate different expiry options
    getExpiryOptions() {
        return [
            { label: '30 minutes', value: 30, description: 'Quick access for immediate consultation' },
            { label: '2 hours', value: 120, description: 'Extended access for detailed review' },
            { label: '24 hours', value: 1440, description: 'Full day access for comprehensive analysis' },
            { label: '7 days', value: 10080, description: 'Week-long access for ongoing treatment' }
        ];
    }

    // Generate role-based permissions
    getRolePermissions() {
        return {
            doctor: {
                permissions: 'full',
                description: 'Full access to all medical records and documents',
                allowedActions: ['view', 'download', 'annotate', 'prescribe']
            },
            pharmacist: {
                permissions: 'partial',
                description: 'Access to prescriptions and medication-related documents only',
                allowedActions: ['view', 'download']
            },
            diagnostic: {
                permissions: 'read-only',
                description: 'Read-only access to lab reports and diagnostic documents',
                allowedActions: ['view']
            }
        };
    }

    // Validate role permissions
    validateRolePermissions(role, requestedAction) {
        const permissions = this.getRolePermissions();
        const rolePerms = permissions[role];
        
        if (!rolePerms) {
            return false;
        }

        return rolePerms.allowedActions.includes(requestedAction);
    }
}

export default new QRGenerator();
