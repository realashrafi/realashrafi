import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import {signToken} from "@/models/jwt";


export async function POST(req: NextRequest) {
    await connectDB()

    try {
        const { email, password } = await req.json()

        const user = await User.findOne({ email })
        if (!user) return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 401 })

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return NextResponse.json({ error: 'رمز اشتباه' }, { status: 401 })

        const token = signToken(user._id.toString())

        return NextResponse.json({
            user: { id: user._id, email: user.email, name: user.name },
            token
        })
    } catch (error) {
        return NextResponse.json({ error: 'خطا' }, { status: 500 })
    }
}