const request = require("request-promise");
//const fs=require("fs");
const cheerio = require("cheerio");
const ObjectsToCsv = require("objects-to-csv");
const url = "https://www.amazon.in/s?i=apparel&bbn=1968024031&rh=n%3A1571271031%2Cn%3A1968024031%2Cn%3A1968093031%2Cp_36%3A-49900&s=apparels&dc&hidden-keywords=-sunglass+-belt+-accessories&pf_rd_i=1968024031&pf_rd_i=1968024031&pf_rd_i=1968024031&pf_rd_i=1968024031&pf_rd_i=6648217031&pf_rd_i=7459781031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=08b03935-0704-4bbd-9894-f9c043ef766b&pf_rd_p=2a6463b7-5f6e-4760-a2ef-50ba07f05487&pf_rd_p=d1296c40-0c5d-4bcf-94ba-c79cee0d37c9&pf_rd_p=df8cd163-2506-4333-a8ff-40f6e886cf65&pf_rd_p=e4d9333c-4d0a-4870-8fd9-060e6785470a&pf_rd_p=ebc29f59-fa94-48cd-a131-2d3d4b75d512&pf_rd_r=6YXAMFJD4JPDGFJ0P7VJ&pf_rd_r=AHQ01GYPQKZZKDQQM82V&pf_rd_r=D0J3ZV3ZRJXV5N1GR308&pf_rd_r=DA24QN331BRBBVBSS527&pf_rd_r=GXW1BKQHV280M0F47VDM&pf_rd_r=RZ0GD4MP8KWWG9WD1AQC&pf_rd_s=merchandised-search-17&pf_rd_s=merchandised-search-17&pf_rd_s=merchandised-search-5&pf_rd_s=merchandised-search-6&pf_rd_s=merchandised-search-6&pf_rd_s=merchandised-search-6&qid=1602339265&rnid=1968024031&ref=sr_nr_n_2";
const scrapper = {
    title: 'Part time job for data entry',
    descripton: "Be a part of us and earn money by doing part time job...some long text",
    datePosted: new Date('2021-03-31'),
    url: 'https://kolkata.craigslist.org/wri/d/part-time-job-for-data-entry/7299635470.html',
    hood: '(Rachi)',
    adress: 'rachickled',
    compensation: 'No compensation here'

};
const scrapeResults = [];
const list = {};






async function scrapeJobHeader() {



    try {

        const html = await request.get(url);
        const $ = await cheerio.load(html);
        if ($(".sg-col-4-of-12")) {
            $(".sg-col-4-of-12").each((index, element) => {
                const Title = $(element).find(".a-text-normal").text();/*children(".result-heading").children(".result-title")*/
                const price = $(element).find(".a-price-whole").text();
                const url=$(element).find(".a-link-normal ").attr("href");
                const scrapeResult = { Title, price,url};
                scrapeResults.push(scrapeResult);
            });
        }
        if ($(".sg-col-0-of-12")) {
            $(".sg-col-0-of-12").each((index, element) => {
                const Title = $(element).find(".a-text-normal").text();/*children(".result-heading").children(".result-title")*/
                const price = $(element).find(".a-price-whole").text();
                const url=$(element).find(".a-link-normal ").attr("href");
                const scrapeResult = { Title, price,url};
                scrapeResults.push(scrapeResult);
            })
        }
        console.log(scrapeResults);
        return scrapeResults;

    } catch (err) {
        console.error(err);
    }

}

async function scrapeDescription(jobwithHeader) {
    return await Promise.all(jobwithHeader.map(async (job) => {
        try {
            const htmlResult = await request.get(job.url);
            const $ = await cheerio.load(htmlResult);
         $("#detailBulletsWrapper_feature_div").find(".detail-bullet-list").each(() => {
            list.push(this.text());
         });
         job.descripton=list;
            return job;
        } catch (error) {
            console.error(error);
        }
    }


    )
    );

}

async function createCsvFile(data) {
    const csv = new ObjectsToCsv(data);

    // Save to file:
    await csv.toDisk('./testAmazon.csv');

    // Return the CSV file as string:

}
async function scraperCraigsList() {
    const jobwithHeader = await scrapeJobHeader();
    const jobsFullData = await scrapeDescription(jobwithHeader);
    console.log(jobsFullData);
    await createCsvFile(jobsFullData);
    // await createCsvFile(jobwithHeader);
}
scraperCraigsList();