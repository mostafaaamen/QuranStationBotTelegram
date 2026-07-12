import getRandomAyahs from '../aya.js';
import { PATHS } from '../config/constants.js';
import { getFormattedAyas } from '../../src/utils/tafther.js';

// 1. أضفنا async للدالة
export async function getQuranPayload() {
  const data = getRandomAyahs();
  
  // 2. أضفنا await للانتظار لحين جلب البيانات من الـ API
  const result = await getFormattedAyas(data.number, data.startAyahId, data.endAyahId);
  return {
    text: data.text, // نضع الآيات المنسقة مع التفسير لترسم على الصورة
    metaText: `سورة ${data.surah} - الآية (${data.startAyahId} - ${data.endAyahId}) عدد الآيات ${data.totalAyahs}`,
    caption: `${result}\n\n#القران_الكريم\n\n #التفسير_الميسر`,
    bgImagePath: PATHS.defaultImage
  };
}
