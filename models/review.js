
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewschema = new Schema({
  comment: String ,
  ratings:{
type: Number,
min:1,
max:5
  },
  createdAt:{
    type: Date,
    default:Date.now()

  },
  author: {
      type: mongoose.Schema.Types.ObjectId,
       ref:"User",
    },
    
});

const review= mongoose.model("review", reviewschema);
module.exports = review;