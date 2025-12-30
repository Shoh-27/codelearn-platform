import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gamificationAPI } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.js';

export function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await gamificationAPI.getLeaderboard(50);
            setLeaderboard(response.data.data);
        } catch (error) {
            console.error('Failed to fetch leaderboard', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🏆 Leaderboard</h1>

            <div style={styles.leaderboardCard}>
                <table style={styles.table}>
                    <thead>
                    <tr style={styles.headerRow}>
                        <th style={styles.th}>Rank</th>
                        <th style={styles.th}>User</th>
                        <th style={styles.th}>Level</th>
                        <th style={styles.th}>XP</th>
                        <th style={styles.th}>Challenges</th>
                        <th style={styles.th}>Projects</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leaderboard.map((entry) => (
                        <tr
                            key={entry.user_id}
                            style={{
                                ...styles.row,
                                backgroundColor: entry.user_id === user?.id ? '#eff6ff' : 'white',
                                fontWeight: entry.user_id === user?.id ? '600' : 'normal',
                            }}
                        >
                            <td style={styles.td}>
                                {entry.rank <= 3 ? (
                                    <span style={styles.medal}>
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                    </span>
                                ) : (
                                    entry.rank
                                )}
                            </td>
                            <td style={styles.td}>{entry.name}</td>
                            <td style={styles.td}>
                                <span style={styles.levelBadge}>Level {entry.current_level}</span>
                            </td>
                            <td style={styles.td}>{entry.current_xp.toLocaleString()}</td>
                            <td style={styles.td}>{entry.challenges_completed}</td>
                            <td style={styles.td}>{entry.projects_completed}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


const styles = {
    // Leaderboard Styles
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
    leaderboardCard: {
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
        padding: '16px',
        textAlign: 'left',
        fontWeight: '600',
        color: '#374151',
        borderBottom: '2px solid #e5e7eb',
    },
    row: {
        borderBottom: '1px solid #e5e7eb',
    },
    td: {
        padding: '16px',
        color: '#1f2937',
    },
    medal: {
        fontSize: '24px',
    },
    levelBadge: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
    },

    // Navbar Styles
    navbar: {
        backgroundColor: '#1f2937',
        padding: '16px 0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    navContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
        textDecoration: 'none',
    },
    navLinks: {
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
    },
    navLink: {
        color: '#d1d5db',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'color 0.2s',
    },
    adminLink: {
        color: '#fbbf24',
        textDecoration: 'none',
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500',
    },
};