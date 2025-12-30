import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom'; // Link ham shu yerda import qilindi
import { useAuth } from "../contexts/AuthContext.js";

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrors({});
        setLoading(true);

        const result = await register(name, email, password, passwordConfirmation);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
            if (result.errors) {
                setErrors(result.errors);
            }
        }

        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Register</h1>
                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={styles.input}
                            required
                        />
                        {errors.name && <span style={styles.fieldError}>{errors.name[0]}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                        />
                        {errors.email && <span style={styles.fieldError}>{errors.email[0]}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                        {errors.password && <span style={styles.fieldError}>{errors.password[0]}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p style={styles.link}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

// Shared styles
const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '20px',
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '24px',
        textAlign: 'center',
        color: '#1f2937',
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '16px',
    },
    fieldError: {
        color: '#dc2626',
        fontSize: '14px',
        marginTop: '4px',
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
    button: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
    },
    link: {
        textAlign: 'center',
        marginTop: '16px',
        color: '#6b7280',
    },
};