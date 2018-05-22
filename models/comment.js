var mongoose = require("mongoose");

var commSchema = new mongoose.Schema({
    text: String,
    author:{
      id: {    //check by reference to see if author exists in User collection
        type : mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    }
  });
  
module.exports = mongoose.model('Comment', commSchema);