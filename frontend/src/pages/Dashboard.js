import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { profileAPI, challengesAPI, projectsAPI } from '../services/api.js';

export function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, challengesRes, projectsRes] = await Promise.all([
                profileAPI.getStats(),
                challengesAPI.getAll(),
                projectsAPI.getAll(),
            ]);

            setStats(statsRes.data.data);
            setChallenges(challengesRes.data.data.slice(0, 3));
            setProjects(projectsRes.data.data.slice(0, 3));
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    const profile = user?.profile;
    const levelProgress = profile?.level_progress || { percentage: 0, remaining_xp: 0 };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome back, {user?.name}! 👋</h1>

            {/* XP and Level Section */}
            <div style={styles.grid}>
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Your Progress</h3>
                    <div style={styles.levelInfo}>
                        <div style={styles.levelBadge}>Level {profile?.current_level}</div>
                        <div style={styles.xpText}>{profile?.current_xp} XP</div>
                    </div>

                    <div style={styles.progressBar}>
                        <div
                            style={{
                                ...styles.progressFill,
                                width: `${levelProgress.percentage}%`
                            }}
                        />
                    </div>
                    <p style={styles.progressText}>
                        {levelProgress.remaining_xp} XP to next level
                    </p>
                </div>

                {/* Stats Cards */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>📚 Challenges Completed</h3>
                    <div style={styles.statNumber}>{stats?.challenges_completed || 0}</div>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>🚀 Projects Completed</h3>
                    <div style={styles.statNumber}>{stats?.projects_completed || 0}</div>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>🏆 Badges Earned</h3>
                    <div style={styles.statNumber}>{stats?.badges_earned || 0}</div>
                </div>
            </div>

            {/* Recent Activity */}
            {stats?.recent_activity && stats.recent_activity.length > 0 && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Recent Activity</h2>
                    <div style={styles.card}>
                        {stats.recent_activity.map((activity, idx) => (
                            <div key={idx} style={styles.activityItem}>
                <span style={styles.activityIcon}>
                  {activity.source_type === 'challenge' ? '📝' : '🚀'}
                </span>
                                <div style={styles.activityContent}>
                                    <p style={styles.activityText}>{activity.description}</p>
                                    <span style={styles.activityTime}>{activity.created_at}</span>
                                </div>
                                <span style={styles.xpBadge}>+{activity.amount} XP</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Available Challenges */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Available Challenges</h2>
                    <Link to="/challenges" style={styles.viewAll}>View All →</Link>
                </div>
                <div style={styles.grid}>
                    {challenges.map((challenge) => (
                        <Link
                            key={challenge.id}
                            to={`/challenges/${challenge.slug}`}
                            style={styles.challengeCard}
                        >
                            <h3 style={styles.challengeTitle}>{challenge.title}</h3>
                            <p style={styles.challengeDesc}>{challenge.description}</p>
                            <div style={styles.challengeFooter}>
                <span style={getDifficultyStyle(challenge.difficulty)}>
                  {challenge.difficulty}
                </span>
                                <span style={styles.xpReward}>{challenge.xp_reward} XP</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Available Projects */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Available Projects</h2>
                    <Link to="/projects" style={styles.viewAll}>View All →</Link>
                </div>
                <div style={styles.grid}>
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.slug}`}
                            style={styles.projectCard}
                        >
                            <h3 style={styles.projectTitle}>{project.title}</h3>
                            <p style={styles.projectDesc}>{project.description}</p>
                            <div style={styles.projectFooter}>
                <span style={getDifficultyStyle(project.difficulty)}>
                  {project.difficulty}
                </span>
                                <span style={styles.xpReward}>{project.xp_reward} XP</span>
                            </div>
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
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '16px',
        color: '#374151',
    },
    levelInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    levelBadge: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontWeight: 'bold',
        fontSize: '18px',
    },
    xpText: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2937',
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
        fontSize: '14px',
        color: '#6b7280',
        textAlign: 'center',
    },
    statNumber: {
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#3b82f6',
        textAlign: 'center',
    },
    section: {
        marginBottom: '40px',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2937',
    },
    viewAll: {
        color: '#3b82f6',
        textDecoration: 'none',
        fontWeight: '500',
    },
    activityItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #e5e7eb',
    },
    activityIcon: {
        fontSize: '24px',
        marginRight: '12px',
    },
    activityContent: {
        flex: 1,
    },
    activityText: {
        margin: '0 0 4px 0',
        color: '#1f2937',
    },
    activityTime: {
        fontSize: '12px',
        color: '#9ca3af',
    },
    xpBadge: {
        backgroundColor: '#dcfce7',
        color: '#166534',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '600',
    },
    challengeCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
    },
    challengeTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#1f2937',
    },
    challengeDesc: {
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '16px',
        lineHeight: '1.5',
    },
    challengeFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    projectCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s',
        cursor: 'pointer',
    },
    projectTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#1f2937',
    },
    projectDesc: {
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '16px',
        lineHeight: '1.5',
    },
    projectFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
};