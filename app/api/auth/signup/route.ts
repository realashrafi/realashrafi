import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import { signToken } from '@/models/jwt'
import { Document, Types } from 'mongoose'

interface IUser {
    _id: Types.ObjectId
    email: string
    password: string
    name?: string
}

export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const { email, password, name } = await req.json()
        const hashedPassword = await bcrypt.hash(password, 12)

        // مشخص کردن نوع برگشتی Document<IUser>
        // @ts-ignore
        const user: Document<IUser> = await User.create({
            email,
            password: hashedPassword,
            name
        })

        const token = signToken(user._id.toString())

        return NextResponse.json({
            user: { id: user._id.toString(), email, name },
            token
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
