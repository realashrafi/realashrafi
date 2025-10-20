import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Note from '@/models/Note'
import {verifyToken} from "@/models/jwt";


export async function GET(req: NextRequest) {
    await connectDB()

    try {
        const token = req.headers.get('authorization')?.split(' ')[1]
        if (!token) return NextResponse.json({ error: 'توکن لازم است' }, { status: 401 })

        const { id } = verifyToken(token)

        const notes = await Note.find({ userId: id }).sort({ createdAt: -1 })

        return NextResponse.json(notes)
    } catch (error) {
        return NextResponse.json({ error: 'خطا' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    await connectDB()

    try {
        const token = req.headers.get('authorization')?.split(' ')[1]
        const { title, content } = await req.json()

        // @ts-ignore
        const { id } = verifyToken(token)

        const note = await Note.create({ title, content, userId: id })

        return NextResponse.json(note)
    } catch (error) {
        return NextResponse.json({ error: 'خطا' }, { status: 500 })
    }
}