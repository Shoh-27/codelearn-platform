import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { profileAPI } from '../services/api.js';

export function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        github_url: '',
        linkedin_url: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await profileAPI.getProfile();
            const data = response.data.data;
            setProfile(data);
            setFormData({
                name: data.user.name,
                bio: data.profile.bio || '',
                github_url: data.profile.github_url || '',
                linkedin_url: data.profile.linkedin_url || '',
            });
        } catch (error) {
            console.error('Failed to fetch profile', error);
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
        setSaving(true);
        setMessage('');

        try {
            await profileAPI.updateProfile(formData);
            setMessage('Profile updated successfully!');
            setEditing(false);
            fetchProfile();
        } catch (error) {
            setMessage('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    const gamification = profile?.gamification || {};
    const badges = profile?.badges || [];

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Profile</h1>

            {message && (
                <div style={message.includes('success') ? styles.success : styles.error}>
                    {message}
                </div>
            )}

            <div style={styles.grid}>
                {/* Profile Info Card */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Personal Information</h2>

                    {!editing ? (
                        <div style={styles.infoView}>
                            <div style={styles.infoItem}>
                                <strong>Name:</strong> {profile?.user.name}
                            </div>
                            <div style={styles.infoItem}>
                                <strong>Email:</strong> {profile?.user.email}
                            </div>
                            <div style={styles.infoItem}>
                                <strong>Bio:</strong> {profile?.profile.bio || 'No bio yet'}
                            </div>
                            <div style={styles.infoItem}>
                                <strong>GitHub:</strong> {profile?.profile.github_url || 'Not set'}
                            </div>
                            <div style={styles.infoItem}>
                                <strong>LinkedIn:</strong> {profile?.profile.linkedin_url || 'Not set'}
                            </div>

                            <button
                                onClick={() => setEditing(true)}
                                style={styles.editButton}
                            >
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    style={styles.textarea}
                                    rows="4"
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>GitHub URL</label>
                                <input
                                    type="url"
                                    name="github_url"
                                    value={formData.github_url}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>LinkedIn URL</label>
                                <input
                                    type="url"
                                    name="linkedin_url"
                                    value={formData.linkedin_url}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.buttonGroup}>
                                <button type="submit" style={styles.saveButton} disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Gamification Stats */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Your Stats</h2>

                    <div style={styles.statGrid}>
                        <div style={styles.statItem}>
                            <div style={styles.statLabel}>Level</div>
                            <div style={styles.statValue}>{gamification.current_level}</div>
                        </div>

                        <div style={styles.statItem}>
                            <div style={styles.statLabel}>Total XP</div>
                            <div style={styles.statValue}>{gamification.current_xp}</div>
                        </div>

                        <div style={styles.statItem}>
                            <div style={styles.statLabel}>Challenges</div>
                            <div style={styles.statValue}>{gamification.total_challenges_completed}</div>
                        </div>

                        <div style={styles.statItem}>
                            <div style={styles.statLabel}>Projects</div>
                            <div style={styles.statValue}>{gamification.total_projects_completed}</div>
                        </div>
                    </div>

                    <div style={styles.progressSection}>
                        <div style={styles.progressLabel}>
                            Level Progress: {Math.round(gamification.level_progress?.percentage || 0)}%
                        </div>
                        <div style={styles.progressBar}>
                            <div
                                style={{
                                    ...styles.progressFill,
                                    width: `${gamification.level_progress?.percentage || 0}%`
                                }}
                            />
                        </div>
                        <div style={styles.progressText}>
                            {gamification.level_progress?.remaining_xp || 0} XP to next level
                        </div>
                    </div>
                </div>
            </div>

            {/* Badges Section */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Badges ({badges.length})</h2>

                {badges.length > 0 ? (
                    <div style={styles.badgesGrid}>
                        {badges.map((badge) => (
                            <div key={badge.id} style={styles.badgeCard}>
                                <div style={styles.badgeIcon}>{badge.icon || '🏆'}</div>
                                <h3 style={styles.badgeName}>{badge.name}</h3>
                                <p style={styles.badgeDesc}>{badge.description}</p>
                                <div style={styles.badgeDate}>
                                    Earned: {new Date(badge.earned_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={styles.emptyState}>
                        <p>No badges earned yet. Complete challenges to earn your first badge!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

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
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '24px',
        color: '#1f2937',
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
    },
    card: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    cardTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#1f2937',
    },
    infoView: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    infoItem: {
        padding: '8px 0',
        borderBottom: '1px solid #e5e7eb',
        color: '#374151',
    },
    editButton: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '16px',
        fontWeight: '600',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontWeight: '500',
        marginBottom: '8px',
        color: '#374151',
    },
    input: {
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '16px',
    },
    textarea: {
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
    saveButton: {
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
    statGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '24px',
    },
    statItem: {
        textAlign: 'center',
    },
    statLabel: {
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '4px',
    },
    statValue: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    progressSection: {
        marginTop: '24px',
    },
    progressLabel: {
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#374151',
    },
    progressBar: {
        width: '100%',
        height: '12px',
        backgroundColor: '#e5e7eb',
        borderRadius: '6px',
        overflow: 'hidden',
        marginBottom: '8px',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3b82f6',
        transition: 'width 0.3s ease',
    },
    progressText: {
        fontSize: '12px',
        color: '#6b7280',
        textAlign: 'center',
    },
    section: {
        marginTop: '32px',
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#1f2937',
    },
    badgesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
    },
    badgeCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    badgeIcon: {
        fontSize: '48px',
        marginBottom: '12px',
    },
    badgeName: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#1f2937',
    },
    badgeDesc: {
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '8px',
    },
    badgeDate: {
        fontSize: '12px',
        color: '#9ca3af',
    },
    emptyState: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#6b7280',
    },
};