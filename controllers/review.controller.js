import Project from '../models/project.model.js'
import Review from '../models/review.model.js'
import createError from '../utils/createError.js'


export const createReview = async (req, res, next) => {
    if(req.isSeller) return next(createError(403, 'Sellers cannot create reviews'))

    const newReview = new Review({
        projectId: req.body.projectId,
        userId: req.userId,
        star: req.body.star,
        description: req.body.description,
    })
    
    try {
        // Check if user already left a review for the project
        const review = await Review.findOne({ projectId: req.body.projectId, userId: req.userId }) 
        if(review) return next(createError(403, 'You have already created a review.'))

        // Create and save Review and update Project
        const savedReview = await newReview.save()
        await Project.findByIdAndUpdate(req.body.projectId, {
            $inc: { totalStars: req.body.star, starNumber: 1 }
        })
        res.status(201).send('Review saved.')

    } catch (error) {
        next(error)
    }
}

export const deleteReview = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
}

export const getReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ projectId: req.params.projectId }) 
        res.status(200).send(reviews)

    } catch (error) {
        next(error)
    }
}