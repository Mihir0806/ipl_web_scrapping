//Requiring Modules
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let xlsx=require("xlsx");


function singlematchdetail(url) {

    let MatchUrl = url;

    request(MatchUrl, cb);

    function cb(err, response, html) {
        if (err) {
            console.log(err);
        }
        else if (response.statusCode == 404) {
            console.log("Page not found!!");
        }
        else {
            extractData(html);
        }
    }

    function extractData(html) {

        let $ = cheerio.load(html);
        let description = $(".event .description");
        let strarr = description.text().split(",");
        let venue = strarr[1].trim();
        let date = strarr[2].trim();
        let result = $(".event .status-text");
        console.log(description.text());

        let searchtool = cheerio.load(html);
        let BothInningArr = searchtool("div.Collapsible");
        let score = "";
        for (let i = 0; i < BothInningArr.length; i++) {
            score = searchtool(BothInningArr[i]).html();
            let teamname = searchtool(BothInningArr[i]).find("h5").text();
            teamname = teamname.split("INNINGS")[0].trim();
            let opponentidx = i == 0 ? 1 : 0;
            let opponentName = searchtool(BothInningArr[opponentidx]).find("h5").text();
            opponentName = opponentName.split("INNINGS")[0].trim();
            console.log(`${venue}| ${date}| ${teamname}| ${opponentName}| ${result} `);
            console.log("`````````````````````````````````````````````````````````");
            let players = searchtool(BothInningArr[i]).find(".table.batsman tbody tr");
            console.log(players.length);
            for (let j = 0; j < players.length; j++) {
                let td = searchtool(players[j]).find("td");
                if (td.length == 8) {
                    let playername = searchtool(td[0]).text().trim();
                    let runs = searchtool(td[2]).text().trim();
                    let balls = searchtool(td[3]).text().trim();
                    let fours = searchtool(td[5]).text().trim();
                    let sixes = searchtool(td[6]).text().trim();
                    let sr = searchtool(td[7]).text().trim();
                    console.log(`${playername} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
                    processPlayer(teamname, playername, runs, balls, fours, sixes, sr, opponentName, venue, date, result);
                }
            }
            console.log("`````````````````````````````````````````````````````````");
        }
    }
}

function dirCreator(filePath){
    if(fs.existsSync(filePath)==false ){
        fs.mkdirSync(filePath);
    }
}

function excelWriter(filePath, json, sheetName){
    let newWB=xlsx.utils.book_new();
    let newWS=xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB,filePath);
}

function excelReader(filePath,sheetName){
    if(fs.existsSync(filePath)==false){
        return [];
    }
    let wb=xlsx.readFile(filePath);
    let excelData=wb.Sheets[sheetName];
    let ans= xlsx.utils.sheet_to_json(excelData);
    return ans;
}

function processPlayer(teamname, playername, runs, balls, fours, sixes, sr, opponentName, venue, date, result){
    let teamPath=path.join(__dirname,"ipl",teamname);
    dirCreator(teamPath);
    let filePath=path.join(teamPath,playername+".xlsx");
    let content=excelReader(filePath,playername);
    let playerObj={
        teamname,
        playername,
        runs,
        balls,
        fours,
        sixes,
        sr,
        opponentName,
        venue,
        date,
        result
    }
    content.push(playerObj);
    excelWriter(filePath, content, playername);
}



module.exports = {
    singlescore: singlematchdetail
}