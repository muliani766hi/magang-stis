import { NextRequest, NextResponse } from "next/server";





export async function PUT(req: NextRequest) {
    return NextResponse.json({ status: 'success', message: 'Data berhasil disimpan' });
}