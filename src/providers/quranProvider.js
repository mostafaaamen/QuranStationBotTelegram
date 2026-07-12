import getRandomAyahs from '../aya.js';
import { PATHS } from '../config/constants.js';
export function getQuranPayload() {
  const data = getRandomAyahs();
  return {
    text: data.text,
    metaText: `سورة ${data.surah} - الآية (${data.ayah}) عدد الآيات ${data.totalAyahs}`,
    caption: `سورة ${data.surah} - الآيات (${data.ayah}) من ${data.totalAyahs} آية\n\n#القرآن_الكريم`,
    bgImagePath: PATHS.defaultImage // صورة خاصة بالقرآن
  };
}