import { fetchRandomHadith } from "./hadith.js";
import { PATHS } from '../config/constants.js';

export async function getHadithPayload() {
    const hadith = await fetchRandomHadith();

    return {
        text: hadith.text,
        metaText: `رواه ${hadith.bookName} - حديث رقم (${hadith.hadithNumber})`,
        caption: `رواه ${hadith.bookName} - حديث رقم (${hadith.hadithNumber})\n\n#الحديث_الشريف #أحاديث\n\n${hadith.text}`,
        bgImagePath: PATHS.hadithImage
    };
}