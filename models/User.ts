import mongoose, { Document, Model } from 'mongoose'

// تعریف interface برای کاربر
interface IUser extends Document {
    email: string
    password: string
    name?: string
}

// تعریف schema
const userSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String }
}, { timestamps: true })

// تعریف مدل با نوع صریح
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User
