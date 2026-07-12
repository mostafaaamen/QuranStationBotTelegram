import dotenv from "dotenv";
import { generateContentCard } from "./services/imageGenerator.js";
import { publishPhotoPost } from "./services/facebookPublisher.js";
import { getQuranPayload } from "./providers/quranProvider.js";
import { getHadithPayload } from "./providers/log.js"; // قم بضبط المسار حسب مجلدك
import { startAutoPing } from './auto.js';
// بدء التشغيل
startAutoPing();
dotenv.config();
// متغيّر لتحديد ما إذا كان المنشور القادم حديث أم قرآن (للتبادل بينهما)
let isQuranNext = true;

async function processTask() {
  try {
    let payload;

    // التبديل بين القرآن والحديث في كل دورة
    if (isQuranNext) {
      console.log(`[${new Date().toLocaleTimeString()}] جاري اختيار منشور: قرآن كريم...`);
      payload = await getQuranPayload(); // أضفنا await تحسباً لو كانت async
      isQuranNext = false; // المرة الجاية حديث
    } else {
      console.log(`[${new Date().toLocaleTimeString()}] جاري اختيار منشور: حديث شريف...`);
      payload = await getHadithPayload(); // ضروري await لأن الأحاديث بتيجي من API
      isQuranNext = true; // المرة الجاية قرآن
    }

    // التحقق من أن النص ليس فارغاً
    if (!payload || !payload.text) {
        throw new Error("محتوى النص فارغ، تم إلغاء عملية النشر لهذه الدورة.");
    }

    // 2. إنتاج الصورة
    const imageBuffer = await generateContentCard({
      text: payload.text,
      metaText: payload.metaText,
      bgImagePath: payload.bgImagePath
    });

    // 3. النشر على فيسبوك
    await publishPhotoPost(imageBuffer, payload.caption);
    console.log(`[${new Date().toLocaleTimeString()}] تم النشر بنجاح!`);

  } catch (err) {
    console.error("حدث خطأ أثناء تنفيذ المهمة:", err.message || err);
  }
}

// التشغيل الفوري أول مرة عند تشغيل السكربت
processTask();

// التكرار كل 5 دقائق (5 دقائق * 60 ثانية * 1000 مللي ثانية)
const TEN_MINUTES = 2 * 60 * 1000;
setInterval(processTask, TEN_MINUTES);
