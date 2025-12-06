import { stat } from "fs";
import { NextRequest, NextResponse } from "next/server";

let defaultData = [
    {
        id: 1,
        jenis: 1,
        tanggal: '2023-08-21',
        deskripsi: 'Lorem ipsum dolor sit amet',
        status: 'Disetujui',
        link_online_meet: 'https://meet.google.com/abc-123'
    },
    {
        id: 2,
        jenis: 2,
        tanggal: '2023-09-21',
        deskripsi: 'Lorem ipsum dolor sit amet',
        status: 'Menunggu',
        link_online_meet: 'https://meet.google.com/abc-123'
    }
];

let data = [...defaultData];

export async function GET() {
    return NextResponse.json({ 
        data: data
    });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
// add status menunggu to body
    body.status = 'Menunggu';

    // Find the maximum id in the current data
    const maxId = Math.max(...data.map(item => item.id), 0);
    const maxJenis = Math.max(...data.map(item => item.jenis), 0);

    // Assign the new id to the body
    body.id = maxId + 1;
    body.jenis = maxJenis + 1;

    data.push(body);

    // Schedule the reset of the data after one minute
    setTimeout(() => {
        data = [...defaultData];
    }, 60 * 1000); // 60 seconds * 1000 milliseconds/second


    return NextResponse.json({ 
        status: 'success',
        message: 'Data berhasil disimpan',
        data: body
     });
}