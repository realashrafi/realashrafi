import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import {signToken} from "@/models/jwt";


export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const { email, password, name } = await req.json()
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await User.create({
            email,
            password: hashedPassword,
            name
        })

        const token = signToken(user._id.toString())

        return NextResponse.json({
            user: { id: user._id, email, name },
            token
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}