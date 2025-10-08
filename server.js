// server.js - برای deploy روی Render.com (رایگان)
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const BOT_TOKEN = '8365529193:AAF9a1IuZyfdFkkvj5NKkbqrCpPyltSOhSQ';
const CHAT_ID = '8284681571';

app.post('/api/send-to-telegram', async (req, res) => {
    try {
        const { message } = req.body;
        
        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });

        res.json({ success: true, message: 'پیام ارسال شد' });
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ success: false, error: 'خطا در ارسال' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});