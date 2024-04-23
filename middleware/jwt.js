import jwt from 'jsonwebtoken' 
import createError from '../utils/createError.js'

export const verifyToken = async (req, res, next) => {
    // A. Verify authentication from req.headers
    const { authorization } = req.headers
    console.log(authorization)
    if(!authorization) return res.status(401).json({ error: 'You are not authenticated.' })

    // B. Get token from req.header - second part of 'Bearer <token>' string
    const token = authorization.split(' ')[1]
    console.log(token)

    // C. Verify token
    try {
        // i. Get payload from token
        const { id, isSeller } = jwt.verify(token, process.env.JWT_KEY)
        // ii. Add properties to req that are passed to controllers thru next() 
        req.userId = id
        req.isSeller = isSeller
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'Request is not authorized.' })
    } 
}



