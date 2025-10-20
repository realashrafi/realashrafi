import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

export default mongoose.models.Note || mongoose.model('Note', noteSchema)