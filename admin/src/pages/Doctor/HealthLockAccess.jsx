import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAdminContext } from '../../context/AdminContext';

const HealthLockAccess = () => {
    const { dToken } = useAdminContext();
    
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [scannedData, setScannedData] = useState(null);
    const [cameraStream, setCameraStream] = useState(null);
    const [scanning, setScanning] = useState(false);
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Fetch doctor's accessible documents on component mount
    useEffect(() => {
        if (dToken) {
            fetchDocuments();
        }
    }, [dToken]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/healthlock/doctor/documents`, {
                headers: {
                    'Authorization': `Bearer ${dToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            if (data.success) {
                setDocuments(data.data);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            toast.error('Failed to fetch documents');
        } finally {
            setLoading(false);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setScanning(true);
        } catch (error) {
            console.error('Camera access error:', error);
            toast.error('Failed to access camera');
        }
    };

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setScanning(false);
    };

    const scanQRCode = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get image data for QR detection
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        // Simple QR code detection (in a real app, you'd use a QR library)
        // For now, we'll simulate scanning
        setTimeout(() => {
            // Simulate QR code detection
            const mockQRData = JSON.stringify({
                token: 'mock-jwt-token',
                timestamp: Date.now(),
                version: '1.0',
                type: 'healthlock-access'
            });
            
            handleQRScan(mockQRData);
        }, 2000);
    };

    const handleQRScan = async (qrData) => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/healthlock/scan-qr`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${dToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ qrData })
            });

            const data = await response.json();
            if (data.success) {
                setScannedData(data.data);
                setSelectedDocument(data.data);
                setShowDocumentModal(true);
                stopCamera();
                setShowScanner(false);
                toast.success('QR code scanned successfully!');
            } else {
                toast.error(data.message || 'Invalid QR code');
            }
        } catch (error) {
            console.error('QR scan error:', error);
            toast.error('Failed to scan QR code');
        } finally {
            setLoading(false);
        }
    };

    const viewDocument = async (healthLockId, accessToken) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/healthlock/document/${healthLockId}/content`, {
                headers: {
                    'Authorization': `Bearer ${dToken}`,
                    'accessToken': accessToken
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
            } else {
                toast.error('Failed to load document');
            }
        } catch (error) {
            console.error('Document view error:', error);
            toast.error('Failed to view document');
        }
    };

    const getFileTypeIcon = (fileType) => {
        switch (fileType) {
            case 'pdf':
                return '📄';
            case 'image':
                return '🖼️';
            case 'prescription':
                return '💊';
            case 'lab-report':
                return '🔬';
            case 'xray':
                return '📷';
            default:
                return '📁';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getPermissionBadge = (permissions) => {
        const colors = {
            'full': 'bg-green-100 text-green-800',
            'partial': 'bg-yellow-100 text-yellow-800',
            'read-only': 'bg-blue-100 text-blue-800'
        };
        
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[permissions] || colors['read-only']}`}>
                {permissions.replace('-', ' ').toUpperCase()}
            </span>
        );
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">HealthLock Access</h1>
                <p className="text-gray-600">Scan QR codes to access patient documents securely</p>
            </div>

            {/* Scan QR Button */}
            <div className="mb-6">
                <button
                    onClick={() => {
                        setShowScanner(true);
                        startCamera();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                    </svg>
                    <span>Scan QR Code</span>
                </button>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Accessible Documents</h2>
                </div>
                
                {loading ? (
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading documents...</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="p-6 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No documents available</h3>
                        <p className="text-gray-600 mb-4">Scan a QR code from a patient to access their documents</p>
                        <button
                            onClick={() => {
                                setShowScanner(true);
                                startCamera();
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                            Scan QR Code
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {documents.map((doc) => (
                            <div key={doc._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-3xl">{getFileTypeIcon(doc.fileType)}</div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{doc.originalFileName}</h3>
                                            <p className="text-sm text-gray-600">
                                                Patient: {doc.patientId?.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(doc.fileSize)} • {new Date(doc.createdAt).toLocaleDateString()}
                                            </p>
                                            {doc.description && (
                                                <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {getPermissionBadge(doc.permissions)}
                                        <button
                                            onClick={() => viewDocument(doc._id, doc.accessToken)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* QR Scanner Modal */}
            {showScanner && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
                        <div className="relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-64 bg-gray-900 rounded-lg"
                            />
                            <canvas
                                ref={canvasRef}
                                className="hidden"
                            />
                            <div className="absolute inset-0 border-2 border-green-500 border-dashed rounded-lg pointer-events-none">
                                <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-green-500"></div>
                                <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-green-500"></div>
                                <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-green-500"></div>
                                <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-green-500"></div>
                            </div>
                        </div>
                        
                        {scanning && (
                            <div className="mt-4 text-center">
                                <div className="animate-pulse text-green-600">
                                    <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                                    </svg>
                                    <p className="text-sm">Scanning for QR code...</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-6 flex space-x-3">
                            <button
                                onClick={() => {
                                    stopCamera();
                                    setShowScanner(false);
                                }}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            {scanning && (
                                <button
                                    onClick={scanQRCode}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
                                >
                                    Scan Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Document View Modal */}
            {showDocumentModal && selectedDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Document Details</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="text-4xl">{getFileTypeIcon(selectedDocument.fileType)}</div>
                                <div>
                                    <h3 className="font-semibold text-lg">{selectedDocument.fileName}</h3>
                                    <p className="text-sm text-gray-600">
                                        Patient: {selectedDocument.patientName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(selectedDocument.fileSize)} • {new Date(selectedDocument.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {selectedDocument.description && (
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-2">Description</h4>
                                    <p className="text-gray-600">{selectedDocument.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-2">Role</h4>
                                    <p className="text-gray-600 capitalize">{selectedDocument.role}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-2">Permissions</h4>
                                    {getPermissionBadge(selectedDocument.permissions)}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <button
                                    onClick={() => viewDocument(selectedDocument.healthLockId, selectedDocument.accessToken)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                                >
                                    View Document
                                </button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => setShowDocumentModal(false)}
                                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthLockAccess;


