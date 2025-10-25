// app/api/roundtables/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Roundtable from '@/models/Roundtable';
import User from '@/models/User'; // اضافه کردن import مدل User
import { verifyToken } from '@/models/jwt';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
    await connectDB();
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        const { title } = await req.json();

        if (!token) return NextResponse.json({ error: 'توکن لازم است' }, { status: 401 });

        const { id: userIdString } = verifyToken(token);
        console.log('User ID for POST:', userIdString); // لوگ برای دیباگ

        if (!title) {
            return NextResponse.json({ error: 'عنوان الزامی است' }, { status: 400 });
        }

        const userId = new mongoose.Types.ObjectId(userIdString);
        const user = await User.findById(userId); // استفاده از مدل User
        if (!user) {
            return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 404 });
        }

        const roundtable = await Roundtable.create({
            title,
            creatorId: userId,
            participants: [userId],
        });

        console.log('Created roundtable:', roundtable);
        return NextResponse.json(roundtable);
    } catch (error) {
        console.error('Error in POST /api/roundtables:', error);
        //@ts-ignore
        return NextResponse.json({ error: 'خطا در ایجاد میزگرد', details: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    await connectDB();
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ error: 'توکن لازم است' }, { status: 401 });

        const { id } = verifyToken(token);
        console.log('User ID from token:', id);

        const roundtables = await Roundtable.find()
            .populate({
                path: 'creatorId',
                select: 'name email',
                strictPopulate: false,
            })
            .sort({ createdAt: -1 });

        console.log('Fetched roundtables:', roundtables);
        return NextResponse.json(roundtables);
    } catch (error) {
        console.error('Error in GET /api/roundtables:', error);
        //@ts-ignore
        return NextResponse.json({ error: 'خطا در دریافت میزگردها', details: error.message }, { status: 500 });
    }
}