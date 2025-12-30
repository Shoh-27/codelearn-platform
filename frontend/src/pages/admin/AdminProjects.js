import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, adminAPI } from '../../services/api.js';

export function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        difficulty: 'beginner',
        xp_reward: 300,
        estimated_hours: '',
        technologies: '',
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectsAPI.getAll();
            setProjects(response.data.data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
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
                technologies: formData.technologies
                    ? formData.technologies.split(',').map(t => t.trim()).filter(t => t)
                    : [],
            };

            if (editingId) {
                await adminAPI.updateProject(editingId, data);
                setMessage('Project updated successfully');
            } else {
                await adminAPI.createProject(data);
                setMessage('Project created successfully');
            }

            setShowForm(false);
            setEditingId(null);
            setFormData({
                title: '',
                description: '',
                requirements: '',
                difficulty: 'beginner',
                xp_reward: 300,
                estimated_hours: '',
                technologies: '',
            });
            fetchProjects();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to save project');
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.id);
        setFormData({
            title: project.title,
            description: project.description,
            requirements: project.requirements || '',
            difficulty: project.difficulty,
            xp_reward: project.xp_reward,
            estimated_hours: project.estimated_hours || '',
            technologies: project.technologies ? project.technologies.join(', ') : '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) {
            return;
        }

        try {
            await adminAPI.deleteProject(id);
            setMessage('Project deleted successfully');
            fetchProjects();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to delete project');
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Project Management</h1>
                <div style={styles.headerActions}>
                    <Link to="/admin" style={styles.backButton}>← Back</Link>
                    <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
                        {showForm ? 'Cancel' : '+ Add Project'}
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
                    <h2 style={styles.formTitle}>{editingId ? 'Edit Project' : 'Create Project'}</h2>
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
                                <label style={styles.label}>Estimated Hours</label>
                                <input
                                    type="number"
                                    name="estimated_hours"
                                    value={formData.estimated_hours}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
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
                            <label style={styles.label}>Requirements *</label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                style={styles.textarea}
                                rows="6"
                                placeholder="- Requirement 1&#10;- Requirement 2&#10;- Requirement 3"
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Technologies (comma-separated)</label>
                            <input
                                type="text"
                                name="technologies"
                                value={formData.technologies}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="React, Laravel, MySQL"
                            />
                        </div>

                        <button type="submit" style={styles.submitButton}>
                            {editingId ? 'Update Project' : 'Create Project'}
                        </button>
                    </form>
                </div>
            )}

            {/* Projects Grid */}
            <div style={styles.grid}>
                {projects.map((project) => (
                    <div key={project.id} style={styles.projectCard}>
                        <h3 style={styles.projectTitle}>{project.title}</h3>
                        <p style={styles.projectDesc}>{project.description}</p>

                        <div style={styles.projectMeta}>
              <span style={getDifficultyStyle(project.difficulty)}>
                {project.difficulty}
              </span>
                            <span style={styles.xpBadge}>{project.xp_reward} XP</span>
                        </div>

                        {project.technologies && (
                            <div style={styles.techBadges}>
                                {project.technologies.slice(0, 3).map((tech, idx) => (
                                    <span key={idx} style={styles.techBadge}>{tech}</span>
                                ))}
                            </div>
                        )}

                        <div style={styles.projectActions}>
                            <button onClick={() => handleEdit(project)} style={styles.editBtn}>
                                Edit
                            </button>
                            <button onClick={() => handleDelete(project.id)} style={styles.deleteBtn}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <div style={styles.empty}>No projects yet. Create your first project!</div>
            )}
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
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
    },
    projectCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    projectTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px',
    },
    projectDesc: {
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '12px',
        lineHeight: '1.5',
    },
    projectMeta: {
        display: 'flex',
        gap: '12px',
        marginBottom: '12px',
    },
    difficultyBadge: {
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    xpBadge: {
        backgroundColor: '#dcfce7',
        color: '#166534',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
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
    },
    projectActions: {
        display: 'flex',
        gap: '8px',
        marginTop: '16px',
    },
    editBtn: {
        flex: 1,
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '8px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    deleteBtn: {
        flex: 1,
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '8px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    empty: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#6b7280',
    },
};