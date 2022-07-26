const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose
  .connect("mongodb://localhost:27017/farmDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Open!!");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = new Schema({
  username: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

const tweetSchema = new Schema({
  tweet: String,
  likes: Number,
  userId: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Tweet = mongoose.model("Tweet", tweetSchema);

// const makeTweets = async () => {
//   //   const user = new User({
//   //     username: "bajrang",
//   //     age: 21,
//   //   });

//   const user = await User.findOne({ username: "bajrang" });

//   const tweet2 = new Tweet({
//     tweet: "shava shava",
//     likes: 10000,
//   });
//   tweet2.userId = user;
//   tweet2.save();
// };

const findTweet = async () => {
  const t = await Tweet.find({}).populate('userId');
  console.log(t);
};

findTweet();
