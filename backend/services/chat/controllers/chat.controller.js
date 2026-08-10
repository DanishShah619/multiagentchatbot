import Conversation from "../models/coversation.model.js"
import Message from "../models/message.model.js"

export const createConversation=async (req,res) => {
  try {
    const userId=req.headers["x-user-id"]
    const conversation=await Conversation.create({
        userId:userId
    })

    return res.status(200).json(conversation)
  } catch (error) {
     console.error("[chat/createConversation]", error)
     return res.status(500).json({message:"Internal server error"})
  }
}

export const getConversations=async (req,res) => {
  try {
    const userId=req.headers["x-user-id"]
    const conversations=await Conversation.find({
        userId:userId
    }).sort({updatedAt:-1})

    return res.status(200).json(conversations)
  } catch (error) {
     console.error("[chat/getConversations]", error)
     return res.status(500).json({message:"Internal server error"})
  }
}

export const updateConversation=async (req,res) => {
  try {
    const userId=req.headers["x-user-id"]
    const {id,title}=req.body

    if (!id || !title) {
        return res.status(400).json({ message: "Conversation id and title are required" })
    }

    // OPT-10: Single-query atomic update matching both _id and userId
    const conversation=await Conversation.findOneAndUpdate(
        { _id: id, userId: userId },
        { title },
        { new: true }
    )

    if (!conversation) {
        const exists = await Conversation.exists({ _id: id })
        return res.status(exists ? 403 : 404).json({
            message: exists ? "Forbidden: You do not own this conversation" : "Conversation not found"
        })
    }

    return res.status(200).json(conversation)
  } catch (error) {
     console.error("[chat/updateConversation]", error)
     return res.status(500).json({message:"Internal server error"})
  }
}

export const deleteConversation=async (req,res) => {
  try {
    const userId=req.headers["x-user-id"]
    const {id}=req.params

    const conversation=await Conversation.findOneAndDelete({ _id: id, userId: userId })

    if (!conversation) {
        const exists = await Conversation.exists({ _id: id })
        return res.status(exists ? 403 : 404).json({
            message: exists ? "Forbidden: You do not own this conversation" : "Conversation not found"
        })
    }

    // Cascade delete associated messages
    await Message.deleteMany({ conversationId: id })

    return res.status(200).json({ message: "Conversation deleted successfully" })
  } catch (error) {
     console.error("[chat/deleteConversation]", error)
     return res.status(500).json({message:"Internal server error"})
  }
}

export const saveMessage=async (req,res) => {
    try {
        const userId=req.headers["x-user-id"]
        const {conversationId,role,content,images,artifacts}=req.body

        // OPT-10: Ensure conversation exists and belongs to requesting user
        const conversation=await Conversation.findOne({ _id: conversationId, userId: userId })
        if(!conversation){
            const exists = await Conversation.exists({ _id: conversationId })
            return res.status(exists ? 403 : 404).json({
                message: exists ? "Forbidden: You do not own this conversation" : "Conversation not found"
            })
        }

        const message=await Message.create({
            conversationId,
            content,
            role,
            images,
            artifacts
        })
        return res.status(200).json(message)
    } catch (error) {
        console.error("[chat/saveMessage]", error)
        return res.status(500).json({message:"Internal server error"})
    }
}

export const getMessages=async (req,res) => {
    try {
        const userId=req.headers["x-user-id"]
        const {conversationId}=req.params

        const page = Math.max(1, parseInt(req.query.page) || 1)
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50))
        const skip = (page - 1) * limit

        // OPT-10: Ensure conversation exists and belongs to requesting user
        const conversation=await Conversation.findOne({ _id: conversationId, userId: userId })
        if(!conversation){
            const exists = await Conversation.exists({ _id: conversationId })
            return res.status(exists ? 403 : 404).json({
                message: exists ? "Forbidden: You do not own this conversation" : "Conversation not found"
            })
        }

        const messages=await Message.find({conversationId})
            .sort({createdAt: 1})
            .skip(skip)
            .limit(limit)

        if (req.query.page || req.query.limit) {
            const total = await Message.countDocuments({conversationId})
            return res.status(200).json({
                messages,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            })
        }

        return res.status(200).json(messages)
    } catch (error) {
        console.error("[chat/getMessages]", error)
        return res.status(500).json({message:"Internal server error"})
    }
}


