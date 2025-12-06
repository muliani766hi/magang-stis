import { NextRequest, NextResponse } from "next/server";

let defaultData = [
  {
    id: 1,
    uraian_kegiatan: "Verifikasi jumlah L2 ST2023",
    satuan: "box",
    target: 90,
    realisasi: 90,
    persentase: 100,
    tingkat_kualitas: 98,
    keterangan: "Selesai",
  },
  {
    id: 2,
    uraian_kegiatan: "Upload dokumen L1 L2 ST2023",
    satuan: "Dokumen",
    target: 2700,
    realisasi: 2700,
    persentase: 100,
    tingkat_kualitas: 100,
    keterangan: "Selesai",
  },
  {
    id: 3,
    uraian_kegiatan: "Menyusun Buku Kecamatan Dalam Angka 2023",
    satuan: "Buku",
    target: 1,
    realisasi: 1,
    persentase: 100,
    tingkat_kualitas: 100,
    keterangan: "Selesai",
  },
]

let data = [...defaultData];

export async function GET() {
    return NextResponse.json({ 
        data: data
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