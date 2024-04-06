// Database
import express from 'express' 
import mongoose from 'mongoose'

// External imports
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import serverless from 'serverless-http'

// Import routes
import authRoute from './routes/auth.route.js'
import conversationRoute from './routes/conversation.route.js'
import messageRoute from './routes/message.route.js'
import orderRoute from './routes/order.route.js'
import projectRoute from './routes/project.route.js'
import reviewRoute from './routes/review.route.js'
import userRoute from './routes/user.route.js'

const app = express()

dotenv.config()

// Connect to DB
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO) 
        console.log('Connected to MongoDB')
    } catch (error) {
        console.log(error)
    }
}

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/.netlify/functions/api/auth', authRoute)
app.use('/.netlify/functions/api/conversations', conversationRoute)
app.use('/.netlify/functions/api/messages', messageRoute)
app.use('/.netlify/functions/api/orders', orderRoute)
app.use('/.netlify/functions/api/projects', projectRoute)
app.use('/.netlify/functions/api/reviews', reviewRoute)
app.use('/.netlify/functions/api/users', userRoute)

// Error handling middleware
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || 'Something went wrong.'

    res.status(errorStatus).send(errorMessage)
})

// app.listen(8800, () => {
//     connect()
//     console.log('Backend server is running!!')
// })

module.exports.handler = serverless(app)

