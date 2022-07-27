const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews')
const CampGroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

CampGroundSchema.post('findOneAndDelete', async (campground) => {
    if (campground.reviews.length) {
        console.log('POST MIDDLEWARE!');
        const res = await Review.deleteMany({ _id: { $in: campground.reviews } });
        console.log(res);
    }
})

module.exports = mongoose.model('Campground', CampGroundSchema);