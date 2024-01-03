import dotenv from "dotenv"
import mongoose from "mongoose"
dotenv.config()
import { Telegraf } from "telegraf"


import { DataSchema } from "../model/stor.model.js"
import quran from "../quran.js";

const URL = process.env.DB_URL
mongoose.connect(URL).then(() => {
    console.log("mongodb connected database")
}).catch(() => {
    console.log("Error to connect database mongoose ")
})



setInterval(async() => {
    let dataStor = await DataSchema.find({})
    let { suraNum }=dataStor[0]
    let { ayaNum }=dataStor[0]
    const filter = { id: 28102001 };



    if (suraNum>114) {
        await DataSchema.findOneAndUpdate(filter, { suraNum:0});  
    }
    if (ayaNum < quran[suraNum].array.length) {
  
        let ayaSend = `


<b>
بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
</b>

${quran[suraNum].array[ayaNum].ar} ﴿${ayaNum + 1}﴾

${quran[suraNum].array[ayaNum + 1] != undefined ? `${quran[suraNum].array[ayaNum + 1].ar} ﴿${ayaNum + 2}﴾`:""}

    _____________________________________
    سورة : #${quran[suraNum].name}

    `
        bot.telegram.sendMessage(process.env.GROUP_ID, ayaSend, { parse_mode: 'HTML' })
            .then(() => console.log(`Message sent to`))
            .catch((err) => console.error(`Error sending message to:`, err));
        
        await DataSchema.findOneAndUpdate(filter, { ayaNum: ayaNum +2});
    } else {
        await DataSchema.findOneAndUpdate(filter, { suraNum: suraNum +1});
        await DataSchema.findOneAndUpdate(filter, { ayaNum: 0 });
        console.log("sura is ended")
    }
}, 15000)


const bot = new Telegraf(process.env.TELEGRAM_TOKEN)


let html = `

<b>
بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
</b>

 اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ*خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ*اقْرَأْ وَرَبُّكَ الْأَكْرَمُ*الَّذِي عَلَّمَ بِالْقَلَمِ

_______________________________________________________________
هذا البرنامج يقوم لعرض ايه من القران الكريم
_______________________________________________________________
`
bot.start((ctx) => {
    ctx.reply(html, { parse_mode: 'HTML' });
    const chatId = ctx.chat.id;
    ctx.reply(`Your chat ID is: ${chatId}`);
});



bot.launch()
console.log("Tesdfsdf")







