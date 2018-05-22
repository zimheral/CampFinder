var User = require("./models/user");
var Campsite = require("./models/campsites");
var Comment = require("./models/comment");

//getting data from json file
var fs = require('fs');
var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

var userSeed = data.userSeed;
var campSeed = data.campSeed;
var commentSeed = data.commentSeed;

function generateData(){

    //Removing previous saved data from database
    User.remove({}).then(
        ()=>Campsite.remove({}).then(
            ()=> Comment.remove({}).then(
                //adding users and campsites data
                ()=>addUserData().then
                //adding comments
                (addCommentData)
            )
        )
    );     
}

function addUserData(){

    return new Promise(function(resolve,reject){

        var count = 0;
        userSeed.forEach(function(user){

            var userName = new User({ username: user.username });            
           
            User.register(userName,  user.password).then(u=>{
                console.log("New user generated correctly");

                //add campsites data
                addCampData(count,u);
                
                count++;
                if(count==userSeed.length){
                    resolve();
                }
            }).catch(err=>{
                console.log("Problem generating user"+err);
            });
        });       
    });
}

function addCommentData(){

    commentSeed.forEach(function(comment){
            
        User.findOne({"username":userSeed[getRand(campSeed.length)].username}).then(user => {                                          
            
            var commentData = {
                text: comment,
                author: { "id": user._id, "username":user.username }
            };
            
            Comment.create(commentData).then(comment => {                   

                if (!comment) {
                    console.log("Error generating new comment");
                    return;
                }else{
                    Campsite.findOne({name:campSeed[getRand(campSeed.length)].name}).then(camp => {

                        if(camp==null) return;
                        camp.comments.push(comment);
                        camp.save();
                        console.log("Comment generated correctly");
                    });
                }
            });
        });
    });    
}

function addCampData(count,user){
    Campsite.create(campSeed[count],function(err, campsite) {
        if (err){
            console.log("Error generating new campsite");
        }else{            
            campsite.author = {"id":user._id,"username":user.username};
            campsite.save();
            console.log("Camp generated correctly");
        };
    });
}

function getRand(max){
    return Math.floor(Math.random()*max);
}

module.exports = generateData;