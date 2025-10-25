// app/api/roundtables/[id]/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Roundtable from '@/models/Roundtable';
import Message from '@/models/Message';
import { verifyToken } from '@/models/jwt';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();

    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        const { content } = await req.json();

        if (!token) return NextResponse.json({ error: 'توکن لازم است' }, { status: 401 });

        const { id: userId } = verifyToken(token);

        if (!content) {
            return NextResponse.json({ error: 'متن پیام الزامی است' }, { status: 400 });
        }

        const { id: roundtableId } = params;

        const roundtable = await Roundtable.findById(roundtableId);
        if (!roundtable) {
            return NextResponse.json({ error: 'میزگرد یافت نشد' }, { status: 404 });
        }

        const message = await Message.create({
            content,
            userId,
            roundtableId,
        });

        return NextResponse.json(message);
    } catch (error) {
        return NextResponse.json({ error: 'خطا در ارسال پیام' }, { status: 500 });
    }
}