import {useAuth} from "../contexts/AuthContext.js";
import {Link, useNavigate} from "react-router-dom";
import React from "react";

export function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.navContainer}>
                <Link to="/dashboard" style={styles.logo}>
                    🎓 EduPlatform
                </Link>

                <div style={styles.navLinks}>
                    <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
                    <Link to="/challenges" style={styles.navLink}>Challenges</Link>
                    <Link to="/projects" style={styles.navLink}>Projects</Link>
                    <Link to="/leaderboard" style={styles.navLink}>Leaderboard</Link>
                    <Link to="/profile" style={styles.navLink}>Profile</Link>

                    {isAdmin() && (
                        <Link to="/admin" style={styles.adminLink}>Admin</Link>
                    )}

                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
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