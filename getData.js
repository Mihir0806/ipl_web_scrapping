
function matchData(url) {
    let request = require("request");
    let cheerio = require("cheerio");
    let fs = require("fs");
    let path = require("path");

    let MatchUrl = url;

    request(MatchUrl, callb);

    function callb(err,response,html){
        if (err) {
            console.log(err);
        }
        else if (response.statusCode == 404) {
            console.log("Page not found!!");
        }
        else {
            getMatchData(html);
        }
    }

    function getMatchData(html){
        let $=cheerio.load(html);
        let description=$(".event .description");
        let strarr=description.text().split(",");
        let venue=strarr[1].trim();
        let date=strarr[2].trim();
        let result=$(".event .status-text");
        console.log(description.text());
        console.log(result.text());

    }
}
