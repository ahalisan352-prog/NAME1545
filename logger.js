// logger.js - نسخه جدید با سرور
const API_URL = 'https://your-app.onrender.com/api/send-to-telegram'; // بعد از deploy عوض کن

// تابع ارسال به تلگرام
async function sendToTelegram(message) {
    try {
        console.log('📤 در حال ارسال به سرور...');
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message
            })
        });

        if (response.ok) {
            console.log('✅ پیام با موفقیت ارسال شد');
            return true;
        } else {
            console.error('❌ خطا در ارسال:', response.status);
            saveToLocalStorage(message);
            return false;
        }
    } catch (error) {
        console.error('❌ خطا در ارتباط با سرور:', error);
        saveToLocalStorage(message);
        return false;
    }
}

// بقیه کدها مثل قبل...