import express from 'express' 
import { verifyToken } from '../middleware/jwt.js'
import { createProject, deleteProject, getProject, getProjects } from '../controllers/project.controller.js'

const router = express.Router()

router.post('/', verifyToken, createProject)
router.delete('/:id', verifyToken, deleteProject)
router.get('/single/:id', getProject)
router.get('/', getProjects)

export default router