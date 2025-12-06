import { NextRequest, NextResponse } from "next/server";

let defaultData = {
        id: 1,
        nim: "222011622",
        nama: "Moch. Daffa' Al Faris",
        email: "222011622@stis.ac.id",
        no_hp: "62895367350752",
        alamat: "Jl. Tunggul Wulung, Ds. Menang, Kec. Pagu, Kab. Kediri",
        tempat_tanggal_lahir: "Kediri, 25 Juli 2003",
        kelas: "4SI3",
        bank: "",
        no_rekening: "",
        atas_nama: "",
}

let data = {...defaultData};

export async function GET() {
    return NextResponse.json({ 
        data: data
    });
}


export async function PUT(req: NextRequest) {
    const body = await req.json();

   // updata data bank, no_rekening, atas_nama
    data.bank = body.bank;
    data.no_rekening = body.no_rekening;
    data.atas_nama = body.atas_nama;

    setTimeout(() => {
        data = {...defaultData};
    }, 60 * 1000); // 60 seconds * 1000 milliseconds/second


    return NextResponse.json({ 
        status: 'success',
        message: 'Data berhasil disimpan',
        data: body
     });
}