// run.js
import dotenv from "dotenv";
import axios from "axios";
import { createCanvas, loadImage, registerFont } from 'canvas';
import FormData from "form-data";
import path from 'path';
import { fileURLToPath } from 'url';
import getRandomAyahs from "./aya.js"; // استيراد دالة جلب الآيات العشوائية

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تسجيل الخط
registerFont(path.join(__dirname, '../fonts/Amiri-Regular.ttf'), { family: 'Amiri' });

const BOX = {
    x: 180,        
    y: 160,        
    width: 840,    
    height: 520    
};

// دالة تقسيم السطور
function getLines(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLineWords = [];

    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let testLineWords = [...currentLineWords, word];
        let testLine = testLineWords.join(' ');
        let metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLineWords.length > 0) {
            lines.push(currentLineWords.join(' '));
            currentLineWords = [word];
        } else {
            currentLineWords = testLineWords;
        }
    }
    if (currentLineWords.length > 0) {
        lines.push(currentLineWords.join(' '));
    }
    return lines;
}

function fitTextInBox(ctx, text, boxWidth, boxHeight, startFontSize) {
    let fontSize = startFontSize;
    let lines = [];
    let totalHeight = 0;

    do {
        ctx.font = `bold ${fontSize}px "Amiri"`;
        lines = getLines(ctx, text, boxWidth);
        totalHeight = lines.length * (fontSize * 1.7); 
        fontSize -= 1; 
    } while (totalHeight > (boxHeight - 60) && fontSize > 14); 

    return { lines, fontSize, totalHeight };
}

// دالة ضبط الأطراف (Justify)
function drawJustifiedLine(ctx, lineText, startX, startY, maxWidth, isLastLine) {
    if (isLastLine) {
        ctx.textAlign = 'center';
        const centerY = startY;
        const centerX = startX + maxWidth / 2;
        ctx.fillText(lineText, centerX, centerY);
        return;
    }

    const words = lineText.split(' ');
    
    if (words.length <= 1) {
        ctx.textAlign = 'center';
        ctx.fillText(lineText, startX + maxWidth / 2, startY);
        return;
    }

    let totalWordsWidth = 0;
    words.forEach(word => {
        totalWordsWidth += ctx.measureText(word).width;
    });

    const totalSpaceWidth = maxWidth - totalWordsWidth;
    const spaceWidth = totalSpaceWidth / (words.length - 1);

    let currentX = startX + maxWidth; 
    ctx.textAlign = 'right';

    words.forEach((word) => {
        ctx.fillText(word, currentX, startY);
        const wordWidth = ctx.measureText(word).width;
        currentX -= (wordWidth + spaceWidth);
    });
}

async function generateQuranCardBuffer(quranText, surahName, ayahNumber, totalAyahs) {
    const imagePath = path.join(__dirname, '../img/photo.png');
    const background = await loadImage(imagePath);

    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.textBaseline = 'middle';   

    const formattedText = `${quranText.trim()} `;
    
    const startFontSize = 32; 
    const { lines, fontSize, totalHeight } = fitTextInBox(ctx, formattedText, BOX.width, BOX.height, startFontSize);

    ctx.font = `bold ${fontSize}px "Amiri"`;
    ctx.fillStyle = '#f7e7c4'; 
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 5;

    const lineHeight = fontSize * 1.7;
    let startY = BOX.y + (BOX.height - totalHeight) / 2 + (lineHeight / 2); 
    const centerX = background.width / 2; 

    lines.forEach((line, index) => {
        const isLastLine = index === lines.length - 1;
        drawJustifiedLine(ctx, line, BOX.x, startY, BOX.width, isLastLine);
        startY += lineHeight;
    });

    ctx.shadowBlur = 0; 
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - 120, startY + 15);
    ctx.lineTo(centerX + 120, startY + 15);
    ctx.stroke();

    // طباعة اسم السورة، الآيات المعروضة، وإجمالي عدد آيات السورة
    const metaText = `سورة ${surahName} - الآية (${ayahNumber}) من ${totalAyahs} آية`;
    ctx.font = `normal 22px "Amiri"`;
    ctx.fillStyle = '#d4af37'; 
    ctx.textAlign = 'center';
    ctx.fillText(metaText, centerX, startY + 50);

    return canvas.toBuffer('image/png');
}

async function publishPhotoPost(imageBuffer, captionMessage) {
  try {
    const pageId = "111374497711676";
    const accessToken = process.env.ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("ACCESS_TOKEN is missing in .env");
    }

    const formData = new FormData();
    formData.append("source", imageBuffer, { filename: "quran_card.png" });
    formData.append("caption", captionMessage);

    const response = await axios.post(
      `https://graph.facebook.com/v25.0/${pageId}/photos`,
      formData,
      {
        params: { access_token: accessToken },
        headers: { ...formData.getHeaders() }
      }
    );

    console.log("تم نشر الصورة بنجاح على فيسبوك!");
    console.log("رقم المنشور (Post ID):", response.data.id);
  } catch (error) {
    console.error("Facebook API Error:", error.response?.data || error.message);
  }
}

// دالة تنفيذ النشر
async function processTask() {
    try {
        // 1. توليد آيات عشوائية جديدة عند كل استدعاء
        const quranData = getRandomAyahs();
        
        console.log(`[${new Date().toLocaleTimeString()}] جاري معالجة: سورة ${quranData.surah} - الآيات (${quranData.ayah}) من إجمالي ${quranData.totalAyahs} آية...`);
        
        // 2. تصميم الصورة
        const imageBuffer = await generateQuranCardBuffer(
            quranData.text, 
            quranData.surah, 
            quranData.ayah, 
            quranData.totalAyahs
        );

        // 3. تجهيز الوصف والنشر
        const postCaption = `سورة ${quranData.surah} - الآيات (${quranData.ayah}) من ${quranData.totalAyahs} آية\n\n#القرآن_الكريم`;
        await publishPhotoPost(imageBuffer, postCaption);

    } catch (err) {
        console.error("حدث خطأ أثناء تنفيذ المهمة:", err);
    }
}

// التشغيل الفوري عند بدء السكريبت
processTask();

// التكرار كل 5 دقائق
const FIVE_MINUTES = 5 * 60 * 1000;
setInterval(processTask, FIVE_MINUTES);