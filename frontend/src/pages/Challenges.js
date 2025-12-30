import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { challengesAPI } from '../services/api.js';

export function Challenges() {
    const [challenges, setChallenges] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChallenges();
    }, [filter]);

    const fetchChallenges = async () => {
        try {
            const difficulty = filter !== 'all' ? filter : null;
            const response = await challengesAPI.getAll(difficulty);
            setChallenges(response.data.data);
        } catch (error) {
            console.error('Failed to fetch challenges', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Challenges</h1>

            <div style={styles.filterBar}>
                <button
                    onClick={() => setFilter('all')}
                    style={filter === 'all' ? styles.filterButtonActive : styles.filterButton}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('beginner')}
                    style={filter === 'beginner' ? styles.filterButtonActive : styles.filterButton}
                >
                    Beginner
                </button>
                <button
                    onClick={() => setFilter('intermediate')}
                    style={filter === 'intermediate' ? styles.filterButtonActive : styles.filterButton}
                >
                    Intermediate
                </button>
                <button
                    onClick={() => setFilter('advanced')}
                    style={filter === 'advanced' ? styles.filterButtonActive : styles.filterButton}
                >
                    Advanced
                </button>
            </div>

            <div style={styles.grid}>
                {challenges.map((challenge) => (
                    <Link
                        key={challenge.id}
                        to={`/challenges/${challenge.slug}`}
                        style={styles.card}
                    >
                        <h3 style={styles.cardTitle}>{challenge.title}</h3>
                        <p style={styles.cardDesc}>{challenge.description}</p>

                        {challenge.lesson && (
                            <div style={styles.lessonBadge}>
                                📚 {challenge.lesson.title}
                            </div>
                        )}

                        <div style={styles.cardFooter}>
              <span style={getDifficultyStyle(challenge.difficulty)}>
                {challenge.difficulty}
              </span>
                            <span style={styles.xpReward}>{challenge.xp_reward} XP</span>
                        </div>
                    </Link>
                ))}
            </div>

            {challenges.length === 0 && (
                <div style={styles.emptyState}>
                    No challenges found for this difficulty level.
                </div>
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
    filterBar: {
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
    },
    filterButton: {
        padding: '8px 16px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontWeight: '500',
        color: '#374151',
    },
    filterButtonActive: {
        padding: '8px 16px',
        border: '1px solid #3b82f6',
        borderRadius: '4px',
        backgroundColor: '#3b82f6',
        cursor: 'pointer',
        fontWeight: '500',
        color: 'white',
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
    lessonBadge: {
        fontSize: '12px',
        color: '#6b7280',
        marginBottom: '12px',
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '12px',
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
    emptyState: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#6b7280',
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
    timeLimit: {
        color: '#6b7280',
        fontSize: '14px',
    },
    detailGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
    descriptionCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    codeCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#1f2937',
    },
    description: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#374151',
    },
    hintsSection: {
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#fef3c7',
        borderRadius: '4px',
    },
    hintsTitle: {
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '12px',
        color: '#92400e',
    },
    hintsList: {
        margin: 0,
        paddingLeft: '20px',
        color: '#92400e',
    },
    hintItem: {
        marginBottom: '8px',
    },
    successResult: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
        padding: '16px',
        borderRadius: '4px',
        marginBottom: '16px',
    },
    errorResult: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        padding: '16px',
        borderRadius: '4px',
        marginBottom: '16px',
    },
    gamificationResult: {
        marginTop: '8px',
        fontSize: '14px',
    },
    codeEditor: {
        width: '100%',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '14px',
        fontFamily: 'monospace',
        marginBottom: '16px',
        resize: 'vertical',
    },
    submitButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
    },
};

