
//Requiring Modules
let singleobj=require("./Scorecard");
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");

let iplPath=path.join(__dirname,"ipl");
dirCreator(iplPath);
let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";

//Requesting on url to get html data
request(url,cb);
//Callback:
function cb(err, response, html){
    if(err){
        console.log(err);
    }
    else if(response.statusCode == 404){
        console.log("Page not found!!");
    }
    else{
        extractData(html);
    }
}

//Function to extract scorecard page link
function extractData(html){
    let searchtool=cheerio.load(html);

    let part = searchtool('a[data-hover="View All Results"]');
    let SourceLink=part.attr("href");
    let FullLink=`https://www.espncricinfo.com${SourceLink}`;
    console.log(FullLink);

    //Now requesting on FullLink to obtain scorecard link array
    request(FullLink,AllScoreCardcb);
}

function AllScoreCardcb(err, response, html){
    if(err){
        console.log(err);
    }
    else if(response.statusCode == 404){
        console.log("Page not found!!");
    }
    else{
        GetScoreCardLink(html);
    }
}

function GetScoreCardLink(html){
    let searchtool = cheerio.load(html);
    let Linkarr = searchtool('a[data-hover="Scorecard"]');
    //Iterating to create full links
    for(let i=0;i<Linkarr.length;i++){
        let link=searchtool(Linkarr[i]).attr("href");
        let fulllink=`https://www.espncricinfo.com${link}`;
        console.log(fulllink);
        singleobj.singlescore(fulllink);
    }
}

function dirCreator(filePath){
    if(fs.existsSync(filePath)==false ){
        fs.mkdirSync(filePath);
    }
}