import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { challengesAPI, adminAPI, lessonsAPI } from '../../services/api.js';

export function AdminChallenges() {
    const [challenges, setChallenges] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficulty: 'beginner',
        challenge_type: 'coding',
        xp_reward: 100,
        lesson_id: '',
        starter_code: '',
        solution_code: '',
        hints: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [challengesRes, lessonsRes] = await Promise.all([
                challengesAPI.getAll(),
                lessonsAPI.getAll(),
            ]);
            setChallenges(challengesRes.data.data);
            setLessons(lessonsRes.data.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
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

        try {
            const data = {
                ...formData,
                hints: formData.hints ? formData.hints.split('\n').filter(h => h.trim()) : [],
            };

            if (editingId) {
                await adminAPI.updateChallenge(editingId, data);
                setMessage('Challenge updated successfully');
            } else {
                await adminAPI.createChallenge(data);
                setMessage('Challenge created successfully');
            }

            setShowForm(false);
            setEditingId(null);
            setFormData({
                title: '',
                description: '',
                difficulty: 'beginner',
                challenge_type: 'coding',
                xp_reward: 100,
                lesson_id: '',
                starter_code: '',
                solution_code: '',
                hints: '',
            });
            fetchData();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to save challenge');
        }
    };

    const handleEdit = (challenge) => {
        setEditingId(challenge.id);
        setFormData({
            title: challenge.title,
            description: challenge.description,
            difficulty: challenge.difficulty,
            challenge_type: challenge.challenge_type,
            xp_reward: challenge.xp_reward,
            lesson_id: challenge.lesson?.id || '',
            starter_code: challenge.starter_code || '',
            solution_code: challenge.solution_code || '',
            hints: challenge.hints ? challenge.hints.join('\n') : '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this challenge?')) {
            return;
        }

        try {
            await adminAPI.deleteChallenge(id);
            setMessage('Challenge deleted successfully');
            fetchData();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to delete challenge');
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Challenge Management</h1>
                <div style={styles.headerActions}>
                    <Link to="/admin" style={styles.backButton}>← Back</Link>
                    <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
                        {showForm ? 'Cancel' : '+ Add Challenge'}
                    </button>
                </div>
            </div>

            {message && (
                <div style={message.includes('success') ? styles.success : styles.error}>
                    {message}
                </div>
            )}

            {/* Form */}
            {showForm && (
                <div style={styles.formCard}>
                    <h2 style={styles.formTitle}>{editingId ? 'Edit Challenge' : 'Create Challenge'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Difficulty *</label>
                                <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Type *</label>
                                <select
                                    name="challenge_type"
                                    value={formData.challenge_type}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                >
                                    <option value="coding">Coding</option>
                                    <option value="multiple_choice">Multiple Choice</option>
                                    <option value="project">Project</option>
                                </select>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>XP Reward *</label>
                                <input
                                    type="number"
                                    name="xp_reward"
                                    value={formData.xp_reward}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Lesson (Optional)</label>
                                <select
                                    name="lesson_id"
                                    value={formData.lesson_id}
                                    onChange={handleChange}
                                    style={styles.input}
                                >
                                    <option value="">No Lesson</option>
                                    {lessons.map((lesson) => (
                                        <option key={lesson.id} value={lesson.id}>
                                            {lesson.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                style={styles.textarea}
                                rows="4"
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Starter Code</label>
                            <textarea
                                name="starter_code"
                                value={formData.starter_code}
                                onChange={handleChange}
                                style={styles.codearea}
                                rows="6"
                                placeholder="function solution() {&#10;  // Your code here&#10;}"
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Solution Code</label>
                            <textarea
                                name="solution_code"
                                value={formData.solution_code}
                                onChange={handleChange}
                                style={styles.codearea}
                                rows="6"
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Hints (one per line)</label>
                            <textarea
                                name="hints"
                                value={formData.hints}
                                onChange={handleChange}
                                style={styles.textarea}
                                rows="4"
                                placeholder="Hint 1&#10;Hint 2&#10;Hint 3"
                            />
                        </div>

                        <button type="submit" style={styles.submitButton}>
                            {editingId ? 'Update Challenge' : 'Create Challenge'}
                        </button>
                    </form>
                </div>
            )}

            {/* Challenges List */}
            <div style={styles.card}>
                <table style={styles.table}>
                    <thead>
                    <tr style={styles.headerRow}>
                        <th style={styles.th}>Title</th>
                        <th style={styles.th}>Difficulty</th>
                        <th style={styles.th}>Type</th>
                        <th style={styles.th}>XP</th>
                        <th style={styles.th}>Lesson</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {challenges.map((challenge) => (
                        <tr key={challenge.id} style={styles.row}>
                            <td style={styles.td}>{challenge.title}</td>
                            <td style={styles.td}>
                  <span style={getDifficultyStyle(challenge.difficulty)}>
                    {challenge.difficulty}
                  </span>
                            </td>
                            <td style={styles.td}>{challenge.challenge_type}</td>
                            <td style={styles.td}>{challenge.xp_reward} XP</td>
                            <td style={styles.td}>{challenge.lesson?.title || '-'}</td>
                            <td style={styles.td}>
                                <div style={styles.actions}>
                                    <button onClick={() => handleEdit(challenge)} style={styles.editBtn}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(challenge.id)} style={styles.deleteBtn}>
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    headerActions: {
        display: 'flex',
        gap: '12px',
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
        padding: '8px 16px',
    },
    addButton: {
        backgroundColor: '#10b981',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600',
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
    formCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px',
    },
    formTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '16px',
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
    codearea: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '14px',
        fontFamily: 'monospace',
        resize: 'vertical',
    },
    submitButton: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600',
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
    difficultyBadge: {
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    actions: {
        display: 'flex',
        gap: '8px',
    },
    editBtn: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '6px 12px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
        cursor: 'pointer',
    },
    deleteBtn: {
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '6px 12px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
        cursor: 'pointer',
    },
};