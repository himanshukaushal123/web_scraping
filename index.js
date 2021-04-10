const request=require("request-promise");
//const fs=require("fs");
const cheerio=require("cheerio");
const ObjectsToCsv=require("objects-to-csv");  
const url="https://kolkata.craigslist.org/d/housing/search/hhh";
 const scrapper={
     title:'Part time job for data entry',
     descripton:"Be a part of us and earn money by doing part time job...some long text",
     datePosted: new Date('2021-03-31'),
     url:'https://kolkata.craigslist.org/wri/d/part-time-job-for-data-entry/7299635470.html',
     hood:'(Rachi)',
     adress:'rachickled',
     compensation:'No compensation here'

 };
 const scrapeResults=[];
 

    

      

async function scrapeJobHeader()
{
    

    
     try{
       
        const html=await request.get(url);
        const $= await cheerio.load(html);
        $(".result-info").each((index,element)=>{
            const resultTitle=$(element).children(".result-heading");
            const title=resultTitle.children(".result-title").text();
            const url=$(element).children(".result-heading").children(".result-title").attr("href");
            const datePosted=$(element).children(".result-date").attr("datetime");
            const hood=$(element).children(".result-meta").children(".result-hood").text();
            const scrapeResult={title,url,datePosted,hood};
            scrapeResults.push(scrapeResult);
        });
     //   console.log(scrapeResults);
        return scrapeResults;

        // const title_data:$(".result-info").each((index,element)=>{console.log($(element).children(".result-heading").children(".result-title").text())});
        //const date_data=$(".result-info").each((index,element)=>{console.log($(element).children(".result-date").text())});
        

      //  console.log(html);
     } catch(err){
         console.error(err);
     }

    
   // fs.writeFileSync("./test.html",html);
    //  const $=await(cheerio.load(html));
    //// const thetext=$("#red").text();
     //console.log(thetext);
     //$(".result-info").each((index,element)=>{console.log($(element).children(".result-heading").children(".result-title").text())});
//$(".result-info").each((index,element)=>{console.log($(element).children(".result-date").text())});
    
}
async function scrapeDescription(jobwithHeader)
{
   return await Promise.all(jobwithHeader.map(async(job)=>{
       try{
        const htmlResult=await request.get(job.url);
        const $ =await cheerio.load(htmlResult);
        $(".print-qrcode-container").remove();
      job.description=  $("#postingbody").text().trim();
      job.adress=$("div.mapaddress").text();
     const compensationText=$(".attrgroup").children().first().text();
     job.compensation=compensationText.replace("compensation:","");
     
      return job;
    }catch(error){
        console.error(error);
    }
}


    )
    );

}

async function createCsvFile(data)
{
    const csv = new ObjectsToCsv(data);
 
    // Save to file:
    await csv.toDisk('./test.csv');
   
    // Return the CSV file as string:
  
}
 async function scraperCraigsList(){
     const jobwithHeader= await scrapeJobHeader();
    const jobsFullData=await scrapeDescription(jobwithHeader);
    //console.log(jobsFullData);
    await createCsvFile(jobsFullData);
 }
scraperCraigsList();