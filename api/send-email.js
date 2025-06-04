// This code would be part of your new backend project (e.g., an Express.js app, a cron job script).

// For Node.js, you might need to install 'node-fetch' if you're not using a recent Node version
// that has native fetch support: npm install node-fetch@2
const fetch = require('node-fetch');

/**
 * Sends an email using your deployed Vercel email API with authentication.
 * @param {string} recipientEmail The email address of the recipient.
 * @param {string} emailSubject The subject of the email.
 * @param {string} emailMessage The body of the email (plain text).
 * @returns {Promise<Object>} A promise that resolves with the API response data, or rejects on error.
 */
async function sendAuthenticatedEmail(recipientEmail, emailSubject, emailMessage) {
    const VERCEL_API_URL = 'https://quantxemails.vercel.app/api/send-email';

    // IMPORTANT: Load your secret key from environment variables.
    // Replace 'YOUR_PROJECT_SECRET_KEY_ENV_VAR' with the actual name of the
    // environment variable where you store your INTERNAL_EMAIL_API_KEY in this new project.
    const YOUR_SECRET_INTERNAL_API_KEY = process.env.YOUR_PROJECT_SECRET_KEY_ENV_VAR;

    if (!YOUR_SECRET_INTERNAL_API_KEY) {
        console.error('CRITICAL: INTERNAL_EMAIL_API_KEY environment variable is not set in this project.');
        throw new Error('Authentication key missing. Cannot send email securely.');
    }

    try {
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${YOUR_SECRET_INTERNAL_API_KEY}` // Include the secret key here
            },
            body: JSON.stringify({
                to: recipientEmail,
                subject: emailSubject,
                message: emailMessage
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Email sent successfully via authenticated API:', data);
            return data;
        } else {
            console.error('Failed to send email via authenticated API:', data.message || 'Unknown error');
            throw new Error(data.message || 'Failed to send email');
        }
    } catch (error) {
        console.error('An error occurred while calling the authenticated email API:', error);
        throw error;
    }
}

// --- Example Usage in your new backend project ---

// Example 1: Sending a welcome email after user registration
/*
async function handleNewUserRegistration(userData) {
    try {
        await sendAuthenticatedEmail(
            userData.email,
            'Welcome to Our Platform!',
            `Hi ${userData.name},\n\nThank you for registering!`
        );
        console.log(`Welcome email sent to ${userData.email}`);
    } catch (error) {
        console.error(`Error sending welcome email to ${userData.email}:`, error.message);
    }
}

// Call this function when a new user signs up
// handleNewUserRegistration({ email: 'newuser@example.com', name: 'Jane Doe' });
*/

// Example 2: Sending a daily report (e.g., from a scheduled cron job)
/*
async function sendDailyReport() {
    const reportData = "Your daily analytics summary..."; // Get this from your database/logic
    try {
        await sendAuthenticatedEmail(
            'admin@yourcompany.com',
            'Daily System Report',
            `Here is today's report:\n\n${reportData}`
        );
        console.log('Daily report sent successfully.');
    } catch (error) {
        console.error('Error sending daily report:', error.message);
    }
}

// This function would be called by your cron job scheduler
// sendDailyReport();
*/
