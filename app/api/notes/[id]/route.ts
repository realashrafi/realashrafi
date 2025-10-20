import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Note from '@/models/Note'
import {verifyToken} from "@/models/jwt";


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await connectDB()

    try {
        const token = req.headers.get('authorization')?.split(' ')[1]
        // @ts-ignore
        const { id } = verifyToken(token)
        const { title, content } = await req.json()

        const note = await Note.findOneAndUpdate(
            { _id: params.id, userId: id },
            { title, content },
            { new: true }
        )

        return NextResponse.json(note)
    } catch (error) {
        return NextResponse.json({ error: 'خطا' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await connectDB()

    try {
        const token = req.headers.get('authorization')?.split(' ')[1]
        // @ts-ignore
        const { id } = verifyToken(token)

        await Note.findOneAndDelete({ _id: params.id, userId: id })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'خطا' }, { status: 500 })
    }
}