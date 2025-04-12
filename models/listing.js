const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
 
const listingSchema = new Schema({
    title:{
        type:String,
        required:true    
    },
    description:{
        type:String,
        required:true
    },
    images: [
        {
          url: String,
          filename: String
        }
      ],
    price: {
        type: Number,
        required: true,
        min: 1
    },
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
 
    category: { 
        type:String,
        enum: ["Rooms","Iconic Cities","Mountains","Castles","Amazing Pools","Camping","Farms","Arctic","Domes","Boats","Play","Beach","Other"],
        required:true
    },

});


const { cloudinary } = require("../cloudConfig"); // Import cloudinary instance

listingSchema.post("findOneAndDelete", async (listing) => {
    try {
        if (listing) {
            // Delete associated images from Cloudinary
            if (listing.images && listing.images.length) {
                for (let img of listing.images) {
                    await cloudinary.uploader.destroy(img.filename);
                }
            }

            // Delete associated reviews
            await Review.deleteMany({ _id: { $in: listing.reviews } });

            console.log("Listing and associated data deleted successfully.");
        }
    } catch (error) {
        console.error("Error deleting listing:", error);
    }
});

  

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;