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

const productSchema = new Schema({
  name: String,
  price: Number,
  season: {
    type: String,
    enum: ["Spring", "Summer", "Winter", "Monsoon"],
  },
});

const Product = mongoose.model("Product", productSchema);

// Product.insertMany([
//   { name: "lemon", price: 20, season: "Summer" },
//   { name: "mangoes", price: 100, season: "Monsoon" },
//   { name: "potato", price: 30, season: "Winter" },
// ]);

const farmSchema = new Schema({
  name: String,
  city: String,
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

const Farm = mongoose.model("Farm", farmSchema);

// const makeFarm = async () => {
//   const farm = new Farm({ name: "Meri jameen", city: "Ghaziabad" });
//   const lemon = await Product.findOne({ name: "lemon" });
//   farm.products.push(lemon);
//   await farm.save();
//   console.log(farm);
// };

// makeFarm();

const addProduct = async () => {
  const farm = await Farm.findOne({ name: "Meri jameen" });
  const prod = await Product.findOne({ name: "potato" });
  farm.products.push(prod);
  await farm.save();
  console.log(farm);
};

Farm.findOne({ name: "Meri jameen" })
.populate('products')
.then((farm) => console.log(farm));
