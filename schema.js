const Joi = require('joi');

//dont use listingSchema till everyThing else is sorted
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().min(1).required(), // Updated to enforce minimum price of 1
        images: Joi.array().items(
            Joi.object({
                url: Joi.string().uri().required(),
                filename: Joi.string().required()
            })
        ).min(1)
        // If context.isNew is true then images is required; otherwise, it's optional
         .when('$isNew', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
        geometry: Joi.object({ 
            type: Joi.string().valid('Point').required(),
            coordinates: Joi.array().items(
                Joi.number().required()
            ).length(2).required() 
        }).optional(),
        category: Joi.string().valid(
            "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools",
            "Camping", "Farms", "Arctic", "Domes", "Boats", "Play", "Beach", "Other"
        ).required(),
    }).required(),
    deleteImages: Joi.array().items(Joi.string())
});

 
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
}) 