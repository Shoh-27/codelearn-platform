import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api.js';

export function AdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await adminAPI.getDashboard();
            setDashboard(response.data.data);
        } catch (error) {
            console.error('Failed to fetch dashboard', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    const stats = dashboard?.stats || {};
    const recentUsers = dashboard?.recent_users || [];
    const recentSubmissions = dashboard?.recent_submissions || [];

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Admin Dashboard</h1>

            {/* Quick Links */}
            <div style={styles.quickLinks}>
                <Link to="/admin/users" style={styles.quickLink}>
                    👥 Manage Users
                </Link>
                <Link to="/admin/challenges" style={styles.quickLink}>
                    📝 Manage Challenges
                </Link>
                <Link to="/admin/projects" style={styles.quickLink}>
                    🚀 Manage Projects
                </Link>
                <Link to="/admin/submissions" style={styles.quickLink}>
                    ✅ Review Submissions
                </Link>
            </div>

            {/* Stats Grid */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statLabel}>Total Users</div>
                    <div style={styles.statValue}>{stats.total_users}</div>
                    <div style={styles.statSubtext}>{stats.active_users} active</div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statLabel}>Total Challenges</div>
                    <div style={styles.statValue}>{stats.total_challenges}</div>
                    <div style={styles.statSubtext}>{stats.published_challenges} published</div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statLabel}>Total Projects</div>
                    <div style={styles.statValue}>{stats.total_projects}</div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statLabel}>Pending Submissions</div>
                    <div style={styles.statValue}>{stats.pending_submissions}</div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statLabel}>Total XP Awarded</div>
                    <div style={styles.statValue}>{stats.total_xp_awarded?.toLocaleString()}</div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statLabel}>Avg Level</div>
                    <div style={styles.statValue}>{Math.round(stats.avg_level * 10) / 10}</div>
                </div>
            </div>

            {/* Recent Activity */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Recent Users</h2>
                <div style={styles.card}>
                    <table style={styles.table}>
                        <thead>
                        <tr style={styles.headerRow}>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Joined</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentUsers.map((user) => (
                            <tr key={user.id} style={styles.row}>
                                <td style={styles.td}>{user.name}</td>
                                <td style={styles.td}>{user.email}</td>
                                <td style={styles.td}>{user.created_at}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Recent Submissions</h2>
                <div style={styles.card}>
                    <table style={styles.table}>
                        <thead>
                        <tr style={styles.headerRow}>
                            <th style={styles.th}>User</th>
                            <th style={styles.th}>Project</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Submitted</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentSubmissions.map((sub) => (
                            <tr key={sub.id} style={styles.row}>
                                <td style={styles.td}>{sub.user_name}</td>
                                <td style={styles.td}>{sub.project_title}</td>
                                <td style={styles.td}>
                                    <span style={getStatusStyle(sub.status)}>{sub.status}</span>
                                </td>
                                <td style={styles.td}>{sub.submitted_at}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const getStatusStyle = (status) => ({
    ...styles.statusBadge,
    backgroundColor:
        status === 'pending' ? '#fef3c7' :
            status === 'approved' ? '#d1fae5' : '#fee2e2',
    color:
        status === 'pending' ? '#92400e' :
            status === 'approved' ? '#065f46' : '#991b1b',
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
    quickLinks: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
    },
    quickLink: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        textDecoration: 'none',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: '16px',
        transition: 'transform 0.2s',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
    },
    statCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    statLabel: {
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '8px',
    },
    statValue: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#3b82f6',
        marginBottom: '4px',
    },
    statSubtext: {
        fontSize: '12px',
        color: '#9ca3af',
    },
    section: {
        marginBottom: '32px',
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#1f2937',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    headerRow: {
        backgroundColor: '#f9fafb',
    },
    th: {
        padding: '12px 16px',
        textAlign: 'left',
        fontWeight: '600',
        color: '#374151',
        borderBottom: '2px solid #e5e7eb',
    },
    row: {
        borderBottom: '1px solid #e5e7eb',
    },
    td: {
        padding: '12px 16px',
        color: '#1f2937',
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'capitalize',
    },
};