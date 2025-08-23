import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

class EncryptionService {
    constructor() {
        // Use environment variable for encryption key or generate a secure one
        this.algorithm = 'aes-256-gcm';
        this.secretKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
        this.ivLength = 16;
        this.tagLength = 16;
    }

    // Encrypt file buffer
    encryptFile(fileBuffer) {
        try {
            const iv = crypto.randomBytes(this.ivLength);
            const cipher = crypto.createCipher(this.algorithm, this.secretKey);
            cipher.setAAD(Buffer.from('healthforge-document', 'utf8'));
            
            let encrypted = cipher.update(fileBuffer, null, 'hex');
            encrypted += cipher.final('hex');
            
            const tag = cipher.getAuthTag();
            
            // Combine IV, encrypted data, and auth tag
            const result = Buffer.concat([iv, Buffer.from(encrypted, 'hex'), tag]);
            
            return {
                encryptedData: result,
                hash: this.generateFileHash(fileBuffer)
            };
        } catch (error) {
            console.error('Encryption error:', error);
            throw new Error('File encryption failed');
        }
    }

    // Decrypt file buffer
    decryptFile(encryptedBuffer) {
        try {
            // Extract IV, encrypted data, and auth tag
            const iv = encryptedBuffer.slice(0, this.ivLength);
            const tag = encryptedBuffer.slice(-this.tagLength);
            const encryptedData = encryptedBuffer.slice(this.ivLength, -this.tagLength);
            
            const decipher = crypto.createDecipher(this.algorithm, this.secretKey);
            decipher.setAuthTag(tag);
            decipher.setAAD(Buffer.from('healthforge-document', 'utf8'));
            
            let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            return Buffer.from(decrypted, 'utf8');
        } catch (error) {
            console.error('Decryption error:', error);
            throw new Error('File decryption failed');
        }
    }

    // Generate file hash for integrity verification
    generateFileHash(fileBuffer) {
        return crypto.createHash('sha256').update(fileBuffer).digest('hex');
    }

    // Verify file integrity
    verifyFileIntegrity(fileBuffer, expectedHash) {
        const actualHash = this.generateFileHash(fileBuffer);
        return actualHash === expectedHash;
    }

    // Generate secure random token
    generateSecureToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    // Hash sensitive data
    hashData(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }
}

export default new EncryptionService();
