const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReviews = async (req, res) => {
    console.log("Listing ID:", req.params.id);

    const listing = await Listing.findById(req.params.id);

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);
  };


  module.exports.deleteReviews = async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove reference from listing
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    // Delete the review document
    await Review.findByIdAndDelete(reviewId);
req.flash("success"," Review Deleted");
    res.redirect(`/listings/${id}`);
  };