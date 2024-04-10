import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken'

import User from '../models/user.model.js'

import createError from '../utils/createError.js'

export const register = async (req, res, next) => {
    try {
        const saltRounds = 10
        const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds)
        const newUser = new User({
                ...req.body,
                password: hashedPassword,
            })

        await newUser.save()
        res.status(201).send('User has been created!')

    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({
            username: req.body.username, 
        })
        if(!user) return next(createError(404, 'User not found.'))

        const isCorrectPassword = bcrypt.compare(req.body.password, user.password)
        if(!isCorrectPassword) return next(createError(404, 'Wrong password or username.'))

        const token = jwt.sign(
            {
                id: user._id,
                isSeller: user.isSeller,
            },
            process.env.JWT_KEY
        )

        const { password, ...info } = user._doc
        res.cookie('accessToken', token, {
            httpOnly: true
        }).status(200).send(info)
        
    } catch (error) {
        next(err)
    }
}

export const logout = async (req, res) => {
    res.clearCookie('accessToken', {
        sameSite: 'none',
        secure: true,
    })
        .status(200)
        .send('User has been logged out.')

}


