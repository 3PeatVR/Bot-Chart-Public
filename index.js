import puppeteer from "puppeteer";
import { configDotenv } from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import { TwitterApi } from "twitter-api-v2";
import express from 'express';
import { CronJob } from "cron";
import { format, getISOWeek } from "date-fns";

const minutes_possibles = ["0","1"];
const drapeaux = { "United Kingdom": "🇬🇧", "United States": "🇺🇸", "Australia": "🇦🇺", "Germany": "🇩🇪", "Canada": "🇨🇦" };
const emoji_fr = ["🥖", "🍷", "🧀", "🥐"];
const emoji_jap = ["🗾", "🍜", "🍱", "🍢"];
const hashtags = ["retro", "TopCharts", "old"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
configDotenv({ path: __dirname + "/.env" });



const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});
console.log('Le bot est live.')

const client = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
});

const bearer = new TwitterApi(process.env.BEARER_TOKEN);

const twitterClient = client.readWrite;
const twitterBearer = bearer.readOnly;
const key_ytb = process.env.API_KEY_YTB;


const main = async () => {
    try{
    const date = new Date();
    const url = "https://www.thisdayinmusic.com/birthday-no1/";
    const month_url = (date.getMonth()+1).toString();
    const month_nb = (date.getMonth()).toString();
    const day = date.getDate().toString();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[month_nb];
    function getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    }
    const year = getRandomIntInclusive(1960, 2023).toString();

    const chiffre = getRandomIntInclusive(0, 6);
    //console.log("Le nombre est " + chiffre.toString());

    const minute = date.getMinutes().toString();

    if (minutes_possibles.includes(minute)) {
        if (chiffre != 5 && chiffre != 6) {
            const browser = await puppeteer.launch({
                args: [
                    "--disable-setuid-sandbox",
                    "--no-sandbox",
                    "--single-process",
                    "--no-zygote",
                    '--disable-features=site-per-process',
                ],
                executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
            });
            const page = await browser.newPage();
            await page.goto(url,{ waitUntil: 'networkidle2', timeout: 0 });
            await page.select("#day_start", day);
            await page.select("#month_start", month);
            await page.select("#year_start", year)
            await page.click("#mvp-content-main > div.TDIM-Birthday-No1-jukebox-container-background > div > form > div > button");
            await page.waitForSelector("#birthday--loop > div.tdim-on-this-day-birthday-titles > div.birthday--artist", { waitUntil: 'networkidle2', timeout: 0 });
            await page.waitForSelector("#birthday--loop > div.tdim-on-this-day-birthday-titles > div.birthday--number1", { waitUntil: 'networkidle2', timeout: 0 });
            //await page.reload();
            const names = await page.evaluate(() => {
                const cadre_list = document.querySelectorAll(".tdim-on-this-day-birthday-titles");
                return Array.from(cadre_list).map((cadre) => {
                    const image = cadre.querySelector("img")
                    const country = image.getAttribute("alt");
                    const name = cadre.querySelector(".birthday--artist").innerText;
                    const song = cadre.querySelector(".birthday--number1").innerText;
                    return { name, song, country };
                });

            });
            await browser.close();
            const url_ytb = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${names[chiffre]['song'] + " " + names[chiffre]['name']}&type=video&key=${key_ytb}`;
            fetch(url_ytb).then(response => response.json()).then(data => {
                const id = data.items[0].id.videoId;
                if (names[chiffre]['country'] == "United Kingdom" || names[chiffre]['country'] == "United States") {
                    twitterClient.v2.tweet(`🕰️ The ${day} of ${month} of ${year}, the most popular song in the ${names[chiffre]['country']} ${drapeaux[names[chiffre]['country']]} was '${names[chiffre]['song']}' by ${names[chiffre]['name']} #${hashtags[getRandomIntInclusive(0,2)]} . https://www.youtube.com/watch?v=${id}`);
                    console.log("envoyer tweet");
                } else {
                    twitterClient.v2.tweet(`🕰️ The ${day} of ${month} of ${year}, the most popular song in ${names[chiffre]['country']} ${drapeaux[names[chiffre]['country']]} was '${names[chiffre]['song']}' by ${names[chiffre]['name']} #${hashtags[getRandomIntInclusive(0,2)]} . https://www.youtube.com/watch?v=${id}`);
                    console.log("envoyer tweet");
                }
            }).catch(error => alert('Error : ' + error));


        }; 
        if (chiffre == 5) {
            const year_fr = getRandomIntInclusive(1984, 2020).toString();
            const old_date = format(new Date(year_fr, month_nb, day), "yyyy-MM-dd");
            const weekNumber = getISOWeek(old_date);
            const browser = await puppeteer.launch({
                args: [
                    "--disable-setuid-sandbox",
                    "--no-sandbox",
                    "--single-process",
                    "--no-zygote",
                    '--disable-features=site-per-process',
                ],
                executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
            });
            const page = await browser.newPage();

            if (weekNumber.length == 1) {
                await page.goto("https://www.chartsinfrance.net/charts/" + year_fr.slice(-2) + "0" + weekNumber + "/singles.php", { waitUntil: 'networkidle2', timeout: 0 });

            } else {
                await page.goto("https://www.chartsinfrance.net/charts/" + year_fr.slice(-2) + weekNumber + "/singles.php", { waitUntil: 'networkidle2', timeout: 0 });
            };
            //await page.click("#cmp-main > button.jad_cmp_paywall_button.jad_cmp_paywall_button-cookies.jad_cmp_paywall_cookies.didomi-components-button.didomi-button.didomi-dismiss-button.didomi-components-button--color.didomi-button-highlight.highlight-button");
            //await page.reload();
            //await page.waitForSelector("#contenu > table > tbody > tr > td > div:nth-child(3) > div.b618 > div:nth-child(4) > div.c1_td1 > div.c1_td5", { waitUntil: 'load', timeout: 0 });
            const name = await page.evaluate(() => {
                if (document.querySelector("#contenu > table > tbody > tr > td > div:nth-child(3) > div.b618 > div:nth-child(4) > div.c1_td1 > div.c1_td5 > font.noir13b > a") !== null) {
                    const cadre_1 = document.querySelector("#contenu > table > tbody > tr > td > div:nth-child(3) > div.b618 > div:nth-child(4) > div.c1_td1 > div.c1_td5 > font.noir13b");
                    const nom = cadre_1.querySelector("a").innerText
                    const cadre_2 = document.querySelector("#contenu > table > tbody > tr > td > div:nth-child(3) > div.b618 > div:nth-child(4) > div.c1_td1 > div.c1_td5 > font.noir11 > a");
                    const musique = cadre_2.innerText;
                    return { nom, musique };
                } else {
                    const cadre_1 = document.querySelector("#contenu > table > tbody > tr > td > div:nth-child(3) > div.b618 > div:nth-child(4) > div.c1_td1 > div.c1_td5 > font.noir13b");
                    const nom = cadre_1.innerText;
                    const cadre_2 = document.querySelector("#contenu > table > tbody > tr > td > div:nth-child(3) > div.b618 > div:nth-child(4) > div.c1_td1 > div.c1_td5 > font.noir11");
                    const musique = cadre_2.innerText;
                    return { nom, musique };
                };
                


            });
            await browser.close();
            const url_ytb = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${name['musique'] + " " + name['nom']}&type=video&key=${key_ytb}`;
            fetch(url_ytb).then(response => response.json()).then(data => {
                const id = data.items[0].id.videoId;
                const chifrre_emoji = getRandomIntInclusive(0, 3);
                twitterClient.v2.tweet("🕰️ " + "The " + day + " of " + month + " of " + year_fr + " (week " + weekNumber + ")" + ", the most popular song in " + "France" + " 🇫🇷 " + emoji_fr[chifrre_emoji % 4] + " " + emoji_fr[(chifrre_emoji + 1) % 4] + " " + emoji_fr[(chifrre_emoji + 2) % 4] + " was " + "'" + name['musique'] + "'" + " by " + name['nom'] +" #"+ hashtags[getRandomIntInclusive(0,2)] + " ." + `https://www.youtube.com/watch?v=${id}`);
                console.log("envoyer tweet");
            }).catch(error => alert('Error : ' + error));
}; if (chiffre == 6) {
    const year_jap = getRandomIntInclusive(2014, 2023).toString(); 
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
            '--disable-features=site-per-process',
        ],
        executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
    });
    const page = await browser.newPage();
    await page.goto(`https://kma.kkbox.com/charts/daily/song?cate=308&date=${year_jap}-${month_url}-${day}&lang=en&terr=sg`,{
    waitUntil: 'networkidle0', timeout: 0 
  });
  await page.waitForSelector(".charts-list-song");
  const cadre = await page.evaluate(() => {
    const cadre1 = document.querySelector(".charts-list-song");
    const musique = cadre1.innerText;
    const cadre2 = document.querySelector(".charts-list-artist");
    const artiste = cadre2.innerText;
    return  {musique, artiste};
});
await browser.close();
const url_ytb = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${cadre['musique'] + " " + cadre['artiste']}&type=video&key=${key_ytb}`;
fetch(url_ytb).then(response => response.json()).then(data => {
    const id = data.items[0].id.videoId;
    const chifrre_emoji = getRandomIntInclusive(0, 3);
    twitterClient.v2.tweet(`🕰️ The ${day} of ${month} of ${year_jap}, the most popular song in Japan 🇯🇵 ${emoji_jap[chifrre_emoji % 4]} ${emoji_jap[(chifrre_emoji + 1) % 4]} ${emoji_jap[(chifrre_emoji + 2) % 4]} was '${cadre['musique']}' by ${cadre['artiste']} #${hashtags[getRandomIntInclusive(0,2)]} . https://www.youtube.com/watch?v=${id}`);
    console.log("envoyer tweet");
}).catch(error => alert('Error : ' + error));



};
    };

}catch(e){main();}};



app.get('/', function (req, res) {
    res.send("Normalement ça marche.");

});


app.get('/chokoron', function (req, res) {
    res.send("Tu envoies le tweet là ?");

});

const job = new CronJob(
    "*/4 * * * *", // cronTime
    function () {
        main();
    }, // onTick
    console.log("ça va tweeter"), // onComplete
    true, // start
);









