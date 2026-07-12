import axios from "axios";

const getHadith = [
    {"name": "AbuDawud", "slug": "abu-dawud", "total": 4419},
    {"name": "Ahmad", "slug": "ahmad", "total": 4305},
    {"name": "Bukhari", "slug": "bukhari", "total": 6638},
    {"name": "Darimi", "slug": "darimi", "total": 2949},
    {"name": "Ibnu Majah", "slug": "ibnu-majah", "total": 4285},
    {"name": "Malik", "slug": "malik", "total": 1587},
    {"name": "Muslim", "slug": "muslim", "total": 4930},
    {"name": "Nasai", "slug": "nasai", "total": 5364},
    {"name": "Tirmidzi", "slug": "tirmidzi", "total": 3625}
];

const nameMap = {
    "AbuDawud": "أبو داود",
    "Ahmad": "أحمد",
    "Bukhari": "البخاري",
    "Darimi": "الدارمي",
    "Ibnu Majah": "ابن ماجه",
    "Malik": "مالك", 
    "Muslim": "مسلم",
    "Nasai": "النسائي",
    "Tirmidzi": "الترمذي"
};

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function fetchRandomHadith() {
    let randomIndex = getRandomNumber(0, getHadith.length - 1);
    let selectedBook = getHadith[randomIndex];
    let hadithNum = getRandomNumber(1, selectedBook.total);

    let apiUrl = `https://hadis-api-id.vercel.app/hadith/${selectedBook.slug}/${hadithNum}`;

    try {
        const response = await axios.get(apiUrl);
        const rawData = response.data;

        // فحص مكان النص العربي في استجابة الـ API بجميع الاحتمالات
        const arabText = rawData?.data?.contents?.arab || rawData?.data?.arab || rawData?.arab || "";

        return {
            bookName: nameMap[selectedBook.name],
            hadithNumber: hadithNum,
            text: arabText,
            apiUrl: apiUrl
        };

    } catch (error) {
        console.error("خطأ أثناء جلب الحديث:", error.message);
        throw error;
    }
}