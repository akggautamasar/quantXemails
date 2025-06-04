// api/send-email.js
const { Resend } = require('resend');

// Initialize Resend with the API key from environment variables
// On Vercel, you'll set this as an environment variable named RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
    // Set CORS headers to allow requests from your frontend
    res.setHeader('Access-Control-Allow-Origin', '*'); // In production, replace '*' with your Vercel domain (e.g., 'https://your-app.vercel.app')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests (OPTIONS method)
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    // Ensure it's a POST request
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { to, subject, message } = req.body;

    // Basic validation
    if (!to || !subject || !message) {
        return res.status(400).json({ message: 'Missing required fields: to, subject, or message.' });
    }

    try {
        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', // IMPORTANT: This 'from' address must be verified in your Resend account
            to: [to], // Resend expects an array for 'to'
            subject: subject,
            html: `<p>${message.replace(/\n/g, '<br>')}</p>`, // Convert newlines to <br> for HTML
        });

        if (error) {
            console.error('Resend API Error:', error);
            return res.status(500).json({ message: 'Failed to send email via Resend.', details: error.message });
        }

        console.log('Email sent successfully:', data);
        return res.status(200).json({ id: data.id, message: 'Email sent successfully!' });

    } catch (error) {
        console.error('Vercel Function Error:', error);
        return res.status(500).json({ message: 'An unexpected error occurred.', details: error.message });
    }
};
