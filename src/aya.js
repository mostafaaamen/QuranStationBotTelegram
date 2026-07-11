// aya.js
import quran from "../quran.js";

export function getRandomAyahs(quranData = quran) {
  // التأكد من وجود مصفوفة قراءة صالحة
  const validQuran = Array.isArray(quranData) 
    ? quranData.filter(s => s && Array.isArray(s.array) && s.array.length > 0)
    : [];

  if (validQuran.length === 0) {
    throw new Error("بيانات المصحف فارغة أو غير معرّفة بشكل صحيح!");
  }

  // 1. اختيار سورة عشوائية
  const randomSurah = validQuran[Math.floor(Math.random() * validQuran.length)];
  const ayahs = randomSurah.array;
  const totalAyahs = ayahs.length; // إجمالي عدد آيات السورة

  // دالة لحساب عدد الكلمات
  const countWords = (ayahList) => {
    return ayahList
      .map(a => a.ar || "")
      .join(" ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  };

  let selectedAyahs = [];

  // 2. التحقق مما إذا كانت السورة بالكامل أقل من أو تساوي 140 كلمة
  if (countWords(ayahs) <= 140) {
    selectedAyahs = [...ayahs];
  } else {
    // 3. تحديد 3 آيات افتراضياً
    const defaultAyahsCount = 3;
    const maxStartIndex = Math.max(0, ayahs.length - defaultAyahsCount);
    const startIndex = Math.floor(Math.random() * (maxStartIndex + 1));
    const endIndex = Math.min(startIndex + defaultAyahsCount, ayahs.length);

    selectedAyahs = ayahs.slice(startIndex, endIndex);

    // 4. التأكد من عدم تجاوز الـ 140 كلمة
    while (selectedAyahs.length > 1 && countWords(selectedAyahs) > 140) {
      selectedAyahs.pop();
    }
  }

  // 5. بناء وتنسيق المخرجات
  const text = selectedAyahs.map(a => `${a.ar} (${a.id})`).join(" ");
  const surahName = randomSurah.name;
  
  const startAyahId = selectedAyahs[0].id;
  const endAyahId = selectedAyahs[selectedAyahs.length - 1].id;
  const ayahRange = startAyahId === endAyahId ? `${startAyahId}` : `${startAyahId} - ${endAyahId}`;

  return {
    text: text,
    surah: surahName,
    ayah: ayahRange,
    totalAyahs: totalAyahs
  };
}

export default getRandomAyahs;