

import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken'
import validator from 'validator'
import createError from '../utils/createError.js'

import User from '../models/user.model.js'

export const register = async (req, res, next) => {
    /**
    **************************NOTE*******************************
    Because of how new user object is transmitted from front-end, 
    parsing the req.body gets weird
    **************************NOTE*******************************
    */ 
    
    /**
     * A. Validation
     * B. Create User
     * C. Return User and Token
     */

    // A. Validation
    // let { country, desc, email, img, isSeller, password, phone, username } = userObject
    // console.log(password)

    // if(!email || !password) {
    //     return next(createError(400, 'All fields must be completed.'))
    // }

    // if(!validator.isEmail(email)) {
    //     return next(createError(400, 'Email is not valid.'))
    // }

    // if(!validator.isStrongPassword(password, {
    //     minLength: 6,
    //     minLowercase: 0,
    //     minUppercase: 0,
    //     minNumbers: 0,
    //     minSymbols: 0,
    //     returnScore: false,
    //     pointsPerUnique: 1,
    //     pointsPerRepeat: 0.5,
    //     pointsForContainingLower: 10,
    //     pointsForContainingUpper: 10,
    //     pointsForContainingNumber: 10,
    //     pointsForContainingSymbol: 10
    // })) {
    //     return next(createError(400, 'Your password must have at least 6 characters.'))
    // }

    // const emailExists = await User.findOne({ email })
    //     if(emailExists) {
    //         return next(createError(400, 'This username or email is already in use.'))
    // }

    // const usernameExists = await User.findOne({ username })
    //     if(usernameExists) {
    //         return next(createError(400, 'This username or email is already in use.'))
    // }

    // B. Create User
    try {
        let userObject = JSON.parse(req.body.body).user    
        console.log('userObject: ')
        console.log(userObject)
        let { username, email, password, img, country, isSeller, desc, phone } = userObject
        console.log(username, email, password, img, country, isSeller, desc, phone)
        const saltRounds = 10
        const hashedPassword = bcrypt.hashSync(password, saltRounds)
        const newUser = new User({
                username,
                email,
                img,
                country,
                isSeller,
                desc,
                phone,
                password: hashedPassword,
            })

        await newUser.save()
        console.log('User created')

    // C. Return User and Token
        const token = jwt.sign(
            {
              id: newUser._id,
              isSeller: newUser.isSeller,
            },
            process.env.JWT_KEY,
            {
                expiresIn: '3d'
            }
          );

          const info = { username, email, img, country, isSeller, desc, phone }
        //   { password, ...info } = newUser._doc;
          res.status(200).json({ info, token })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const login = async (req, res, next) => {
    /**
    **************************NOTE*******************************
    Because of how user object is transmitted from front-end, 
    parsing the req.body gets weird
    **************************NOTE*******************************
    */ 
    try {
        let userInfo = JSON.parse(req.body.body)
        if(!userInfo) return next(createError(404, 'There was a problem with you login info.'))

        const user = await User.findOne({
            username: userInfo.username, 
        })
        if(!user) return next(createError(404, 'User not found.'))

        const isCorrectPassword = await bcrypt.compare(userInfo.password, user.password)
        console.log(isCorrectPassword)
        if(!isCorrectPassword) return next(createError(404, 'Wrong password or username.'))

        const token = jwt.sign(
            {
              id: user._id,
              isSeller: user.isSeller,
            },
            process.env.JWT_KEY,
            {
                expiresIn: '3d'
            }
          );
      
          const { password, ...info } = user._doc;
          console.log('User login accepted')
          res.status(200).json({ info, token })
        
    } catch (error) {
        console.log(error)
        return next(createError(401, 'There was a problem with the registration information.'))
    }
}

    // Handled on front-end
// export const logout = async (req, res) => {
//     res.clearCookie('token', {
//         sameSite: 'none',
//         secure: true,
//     })
//         .status(200)
//         .send('User has been logged out.')
// }


