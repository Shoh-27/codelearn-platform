import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { Dashboard } from './pages/Dashboard.js';
import { Profile } from './pages/Profile.js';
import { Challenges } from './pages/Challenges.js';
import { ChallengeDetail } from './pages/ChallengeDetail.js';
import { Projects } from './pages/Projects.js';
import {ProjectDetail} from './pages/ProjectDetail.js';
import { Leaderboard } from './pages/Leaderboard.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';

// Protected Route Wrapper
function ProtectedRoute({ children, adminOnly = false }) {
    const { isAuthenticated, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div style={styles.loading}>
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <Navbar />
            <div style={styles.content}>
                {children}
            </div>
        </>
    );
}

// Public Route Wrapper (redirect if authenticated)
function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={styles.loading}>
                Loading...
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div style={styles.app}>
                    <Routes>
                        {/* Public Routes */}
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/challenges"
                            element={
                                <ProtectedRoute>
                                    <Challenges />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/challenges/:slug"
                            element={
                                <ProtectedRoute>
                                    <ChallengeDetail />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/projects"
                            element={
                                <ProtectedRoute>
                                    <Projects />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/projects/:slug"
                            element={
                                <ProtectedRoute>
                                    <ProjectDetail />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/leaderboard"
                            element={
                                <ProtectedRoute>
                                    <Leaderboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute adminOnly>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Redirect root to dashboard or login */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />

                        {/* 404 Not Found */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

function NotFound() {
    return (
        <div style={styles.notFound}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/dashboard" style={styles.link}>Go to Dashboard</a>
        </div>
    );
}

const styles = {
    app: {
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
    },
    content: {
        minHeight: 'calc(100vh - 64px)',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#6b7280',
    },
    notFound: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
    },
    link: {
        marginTop: '16px',
        color: '#3b82f6',
        textDecoration: 'none',
        fontWeight: '600',
    },
};

export default App;