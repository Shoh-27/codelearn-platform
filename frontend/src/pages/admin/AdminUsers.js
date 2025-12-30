import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api.js';

export function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const fetchUsers = async () => {
        try {
            const response = await adminAPI.getUsers({ search });
            setUsers(response.data.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (userId, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
            return;
        }

        try {
            await adminAPI.toggleUserActive(userId);
            setMessage('User status updated successfully');
            fetchUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update user status');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            await adminAPI.deleteUser(userId);
            setMessage('User deleted successfully');
            fetchUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to delete user');
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>User Management</h1>
                <Link to="/admin" style={styles.backButton}>← Back to Dashboard</Link>
            </div>

            {message && (
                <div style={message.includes('success') ? styles.success : styles.error}>
                    {message}
                </div>
            )}

            {/* Search */}
            <div style={styles.searchBox}>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            {/* Users Table */}
            <div style={styles.card}>
                <table style={styles.table}>
                    <thead>
                    <tr style={styles.headerRow}>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Level</th>
                        <th style={styles.th}>XP</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Joined</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={styles.row}>
                            <td style={styles.td}>{user.id}</td>
                            <td style={styles.td}>
                                <Link to={`/admin/users/${user.id}`} style={styles.link}>
                                    {user.name}
                                </Link>
                            </td>
                            <td style={styles.td}>{user.email}</td>
                            <td style={styles.td}>
                                <span style={styles.levelBadge}>Lvl {user.current_level}</span>
                            </td>
                            <td style={styles.td}>{user.current_xp} XP</td>
                            <td style={styles.td}>
                  <span style={user.is_active ? styles.activeStatus : styles.inactiveStatus}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                            </td>
                            <td style={styles.td}>{user.created_at}</td>
                            <td style={styles.td}>
                                <div style={styles.actions}>
                                    <button
                                        onClick={() => handleToggleActive(user.id, user.is_active)}
                                        style={user.is_active ? styles.deactivateBtn : styles.activateBtn}
                                    >
                                        {user.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        style={styles.deleteBtn}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div style={styles.empty}>No users found</div>
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
        fontSize: '18px',
        color: '#6b7280',
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
    searchBox: {
        marginBottom: '24px',
    },
    searchInput: {
        width: '100%',
        maxWidth: '400px',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '16px',
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
    link: {
        color: '#3b82f6',
        textDecoration: 'none',
        fontWeight: '500',
    },
    levelBadge: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
    },
    activeStatus: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
    },
    inactiveStatus: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
    },
    actions: {
        display: 'flex',
        gap: '8px',
    },
    activateBtn: {
        backgroundColor: '#10b981',
        color: 'white',
        padding: '6px 12px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    deactivateBtn: {
        backgroundColor: '#f59e0b',
        color: 'white',
        padding: '6px 12px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    deleteBtn: {
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '6px 12px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    empty: {
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280',
    },
};