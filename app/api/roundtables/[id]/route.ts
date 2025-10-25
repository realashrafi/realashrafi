// app/api/roundtables/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Roundtable from '@/models/Roundtable';
import Message from '@/models/Message';
import { verifyToken } from '@/models/jwt';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ error: 'توکن لازم است' }, { status: 401 });

        const { id: userId } = verifyToken(token);
        console.log('User ID for GET [id]:', userId);

        const { id } = params;

        const roundtable = await Roundtable.findById(id).populate({
            path: 'creatorId',
            select: 'name email',
            strictPopulate: false,
        });

        const messages = await Message.find({ roundtableId: id })
            .populate({
                path: 'userId',
                select: 'name',
                strictPopulate: false,
            })
            .sort({ createdAt: -1 });

        if (!roundtable) {
            return NextResponse.json({ error: 'میزگرد یافت نشد' }, { status: 404 });
        }

        console.log('Fetched roundtable:', roundtable, 'Messages:', messages);
        return NextResponse.json({ roundtable, messages });
    } catch (error) {
        console.error('Error in GET /api/roundtables/[id]:', error);
        //@ts-ignore
        return NextResponse.json({ error: 'خطا در دریافت اطلاعات', details: error.message }, { status: 500 });
    }
}