const Listing = require("../models/listing");
const axios = require('axios');
const { cloudinary } = require("../cloudConfig"); // Import cloudinary instance
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');   //if mapbox was used
// const geocodingClient = mbxGeocoding({accessToken: mapToken}); 
const nodemailer = require("nodemailer");  
 

const mapToken = process.env.MAP_TOKEN;


module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}


module.exports.renderNewForm = async (req, res) => {
    await res.render("listings/new.ejs"); // Adding `await` ensures no code runs further
};


module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" }
      })
      .populate("owner");
  
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
  
    console.log("listing.owner:", listing.owner); // now safe, since listing exists
  
    res.render("listings/show.ejs", { listing });
  };
  


// module.exports.createListing = async (req,res,next)=>{

// let response = await geocodingClient.forwardGeocode({    if mapbox was used
    //     query:'New Delhi,India',
    //     limit:1
    // })
    // .send();

    // console.log(response);
    // res.send("done!");

//     query = req.body.listing.location;
//     let mapUrl = `https://api.maptiler.com/geocoding/${query}.json?key=hR6JsM4W3VZHX9uuRQ4V`
//     console.log(mapUrl);
//     let geoCord;

//     async function getGeoCord(){
//         try{
//             response = await axios.get(mapUrl);
//             geoCord=response.data.features[0].geometry;
//         }catch(e){
//             console.log("err :",e);
//         }
//         console.log(geoCord)
//     }
//     const newListing = new Listing(req.body.listing);

//     getGeoCord().then(()=>{
//     let url = req.file.path;
//     let filename = req.file.filename;
    
//     newListing.owner = req.user._id;
//     newListing.images[0] = {url, filename}; //temp
//     newListing.geometry = geoCord;
//     console.log(newListing);
//     let savedListing = newListing.save();
//         console.log(savedListing);
//         req.flash("success", "New Listing Created!");
//         res.redirect("/listings");

//     }).catch((err)=>{
//         console.log(err);
//     })  
    
    
// }

module.exports.createListing = async (req, res, next) => {

    // let response = await geocodingClient.forwardGeocode({    if mapbox was used
    //     query:'New Delhi,India',
    //     limit:1
    // })
    // .send();

    // console.log(response);
    // res.send("done!");
    
    const query = req.body.listing.location;
    const mapUrl = `https://api.maptiler.com/geocoding/${query}.json?key=hR6JsM4W3VZHX9uuRQ4V`;

    let geoCord;
    try {
        const response = await axios.get(mapUrl);
        geoCord = response.data.features[0].geometry;
    } catch (e) {
        console.log("Error fetching geolocation:", e);
        return next(e);
    }

    try {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.geometry = geoCord;

        // Handle multiple image uploads
        if (req.files && req.files.length > 0) {
            newListing.images = req.files.map(file => ({
                url: file.path,
                filename: file.filename
            }));
        }

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (err) {
        console.log("Error saving listing:", err);
        next(err);
    }
};



module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
};



// module.exports.updateListing = async(req,res)=>{
    
//     let {id} = req.params;
//     let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

//     if(typeof req.file !=="undefined"){
//     let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = {url, filename};
//     await listing.save();
//     }
    
//     req.flash("success", "Listing Updated!");
//     res.redirect(`/listings/${id}`);
// }

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // Deleting images logic
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename); // Delete from Cloudinary
        }
        listing.images = listing.images.filter(img => !req.body.deleteImages.includes(img.filename));
    }

    // Adding new images logic
    if (req.files && req.files.length) {
        const newImages = req.files.map(file => ({ url: file.path, filename: file.filename }));
        listing.images.push(...newImages);
    }
    
    // Ensure at least one image remains
    if (listing.images.length === 0) {
        req.flash("error", "You must have at least one image in the listing.");
        return res.redirect(`/listings/${id}/edit`);
    }
    
    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};




module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}

module.exports.dispCategory = async(req,res)=>{
    let param = req.params;
    const grpListings = await Listing.find({category:(param.grp)});
    res.render("listings/category.ejs",{grpListings,param});
}

module.exports.sendReservMail = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate("owner");
        if (!listing || !listing.owner) {
            req.flash("error", "Listing not found or owner information is missing.");
            return res.redirect("/listings");
        }

        const { name, email, checkin, checkout, guests } = req.body.reservation;
        
        if (!name || !email || !checkin || !checkout || !guests) {
            req.flash("error", "All fields are required for reservation.");
            return res.redirect(`/listings/${req.params.id}`);
        }
        
        // Create a transporter for sending email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS  // Your email password or App password
            }
        });

        const mailOptions = {
            from: email,
            to: listing.owner.email,
            subject: `Reservation Request for ${listing.title}`,
            html: `
                <p>Hello,</p>
                <p>You have a new reservation request from <b>${name}</b>.</p>
                <ul>
                    <li><b>Check-in:</b> ${checkin}</li>
                    <li><b>Check-out:</b> ${checkout}</li>
                    <li><b>Guests:</b> ${guests}</li>
                </ul>
                <p>Contact them at: <a href="mailto:${email}">${email}</a></p>
            `,
        };
        
        try {
            await transporter.sendMail(mailOptions);
            req.flash("success", "Reservation request sent successfully! You will get a response shortly");
        } catch (error) {
            console.error("Email Error:", error);
            req.flash("error", "Could not send reservation request. Please try again later.");
            return res.redirect(`/listings/${req.params.id}`);  // Return here to prevent further execution
        }
        
        res.redirect(`/listings/${req.params.id}`);
        
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not send reservation request.");
        res.redirect(`/listings/${req.params.id}`);
    }
}

module.exports.searchDest = async (req, res) => {
        const { destName } = req.query;

        if (!destName) {
            req.flash("error", "Please enter a search term.");
            return res.redirect("/listings");
        }

        // Case-insensitive search for listings with matching location or country
        const grpListings = await Listing.find({
            $or: [
                { location: { $regex: destName, $options: "i" } },
                { country: { $regex: destName, $options: "i" } }
            ]
        });

        res.render("listings/search.ejs", { grpListings });
};
