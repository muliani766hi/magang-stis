import { NextResponse } from "next/server";


let defaultData = [
    // id: number
    // nama: string
    // alamat: string
    // email: string
    // kabupaten_kota: string
    // provinsi: string
    // kode: number
    {
        id: 1,
        nama: "BPS Kabupaten Bogor",
        alamat: "Jl. Raya Pajajaran No. 1, Bogor",
        email: "bps3450@bps.ac.id",
        kabupaten_kota: "Bogor",
        provinsi: "Jawa Barat",
        kode: 3450,
        kapasitas: 10
    }, {
        id: 2,
        nama: "BPS Kabupaten Sukabumi",
        alamat: "Jl. Raya Pajajaran No. 1, Sukabumi",
        email: "bps3451@bps.ac.id",
        kabupaten_kota: "Sukabumi",
        provinsi: "Jawa Barat",
        kode: 3451,
    }, {
        id: 3,
        nama: "BPS Kabupaten Cianjur",
        alamat: "Jl. Raya Pajajaran No. 1, Cianjur",
        email: "bps3452@bps.ac.id",
        kabupaten_kota: "Cianjur",
        provinsi: "Jawa Barat",
        kode: 3452,
        kapasitas: 5
    }, {
        id: 4,
        nama: "BPS Kabupaten Bandung",
        alamat: "Jl. Raya Pajajaran No. 1, Bandung",
        email: "bps3453@bps.ac.id",
        kabupaten_kota: "Bandung",
        provinsi: "Jawa Barat",
        kode: 3453,
    }, {
        id: 5,
        nama: "BPS Kabupaten Garut",
        alamat: "Jl. Raya Pajajaran No. 1, Garut",
        email: "bps3454@bps.ac.id",
        kabupaten_kota: "Garut",
        provinsi: "Jawa Barat",
        kode: 3454,
    }, {
        id: 6,
        nama: "BPS Kabupaten Tasikmalaya",
        alamat: "Jl. Raya Pajajaran No. 1, Tasikmalaya",
        email: "bps3455@bps.ac.id",
        kabupaten_kota: "Tasikmalaya",
        provinsi: "Jawa Barat",
        kode: 3455,
    }, {
        id: 7,
        nama: "BPS Kabupaten Ciamis",
        alamat: "Jl. Raya Pajajaran No. 1, Ciamis",
        email: "bps3456@bps.ac.id",
        kabupaten_kota: "Ciamis",
        provinsi: "Jawa Barat",
        kode: 3456,
    }, {
        id: 8,
        nama: "BPS Kabupaten Kuningan",
        alamat: "Jl. Raya Pajajaran No. 1, Kuningan",
        email: "bps3457@bps.ac.id",
        kabupaten_kota: "Kuningan",
        provinsi: "Jawa Barat",
        kode: 3457,
    }, {
        id: 9,
        nama: "BPS Kabupaten Majalengka",
        alamat: "Jl. Raya Pajajaran No. 1, Majalengka",
        email: "bps3458@bps.ac.id",
        kabupaten_kota: "Majalengka",
        provinsi: "Jawa Barat",
        kode: 3458,
    }, {
        id: 10,
        nama: "BPS Kabupaten Sumedang",
        alamat: "Jl. Raya Pajajaran No. 1, Sumedang",
        email: "bps3459@bps.ac.id",
        kabupaten_kota: "Sumedang",
        provinsi: "Jawa Barat",
        kode: 3459,
    }
]

let data = [...defaultData];


export async function GET() {
    return NextResponse.json({ 
        data: data
    });
}