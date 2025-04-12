const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing, notOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");


router
    .route("/")
    .get(wrapAsync(listingController.index))//index route
    .post(isLoggedIn, upload.array('listing[images]', 5),validateListing, wrapAsync(listingController.createListing));
    //validateListing before wrapAsync in post req
    //Create Route
 

//New Route
 router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));

//Search Route
router.get("/search",wrapAsync(listingController.searchDest));

//category route
router.get("/grp/:grp",wrapAsync(listingController.dispCategory));

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing)) // Show Route
    .put(isLoggedIn, isOwner, upload.array('listing[images]'),(req, res, next) => {
        // For updates, set isNew to false
        const { error } = listingSchema.validate(req.body, { context: { isNew: false } });
        if (error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            req.flash("error", errMsg);
            return res.redirect(`/listings/${req.params.id}/edit`);
        }
        next();
    },wrapAsync(listingController.updateListing)) // Update Route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));//Delete Route 
    //validateListing before wrapAsync in put req


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//Reserve Route
router.post("/:id/reserve",isLoggedIn,notOwner,wrapAsync(listingController.sendReservMail));

module.exports = router;