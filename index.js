var cheerio = require("cheerio");
var axios = require("axios");
var fs = require("fs");
var settings = require("./settings")

function urlGenerator(config, page){

    let {username, city, gender, verified,videos, orientation, relation, country, o, age1, age2} = config

    return `https://www.pornhub.com/user/search?username=${username}&videos=${videos}&verified=${verified}&city=${city}&gender=${gender}&orientation=${orientation}&relation=${relation}&country=${country}&o=${o}&age1=${age1}&age2=${age2}&page=${page}`
}


(async function(){

    //var limit = 10
    var i = 1;

    var members = []
    var hasReachedEnd = false

    while(hasReachedEnd === false){
        var currentURL = urlGenerator(settings, i)

        await axios.get(currentURL).then(response => {
            
            
            let $loop = cheerio.load(response.data);

            console.clear()
            console.log(currentURL)

            var memberSelector = "#advanceSearchResultsWrapper > ul >li"

            $loop(memberSelector).each(function(i, elm) {
                members.push({
                    name: $loop(this).text().replace(/[\n\t]/g, ""),
                    thumbnail: $loop(this).find("img").attr("src")
                })
            });
            
        }).catch(error=>{
            hasReachedEnd = true
        })

        i++
    }

    return members
})()
.then(async models => {
    var startTime = new Date()
    var selectors = ["#profileInformation", ".contentContainer.about", ".bottomDescription.bio"]

    for(var index in models){
        var currentURL = `https://www.pornhub.com/model/${models[index].name}`
        await axios.get(currentURL).then(response => {
            let $loop = cheerio.load(response.data);

            var contents = {
                profile: []
            }

            for(var selector in selectors){
                /*
                if($loop(selectors[selector])[0] !== undefined) {
                    contents.push(selectors[selector][0].outerHTML)
                }*/
                
                contents.profile.push($loop(selectors[selector]).text())
            }
            try {
                contents.videos = Number($loop("#profileVideos > div > div.sectionTitle > a.white").text().match(/\d+/)[0])
            } catch (error){
                console.log("Error", models[index].name)
                contents.videos = 0
            }

            try {
                contents.pictures = Number($loop("div.contentContainer.photos > header > h3 > a").text().match(/\d+/)[0])
                
            } catch (error){
                console.log("Error", models[index].name)
                contents.pictures = 0
            }

            var currentTime = new Date() - startTime

            models[index].contents = contents

            console.clear()
            console.log(`Current model: ${models[index].name} | Time since starting this script: ${(currentTime/1000).toFixed(1)}s`)
        })
    }

    var json = JSON.stringify({data: models});
    fs.writeFile('results.json', json, 'utf8')

    console.log("\nDone")
    //return models
})
.catch(error => {
    console.log(error)
})