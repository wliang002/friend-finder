const friendsData = require("../data/friends");
const uuidv4      = require('uuid/v4');

module.exports = (app) => {
    app.get("/api/friends", (req, res)=>{
      res.json(friendsData);  
    });

    app.post("/api/friends", (req, res) => {
        let imageName = req.body.name.toLowerCase()
        imageName = imageName.replace(/\s/g, '');
        
        let newFriend = {
            name: req.body.name,
            scores: req.body.scores.split(","),
            image: imageName + uuidv4()
        } 
    
        let bestMatch = null;

        if(friendsData.length > 0) {
            let lowestDiff = 1000; // abritrary large number

            for(let i = 0; i < friendsData.length;i++){
                let currentFriend = friendsData[i];
                let currentFriendScores = friendsData[i].scores;
                let currentDiff = 0;

                for(var j = 0; j < currentFriendScores.length; j++){
                    var scoreA = parseInt(currentFriendScores[j]);

                    var scoreB = parseInt(newFriend.scores[j]);
             
                    currentDiff = parseInt(currentDiff) + Math.abs(scoreA-scoreB);
                }
    
                if(parseInt(currentDiff) < lowestDiff){
                    lowestDiff = currentDiff;
                    bestMatch = currentFriend;
                }
            }
        }
       
        uploadImage(req, newFriend.image);

        friendsData.push(newFriend);

        res.json(bestMatch);
    });
}

uploadImage = (req, image) => {
    // from form data
    let imageFile = req.files.file;
    // create path to the file
    let filePath = `${__dirname}/../public/assets/img/uploads/${image}.jpg`
    // moving to the path
    imageFile.mv(filePath, (err) => {
        if (err) console.log(err);
    });
}