import { NextRequest, NextResponse } from "next/server";

let defaultData = [
  {
    id: 1,
    tanggal_kegiatan: "2023-08-21",
    deskripsi_kegiatan: "Verifikasi jumlah L2 ST2023",
    volume: 60,
    satuan: "box",
    durasi: "6 jam",
    pemberi_tugas: "Tim DILAN",
    status_penyelesaian: "100%",
  },
  {
    id: 2,
    tanggal_kegiatan: "2023-08-22",
    deskripsi_kegiatan: "Verifikasi jumlah L2 ST2023",
    volume: 30,
    satuan: "box",
    durasi: "3 jam",
    pemberi_tugas: "Tim DILAN",
    status_penyelesaian: "100%",
  },
  {
    id: 3,
    tanggal_kegiatan: "2023-08-23",
    deskripsi_kegiatan: "Upload dokumen L1 L2 ST2023",
    volume: 2700,
    satuan: "Dokumen",
    durasi: "6 jam",
    pemberi_tugas: "Tim DILAN",
    status_penyelesaian: "100%",
  },
  {
    id: 4,
    tanggal_kegiatan: "2023-08-24",
    deskripsi_kegiatan: "Menyusun Buku Kecamatan Dalam Angka 2023",
    volume: 1,
    satuan: "Buku",
    durasi: "6 jam",
    pemberi_tugas: "Tim DILAN",
    status_penyelesaian: "100%",
  },
  {
    id: 5,
    tanggal_kegiatan: "2023-08-25",
    deskripsi_kegiatan: "Menyusun Buku Kecamatan Dalam Angka 2023",
    volume: 1,
    satuan: "Buku",
    durasi: "6 jam",
    pemberi_tugas: "Tim DILAN",
    status_penyelesaian: "100%",
  },
];

let data = [...defaultData];

export async function GET() {
    return NextResponse.json({ 
        data: data
    });
}


export async function POST(req: NextRequest) {
    const body = await req.json();

    // Find the maximum id in the current data
    const maxId = Math.max(...data.map(item => item.id), 0);

    // Assign the new id to the body
    body.id = maxId + 1;

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



export async function PUT(req: NextRequest) {
    const body = await req.json();

    // Find the index of the item to be updated
    const index = data.findIndex(item => item.id === body.id);

    // Update the item
    data[index] = body;
    

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