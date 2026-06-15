const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")
const reviewController = require("../controller/reviews.js");
// Correct model imports
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");



// CREATE REVIEW
router.post(
  "/",
  validateReview,isLoggedIn,
  wrapAsync(reviewController.createReviews)
);

// DELETE REVIEW
router.delete(
  "/:reviewId", isLoggedIn,isReviewAuthor,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove reference from listing
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    // Delete the review document
    await Review.findByIdAndDelete(reviewId);
req.flash("success"," Review Deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
