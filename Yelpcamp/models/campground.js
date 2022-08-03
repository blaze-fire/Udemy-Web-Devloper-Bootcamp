const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews')
const User = require('./user')
const CampGroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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