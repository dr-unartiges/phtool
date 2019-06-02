var fs = require("fs");
var filename = "./results.json";
var args = require("minimist")(process.argv.slice(2));
var argsKeys = Object.keys(args);

var message = `VALID ARGUMENTS
-v [integer] number of videos
-p [integer] number of pictures
-t [string] search within profile

-and all conditions must be met
-f print those models who were filtered out
-o write a file containing the results of the search`;

class Model {
    constructor(model) {
        this.name = model.name;
        this.thumbnail = model.thumbnail;
        this.contents = model.contents;
    }

    checkNumberOfVideos(int) {
        if (this.contents.videos >= int) {
            return true;
        }
    }

    checkNumberOfImages(int) {
        if (this.contents.pictures > int) {
            return true;
        }
    }

    checkProfile(str) {
        for (var i in this.contents.profile) {
            if (
                this.contents.profile[i].match(new RegExp(str, "gi")) !== null
            ) {
                return true;
            }
        }

        return false;
    }
}

try {
    if (fs.existsSync(filename)) {
        if (argsKeys.length > 1) {
            // Get content from file
            var contents = fs.readFileSync(filename);
            // Define to JSON type
            var jsonContent = JSON.parse(contents);
            // Get Value from JSON
            //console.log(jsonContent)
            var filteredOut = [];

            var filteredContent =
                jsonContent.data.filter(model => {
                    var currentModel = new Model(model);
                    var arrayOfTrue = [];

                    argsKeys.forEach(key => {
                        switch (key) {
                            case "v":
                                arrayOfTrue.push(
                                    currentModel.checkNumberOfVideos(args.v)
                                );
                                break;

                            case "p":
                                arrayOfTrue.push(
                                    currentModel.checkNumberOfImages(args.p)
                                );
                                break;

                            case "t":
                                arrayOfTrue.push(
                                    currentModel.checkProfile(args.t)
                                );
                                break;
                        }
                    });

                    if (args.and) {
                        for (var value in arrayOfTrue) {
                            if (arrayOfTrue[value] === false) {
                                filteredOut.push(model);
                                return false;
                            }
                        }

                        return true;
                    } else {
                        for (var value in arrayOfTrue) {
                            if (arrayOfTrue[value] === true) {
                                return true;
                            }
                        }
                        filteredOut.push(model);
                        return false;
                    }
                })
            console.log(filteredContent)

            if (args.f) {
                console.log(filteredOut);
            }

            if(args.o) {
                filteredContentText = filteredContent.map(x=>x.name).join("\n")
                filteredOutText = filteredOut.map(x=>x.name).join("\n")
                fs.writeFileSync('filteredContent.txt', filteredContentText, 'utf8')
                fs.writeFileSync('filteredOut.txt', filteredOutText, 'utf8')
            }
        } else {
            console.log(message);
        }
    }
} catch (err) {
    console.error(err);
}
