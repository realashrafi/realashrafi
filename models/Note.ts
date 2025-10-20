import mongoose, { Document, Model } from 'mongoose'

// Interface برای Note
interface INote extends Document {
    title: string
    content: any
    userId: mongoose.Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

// تعریف schema
const noteSchema = new mongoose.Schema<INote>({
    title: { type: String, required: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

// تعریف مدل با نوع صریح
const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', noteSchema)

export default Note
