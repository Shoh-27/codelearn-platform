import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectsAPI, submissionsAPI } from '../services/api.js';
export function ProjectDetail() {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [showSubmitForm, setShowSubmitForm] = useState(false);
    const [formData, setFormData] = useState({
        repository_url: '',
        live_demo_url: '',
        description: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProject();
    }, [slug]);

    const fetchProject = async () => {
        try {
            const response = await projectsAPI.getBySlug(slug);
            setProject(response.data.data);
        } catch (error) {
            console.error('Failed to fetch project', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');

        try {
            await submissionsAPI.create({
                ...formData,
                project_id: project.id,
            });
            setMessage('Project submitted successfully! Awaiting admin review.');
            setShowSubmitForm(false);
            setFormData({ repository_url: '', live_demo_url: '', description: '' });
        } catch (error) {
            setMessage('Failed to submit project. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    if (!project) {
        return <div style={styles.error}>Project not found</div>;
    }

    return (
        <div style={styles.container}>
            <Link to="/projects" style={styles.backLink}>← Back to Projects</Link>

            <div style={styles.detailHeader}>
                <h1 style={styles.detailTitle}>{project.title}</h1>
                <div style={styles.detailMeta}>
          <span style={getDifficultyStyle(project.difficulty)}>
            {project.difficulty}
          </span>
                    <span style={styles.xpReward}>{project.xp_reward} XP</span>
                    {project.estimated_hours && (
                        <span style={styles.timeEstimate}>⏱ {project.estimated_hours} hours</span>
                    )}
                </div>
            </div>

            {message && (
                <div style={message.includes('success') ? styles.successMessage : styles.errorMessage}>
                    {message}
                </div>
            )}

            <div style={styles.detailContent}>
                <div style={styles.descriptionSection}>
                    <h2 style={styles.sectionTitle}>Description</h2>
                    <p style={styles.description}>{project.description}</p>
                </div>

                <div style={styles.requirementsSection}>
                    <h2 style={styles.sectionTitle}>Requirements</h2>
                    <pre style={styles.requirements}>{project.requirements}</pre>
                </div>

                {project.technologies && project.technologies.length > 0 && (
                    <div style={styles.technologiesSection}>
                        <h2 style={styles.sectionTitle}>Technologies</h2>
                        <div style={styles.techList}>
                            {project.technologies.map((tech, idx) => (
                                <span key={idx} style={styles.techItem}>{tech}</span>
                            ))}
                        </div>
                    </div>
                )}

                <div style={styles.submitSection}>
                    {!showSubmitForm ? (
                        <button
                            onClick={() => setShowSubmitForm(true)}
                            style={styles.submitProjectButton}
                        >
                            Submit Your Project
                        </button>
                    ) : (
                        <div style={styles.submitForm}>
                            <h2 style={styles.sectionTitle}>Submit Your Project</h2>
                            <form onSubmit={handleSubmit}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Repository URL *</label>
                                    <input
                                        type="url"
                                        name="repository_url"
                                        value={formData.repository_url}
                                        onChange={handleChange}
                                        style={styles.input}
                                        placeholder="https://github.com/username/repo"
                                        required
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Live Demo URL</label>
                                    <input
                                        type="url"
                                        name="live_demo_url"
                                        value={formData.live_demo_url}
                                        onChange={handleChange}
                                        style={styles.input}
                                        placeholder="https://yourproject.com"
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        style={styles.textarea}
                                        rows="4"
                                        placeholder="Tell us about your implementation..."
                                    />
                                </div>

                                <div style={styles.buttonGroup}>
                                    <button type="submit" style={styles.submitButton} disabled={submitting}>
                                        {submitting ? 'Submitting...' : 'Submit Project'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowSubmitForm(false)}
                                        style={styles.cancelButton}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const getDifficultyStyle = (difficulty) => ({
    ...styles.difficultyBadge,
    backgroundColor:
        difficulty === 'beginner' ? '#dbeafe' :
            difficulty === 'intermediate' ? '#fef3c7' : '#fee2e2',
    color:
        difficulty === 'beginner' ? '#1e40af' :
            difficulty === 'intermediate' ? '#92400e' : '#991b1b',
});

const getStatusStyle = (status) => ({
    ...styles.statusBadge,
    backgroundColor:
        status === 'pending' ? '#fef3c7' :
            status === 'approved' ? '#d1fae5' :
                status === 'rejected' ? '#fee2e2' : '#e5e7eb',
    color:
        status === 'pending' ? '#92400e' :
            status === 'approved' ? '#065f46' :
                status === 'rejected' ? '#991b1b' : '#374151',
});

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '18px',
        color: '#6b7280',
    },
    error: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '18px',
        color: '#dc2626',
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '24px',
        color: '#1f2937',
    },
    section: {
        marginBottom: '40px',
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#1f2937',
    },
    submissionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px',
    },
    submissionCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    submissionTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '12px',
        color: '#1f2937',
    },
    submissionMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    submissionDate: {
        fontSize: '12px',
        color: '#6b7280',
    },
    feedback: {
        backgroundColor: '#f3f4f6',
        padding: '12px',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#374151',
        marginTop: '8px',
    },
    xpAwarded: {
        marginTop: '8px',
        fontWeight: 'bold',
        color: '#10b981',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s',
        cursor: 'pointer',
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#1f2937',
    },
    cardDesc: {
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '12px',
        lineHeight: '1.5',
    },
    techBadges: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '12px',
    },
    techBadge: {
        backgroundColor: '#e0e7ff',
        color: '#3730a3',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
    },
    difficultyBadge: {
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    xpReward: {
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    estimatedTime: {
        fontSize: '12px',
        color: '#6b7280',
        marginTop: '8px',
    },
    backLink: {
        color: '#3b82f6',
        textDecoration: 'none',
        marginBottom: '16px',
        display: 'inline-block',
        fontWeight: '500',
    },
    detailHeader: {
        marginBottom: '24px',
    },
    detailTitle: {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#1f2937',
    },
    detailMeta: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
    },
    timeEstimate: {
        color: '#6b7280',
        fontSize: '14px',
    },
    successMessage: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '16px',
    },
    errorMessage: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '16px',
    },
    detailContent: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    descriptionSection: {
        marginBottom: '24px',
    },
    description: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#374151',
    },
    requirementsSection: {
        marginBottom: '24px',
    },
    requirements: {
        backgroundColor: '#f9fafb',
        padding: '16px',
        borderRadius: '4px',
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#374151',
        whiteSpace: 'pre-wrap',
    },
    technologiesSection: {
        marginBottom: '24px',
    },
    techList: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
    },
    techItem: {
        backgroundColor: '#e0e7ff',
        color: '#3730a3',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
    },
    submitSection: {
        marginTop: '32px',
        paddingTop: '32px',
        borderTop: '2px solid #e5e7eb',
    },
    submitProjectButton: {
        backgroundColor: '#10b981',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    submitForm: {
        marginTop: '16px',
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
    buttonGroup: {
        display: 'flex',
        gap: '12px',
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
    cancelButton: {
        backgroundColor: '#6b7280',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600',
    },
};