// auto.js
import axios from 'axios';

const URL = 'https://arcards-azmos.onrender.com';
const FIVE_MINUTES = 5 * 60 * 1000;

export async function sendPing() {
  try {
    const response = await axios.get(URL);
    console.log(`[${new Date().toLocaleTimeString()}] Ping successful! Status: ${response.status}`);
  } catch (error) {
    console.error(`[${new Date().toLocaleTimeString()}] Ping failed: ${error.message}`);
  }
}

export function startAutoPing() {
  console.log('🚀 Starting Auto-Ping service every 5 minutes using Axios...');
  
  // إرسال أول ريكويست فوراً عند التشغيل
  sendPing();

  // تكرار الإرسال كل 5 دقائق
  setInterval(sendPing, FIVE_MINUTES);
}