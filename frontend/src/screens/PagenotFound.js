import React from 'react';

const styles = {
    container: {
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        color: '#2c3e50',
    },
    code: {
        fontSize: '8rem',
        fontWeight: 'bold',
        color: '#6CC3D5',
        margin: 0,
    },
    message: {
        fontSize: '2rem',
        margin: '20px 0',
    },
    link: {
        marginTop: '20px',
        padding: '10px 24px',
        background: '#6CC3D5',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1rem',
        cursor: 'pointer',
    }
};

const PagenotFound = () => (
    <div style={styles.container}>
        <h1 style={styles.code}>404</h1>
        <div style={styles.message}>Oops! Page not found.</div>
        <a href="/" style={styles.link}>Go to Home</a>
    </div>
);

export default PagenotFound;