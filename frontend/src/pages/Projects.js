import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectsAPI, submissionsAPI } from '../services/api.js';

export function Projects() {
    const [projects, setProjects] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [projectsRes, submissionsRes] = await Promise.all([
                projectsAPI.getAll(),
                submissionsAPI.getAll(),
            ]);
            setProjects(projectsRes.data.data);
            setSubmissions(submissionsRes.data.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Projects</h1>

            {/* My Submissions */}
            {submissions.length > 0 && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>My Submissions</h2>
                    <div style={styles.submissionsGrid}>
                        {submissions.map((sub) => (
                            <div key={sub.id} style={styles.submissionCard}>
                                <h3 style={styles.submissionTitle}>{sub.project.title}</h3>
                                <div style={styles.submissionMeta}>
                                    <span style={getStatusStyle(sub.status)}>{sub.status}</span>
                                    <span style={styles.submissionDate}>{sub.submitted_at}</span>
                                </div>
                                {sub.admin_feedback && (
                                    <div style={styles.feedback}>
                                        <strong>Feedback:</strong> {sub.admin_feedback}
                                    </div>
                                )}
                                {sub.xp_awarded > 0 && (
                                    <div style={styles.xpAwarded}>+{sub.xp_awarded} XP</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Available Projects */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Available Projects</h2>
                <div style={styles.grid}>
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.slug}`}
                            style={styles.card}
                        >
                            <h3 style={styles.cardTitle}>{project.title}</h3>
                            <p style={styles.cardDesc}>{project.description}</p>

                            {project.technologies && (
                                <div style={styles.techBadges}>
                                    {project.technologies.slice(0, 3).map((tech, idx) => (
                                        <span key={idx} style={styles.techBadge}>{tech}</span>
                                    ))}
                                </div>
                            )}

                            <div style={styles.cardFooter}>
                <span style={getDifficultyStyle(project.difficulty)}>
                  {project.difficulty}
                </span>
                                <span style={styles.xpReward}>{project.xp_reward} XP</span>
                            </div>

                            {project.estimated_hours && (
                                <div style={styles.estimatedTime}>
                                    ⏱ Est. {project.estimated_hours} hours
                                </div>
                            )}
                        </Link>
                    ))}
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
