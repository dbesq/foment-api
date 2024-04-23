import express from 'express' 

// import { login, logout, register } from '../controllers/auth.controller.js'
import { login, register } from '../controllers/auth.controller.js'   // Logout handled on front-end

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
// router.post('/logout', logout) // Handled on front-end

export default router 