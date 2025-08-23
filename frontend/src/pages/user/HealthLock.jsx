import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';
import { useAppContext } from '../../context/AppContext';

const HealthLock = () => {
    const navigate = useNavigate();
    const { userData, token } = useAppContext();
    
    const [documents, setDocuments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [qrData, setQrData] = useState('');
    const [accessLogs, setAccessLogs] = useState([]);
    
    // Upload form state
    const [uploadForm, setUploadForm] = useState({
        file: null,
        doctorId: '',
        role: 'doctor',
        permissions: 'full',
        description: '',
        expiryMinutes: 30
    });

    // Fetch documents and doctors on component mount
    useEffect(() => {
        if (token) {
            fetchDocuments();
            fetchDoctors();
        }
    }, [token]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/healthlock/patient/documents`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
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

    const fetchDoctors = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/healthlock/available-doctors`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            if (data.success) {
                setDoctors(data.data);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            toast.error('Failed to fetch doctors');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                toast.error('File size must be less than 10MB');
                return;
            }
            setUploadForm(prev => ({ ...prev, file }));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!uploadForm.file || !uploadForm.doctorId) {
            toast.error('Please select a file and doctor');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', uploadForm.file);
            formData.append('doctorId', uploadForm.doctorId);
            formData.append('role', uploadForm.role);
            formData.append('permissions', uploadForm.permissions);
            formData.append('description', uploadForm.description);
            formData.append('expiryMinutes', uploadForm.expiryMinutes);

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/healthlock/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Document uploaded successfully!');
                setShowUploadModal(false);
                setUploadForm({
                    file: null,
                    doctorId: '',
                    role: 'doctor',
                    permissions: 'full',
                    description: '',
                    expiryMinutes: 30
                });
                fetchDocuments();
            } else {
                toast.error(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload document');
        } finally {
            setLoading(false);
        }
    };

    const generateQRCode = async (document) => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/healthlock/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    healthLockId: document._id,
                    expiryMinutes: 30
                })
            });

            const data = await response.json();
            if (data.success) {
                setQrData(data.data.qrData);
                setSelectedDocument(document);
                setShowQRModal(true);
            }
        } catch (error) {
            console.error('QR generation error:', error);
            toast.error('Failed to generate QR code');
        } finally {
            setLoading(false);
        }
    };

    const fetchAccessLogs = async (healthLockId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/healthlock/patient/logs/${healthLockId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            if (data.success) {
                setAccessLogs(data.data);
            }
        } catch (error) {
            console.error('Error fetching access logs:', error);
        }
    };

    const deleteDocument = async (healthLockId) => {
        if (!window.confirm('Are you sure you want to delete this document?')) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/healthlock/patient/documents/${healthLockId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Document deleted successfully');
                fetchDocuments();
            } else {
                toast.error(data.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete document');
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

    if (!userData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Secure HealthLock</h1>
                <p className="text-gray-600">Securely share your medical documents with healthcare providers</p>
            </div>

            {/* Upload Button */}
            <div className="mb-6">
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Upload New Document</span>
                </button>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Your Documents</h2>
                </div>
                
                {loading ? (
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading documents...</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="p-6 text-center">
                        <div className="text-6xl mb-4">🔒</div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No documents yet</h3>
                        <p className="text-gray-600 mb-4">Upload your first medical document to get started</p>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            Upload Document
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
                                                Shared with: {doc.doctorId?.name} ({doc.doctorId?.speciality})
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
                                        <button
                                            onClick={() => generateQRCode(doc)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Generate QR
                                        </button>
                                        <button
                                            onClick={() => fetchAccessLogs(doc._id)}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            View Logs
                                        </button>
                                        <button
                                            onClick={() => deleteDocument(doc._id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
                        <form onSubmit={handleUpload}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select File
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Max size: 10MB. Supported: PDF, JPG, PNG</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Doctor
                                </label>
                                <select
                                    value={uploadForm.doctorId}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, doctorId: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    required
                                >
                                    <option value="">Choose a doctor...</option>
                                    {doctors.map((doctor) => (
                                        <option key={doctor._id} value={doctor._id}>
                                            {doctor.name} - {doctor.speciality}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <select
                                    value={uploadForm.role}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, role: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    <option value="doctor">Doctor</option>
                                    <option value="pharmacist">Pharmacist</option>
                                    <option value="diagnostic">Diagnostic</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Permissions
                                </label>
                                <select
                                    value={uploadForm.permissions}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, permissions: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    <option value="full">Full Access</option>
                                    <option value="partial">Partial Access</option>
                                    <option value="read-only">Read Only</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={uploadForm.description}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    rows="3"
                                    placeholder="Brief description of the document..."
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    QR Code Expiry
                                </label>
                                <select
                                    value={uploadForm.expiryMinutes}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, expiryMinutes: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    <option value={30}>30 minutes</option>
                                    <option value={120}>2 hours</option>
                                    <option value={1440}>24 hours</option>
                                    <option value={10080}>7 days</option>
                                </select>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium"
                                >
                                    {loading ? 'Uploading...' : 'Upload'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {showQRModal && selectedDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold mb-4">QR Code Generated</h2>
                        <div className="text-center">
                            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block mb-4">
                                <QRCodeSVG value={qrData} size={200} />
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Share this QR code with {selectedDocument.doctorId?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                Expires: {new Date(Date.now() + (uploadForm.expiryMinutes * 60 * 1000)).toLocaleString()}
                            </p>
                        </div>
                        <div className="mt-6">
                            <button
                                onClick={() => setShowQRModal(false)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
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

export default HealthLock;
