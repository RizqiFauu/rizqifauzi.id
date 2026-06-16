import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { error } = await supabase
      .from('contacts')
      .insert([
        {
          name: body.name,
          email: body.email,
          subject: body.subject,
          message: body.message,
        },
      ]);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}