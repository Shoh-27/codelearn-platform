import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {challengesAPI} from "../services/api.js";

export function ChallengeDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [code, setCode] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChallenge();
    }, [slug]);

    const fetchChallenge = async () => {
        try {
            const response = await challengesAPI.getBySlug(slug);
            const data = response.data.data;
            setChallenge(data);
            setCode(data.starter_code || '');
        } catch (error) {
            console.error('Failed to fetch challenge', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setResult(null);

        try {
            const response = await challengesAPI.submit(challenge.id, code);
            setResult(response.data);

            if (response.data.success) {
                setTimeout(() => {
                    navigate('/challenges');
                }, 3000);
            }
        } catch (error) {
            setResult({
                success: false,
                message: 'Submission failed. Please try again.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    if (!challenge) {
        return <div style={styles.error}>Challenge not found</div>;
    }

    return (
        <div style={styles.container}>
            <Link to="/challenges" style={styles.backLink}>← Back to Challenges</Link>

            <div style={styles.detailHeader}>
                <h1 style={styles.detailTitle}>{challenge.title}</h1>
                <div style={styles.detailMeta}>
          <span style={getDifficultyStyle(challenge.difficulty)}>
            {challenge.difficulty}
          </span>
                    <span style={styles.xpReward}>{challenge.xp_reward} XP</span>
                    {challenge.time_limit_minutes && (
                        <span style={styles.timeLimit}>⏱ {challenge.time_limit_minutes} min</span>
                    )}
                </div>
            </div>

            <div style={styles.detailGrid}>
                <div style={styles.descriptionCard}>
                    <h2 style={styles.sectionTitle}>Description</h2>
                    <p style={styles.description}>{challenge.description}</p>

                    {challenge.hints && challenge.hints.length > 0 && (
                        <div style={styles.hintsSection}>
                            <h3 style={styles.hintsTitle}>💡 Hints</h3>
                            <ul style={styles.hintsList}>
                                {challenge.hints.map((hint, idx) => (
                                    <li key={idx} style={styles.hintItem}>{hint}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div style={styles.codeCard}>
                    <h2 style={styles.sectionTitle}>Your Solution</h2>

                    {result && (
                        <div style={result.success ? styles.successResult : styles.errorResult}>
                            <strong>{result.message}</strong>
                            {result.success && result.gamification && (
                                <div style={styles.gamificationResult}>
                                    <p>🎉 +{result.xp_awarded} XP</p>
                                    {result.gamification.leveled_up && (
                                        <p>🎊 Level Up! Now Level {result.gamification.new_level}</p>
                                    )}
                                    {result.gamification.new_badges.length > 0 && (
                                        <p>🏆 New Badge: {result.gamification.new_badges[0].name}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={styles.codeEditor}
                rows="20"
                placeholder="Write your code here..."
            />

                        <button
                            type="submit"
                            style={styles.submitButton}
                            disabled={submitting || !code.trim()}
                        >
                            {submitting ? 'Submitting...' : 'Submit Solution'}
                        </button>
                    </form>
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