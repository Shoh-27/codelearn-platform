import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api.js';

export function AdminSubmissions() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({
        status: 'approved',
        feedback: '',
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const response = await adminAPI.getPendingSubmissions();
            setSubmissions(response.data.data);
        } catch (error) {
            console.error('Failed to fetch submissions', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = (submission) => {
        setSelectedSubmission(submission);
        setReviewData({
            status: 'approved',
            feedback: '',
        });
        setShowReviewModal(true);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        try {
            await adminAPI.reviewSubmission(selectedSubmission.id, {
                status: reviewData.status,
                feedback: reviewData.feedback,
            });

            setMessage('Submission reviewed successfully');
            setShowReviewModal(false);
            setSelectedSubmission(null);
            fetchSubmissions();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to submit review');
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Review Submissions</h1>
                <Link to="/admin" style={styles.backButton}>← Back to Dashboard</Link>
            </div>

            {message && (
                <div style={message.includes('success') ? styles.success : styles.error}>
                    {message}
                </div>
            )}

            {/* Submissions Grid */}
            <div style={styles.grid}>
                {submissions.map((submission) => (
                    <div key={submission.id} style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>{submission.project.title}</h3>
                            <span style={styles.pendingBadge}>Pending</span>
                        </div>

                        <div style={styles.cardContent}>
                            <div style={styles.infoRow}>
                                <strong>Student:</strong> {submission.user.name}
                            </div>
                            <div style={styles.infoRow}>
                                <strong>Submitted:</strong> {submission.submitted_at}
                            </div>
                            <div style={styles.infoRow}>
                                <strong>Repository:</strong>
                                <a
                                    href={submission.repository_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.link}
                                >
                                    View on GitHub →
                                </a>
                            </div>
                        </div>

                        <button
                            onClick={() => handleReview(submission)}
                            style={styles.reviewButton}
                        >
                            Review Submission
                        </button>
                    </div>
                ))}
            </div>

            {submissions.length === 0 && (
                <div style={styles.empty}>
                    <p>No pending submissions to review</p>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && selectedSubmission && (
                <div style={styles.modalOverlay} onClick={() => setShowReviewModal(false)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Review Submission</h2>

                        <div style={styles.submissionDetails}>
                            <h3 style={styles.detailTitle}>{selectedSubmission.project.title}</h3>
                            <p><strong>Student:</strong> {selectedSubmission.user.name}</p>
                            <p>
                                <strong>Repository:</strong>{' '}
                                <a
                                    href={selectedSubmission.repository_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.link}
                                >
                                    {selectedSubmission.repository_url}
                                </a>
                            </p>
                            {selectedSubmission.live_demo_url && (
                                <p>
                                    <strong>Live Demo:</strong>{' '}
                                    <a
                                        href={selectedSubmission.live_demo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={styles.link}
                                    >
                                        {selectedSubmission.live_demo_url}
                                    </a>
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleSubmitReview}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Decision *</label>
                                <select
                                    value={reviewData.status}
                                    onChange={(e) => setReviewData({...reviewData, status: e.target.value})}
                                    style={styles.input}
                                    required
                                >
                                    <option value="approved">✅ Approve (Award XP)</option>
                                    <option value="revision_needed">🔄 Needs Revision</option>
                                    <option value="rejected">❌ Reject</option>
                                </select>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Feedback *</label>
                                <textarea
                                    value={reviewData.feedback}
                                    onChange={(e) => setReviewData({...reviewData, feedback: e.target.value})}
                                    style={styles.textarea}
                                    rows="6"
                                    placeholder="Provide detailed feedback to the student..."
                                    required
                                />
                            </div>

                            <div style={styles.modalActions}>
                                <button type="button" onClick={() => setShowReviewModal(false)} style={styles.cancelButton}>
                                    Cancel
                                </button>
                                <button type="submit" style={styles.submitButton}>
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#1f2937',
    },
    backButton: {
        color: '#3b82f6',
        textDecoration: 'none',
        fontWeight: '500',
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
    },
    success: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '16px',
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '16px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '16px',
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1f2937',
    },
    pendingBadge: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
    },
    cardContent: {
        marginBottom: '16px',
    },
    infoRow: {
        marginBottom: '8px',
        fontSize: '14px',
        color: '#374151',
    },
    link: {
        color: '#3b82f6',
        textDecoration: 'none',
        marginLeft: '8px',
    },
    reviewButton: {
        width: '100%',
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    empty: {
        backgroundColor: 'white',
        padding: '60px 20px',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '16px',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
    },
    modalTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    submissionDetails: {
        backgroundColor: '#f9fafb',
        padding: '16px',
        borderRadius: '4px',
        marginBottom: '20px',
    },
    detailTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '12px',
    },
    inputGroup: {
        marginBottom: '16px',
    },
    label: {
        display: 'block',
        fontWeight: '500',
        marginBottom: '8px',
        color: '#374151',
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '16px',
    },
    textarea: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '16px',
        resize: 'vertical',
    },
    modalActions: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
    },
    cancelButton: {
        backgroundColor: '#6b7280',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: '#10b981',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600',
    },
};