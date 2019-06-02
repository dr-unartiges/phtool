Phtool - a small tool to make more refined searches on PornHub when looking for amateur models.

# Install dependencies

Just run:

    npm install
    

# Searching for amateur PornHub models

You will need to edit the `settings.js` file before doing anything else. Then, just execute:

    npm start
This will create a `results.json` file. You now will need to run:

    node readResults.json [arguments...]
The `readResults.js` file needs at least one of the following parameters:
* -v [integer] (minimum number of videos)
* -p [integer] (minimum number of pictures)
* -t [string] (search text within profile)

You can also provide any of these additional parameters:
* -and (all conditions must be met)
* -f (print those models who were filtered out)
* -o (write a file containing the results of the search)

### Example

    node readResults.js -t chicago -v 4 -p 3 -and -o