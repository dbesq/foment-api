import Order from '../models/order.model.js'
import Project from '../models/project.model.js'
import createError from '../utils/createError.js'
import Stripe from 'stripe' 

export const confirm = async (req, res, next) => {    
    try {
        const order = await Order.findOneAndUpdate(
            { payment_intent: req.body.payment_intent },
            { $set: {
                isCompleted: true
            }}            
        )

        res.status(200).send('Order has been confirmed')
    } catch (error) {
        next(error)
    }
} 

export const getOrders = async (req, res, next) => {    
    try {
        const orders = await Order.find({
            // Get orders based on whether request is made by buyer or the seller
            ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
        })

        res.status(200).send(orders)
    } catch (error) {
        next(error)
    }
} 

export const intent = async (req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const project = await Project.findById(req.params.id)
    if(!project) return next(createError(403, 'Project not found.'))

    const paymentIntent = await stripe.paymentIntents.create({
        amount: project.price * 100,
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true,
        }
    })

    const  newOrder = new Order({
        projectId: project._id,
        img: project.coverImg,
        title: project.title,
        price: project.price,
        sellerId: project.userId,
        buyerId: req.userId,
        payment_intent: paymentIntent.id
    })

    await newOrder.save()

    res.status(200).send({
        clientSecret: paymentIntent.client_secret,
    })

}