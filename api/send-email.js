// api/send-email.js
const { Resend } = require('resend');

module.exports = async (req, res) => {
    // Set CORS headers to allow requests from your frontend
    // In production, replace '*' with your Vercel domain (e.g., 'https://your-app.vercel.app')
    res.setHeader('Access-Control-Allow-Origin', '*');
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

    // Wrap the main logic in a try-catch to ensure JSON response for all errors
    try {
        // Check if RESEND_API_KEY is set
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY environment variable is not set.');
            return res.status(500).json({ message: 'Server configuration error: Resend API key missing.' });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const { to, subject, message } = req.body;

        // Basic validation
        if (!to || !subject || !message) {
            return res.status(400).json({ message: 'Missing required fields: to, subject, or message.' });
        }

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            // UPDATED: Using the provided verified domain.
            // IMPORTANT: Replace 'your_email' with an actual email address
            // that you have verified with Resend under the airmedisphere.in domain.
            from: 'your_email@airmedisphere.in',
            to: [to], // Resend expects an array for 'to'
            subject: subject,
            html: `<p>${message.replace(/\n/g, '<br>')}</p>`, // Convert newlines to <br> for HTML
        });

        if (error) {
            console.error('Resend API Error:', error);
            // Return a 500 status with a detailed error message from Resend
            return res.status(500).json({ message: 'Failed to send email via Resend.', details: error.message });
        }

        console.log('Email sent successfully:', data);
        return res.status(200).json({ id: data.id, message: 'Email sent successfully!' });

    } catch (error) {
        console.error('Vercel Function Uncaught Error:', error);
        // Catch any unexpected errors and return a generic JSON error
        return res.status(500).json({ message: 'An unexpected server error occurred.', details: error.message || 'No additional details.' });
    }
};
