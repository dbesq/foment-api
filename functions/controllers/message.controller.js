import Conversation from '../../models/conversation.model.js'
import Message from '../../models/message.model.js'
import createError from "../../utils/createError.js"

export const createMessage = async (req, res, next) => {
    const newMessage = new Message({
        conversationId: req.body.conversationId,
        userId: req.userId,
        description: req.body.description
    })

    try {
        const savedMessage = await newMessage.save()
        await Conversation.findOneAndUpdate(
            { id: req.body.conversationId },
            { $set: {
                readBySeller: req.isSeller,
                readByBuyer: !req.isSeller,
                lastMessage: req.body.description
                }
            },
            { new: true }
        ),

        res.status(201).send(savedMessage)
    } catch (error) {
        next(error)
    }
}


export const getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({ conversationId: req.params.id })
        
        if(!messages) return next(createError(403, 'Messages not found.'))
        res.status(200).send(messages)
    } catch (error) {
        next(error)
    }
}