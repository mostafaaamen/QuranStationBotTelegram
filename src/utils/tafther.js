import axios from "axios";

export async function getFormattedAyas(suraNumber, startAya, endAya) {
  const url = `https://quranenc.com/api/v1/translation/sura/arabic_moyassar/${suraNumber}`;

  try {
    const response = await axios.get(url);
    const allAyas = response.data.result;

    // 1. فلترة الآيات حسب النطاق
    const selectedAyas = allAyas.filter(item => {
      const ayaNum = parseInt(item.aya, 10);
      return ayaNum >= startAya && ayaNum <= endAya;
    });

    // 2. تحويل كل أية وتفسيرها للشكل المطلوب مع التباعد
    const formattedResult = selectedAyas
      .map(item => `${item.arabic_text}\n${item.translation}`)
      .join('\n\n');

    return formattedResult;

  } catch (error) {
    console.error('حدث خطأ أثناء جلب البيانات:', error.message);
    throw error;
  }
}

