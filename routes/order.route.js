import express from 'express' 
import { verifyToken } from '../middleware/jwt.js'

import { confirm, getOrders, intent } from '../controllers/order.controller.js'

const router = express.Router()

// router.post('/:id', verifyToken, createOrder) - not using - use create-payment-intent instead
router.get('/', verifyToken, getOrders)
router.post('/create-payment-intent/:id', verifyToken, intent) // Use product ID f/ security so user cannot change the price
router.put('/', verifyToken, confirm) 

export default router 