const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/relationshipDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Open!!");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  address: [
    {
      _id: { _id: false },
      city: String,
      state: String,
      country: {
        type: String,
        required: true,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);

const makeUser = async () => {
  const u = new User({
    fname: "Sachin",
    lname: "Anderson",
  });
  u.address.push({
    city: "Delhi",
    state: "Delhi",
    country: "USA",
  });

  const res = await u.save();
  console.log(res);
};

makeUser();
