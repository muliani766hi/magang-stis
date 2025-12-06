'use server'
import { cache } from 'react'
// import 'server-only'
import { cookies } from 'next/headers'
import { getMahasiswaId } from './kegiatan-harian'
import exp from 'constants'


export async function getBimbinganSkripsi() {
    const token = cookies().get('token')?.value
    const mahasiswaId = await getMahasiswaId()

    const response = await fetch(`${process.env.API_URL}/bimbingan-skripsi?mahasiswaId=${mahasiswaId}&tanggal`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        }
    )


    if (!response.ok) {
        console.log(await response.text())
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function getAllBimbinganSkripsi() {
    const token = cookies().get('token')?.value
    // const mahasiswaId = await getMahasiswaId()

    const response = await fetch(`${process.env.API_URL}/bimbingan-skripsi?mahasiswaId=&tanggal`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        }
    )

    // console.log(await response.text())

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return response.json()
}


export async function postBimbinganSkripsi(value: any) {
    const token = cookies().get('token')?.value
    const mahasiswaId = await getMahasiswaId()
    let [jamMulaiHours, jamMulaiMinutes] = value.jamMulai.split(":");
    let jamMulaiDate = new Date();
    jamMulaiDate.setHours(parseInt(jamMulaiHours));
    jamMulaiDate.setMinutes(parseInt(jamMulaiMinutes));

    let [jamSelesaiHours, jamSelesaiMinutes] = value.jamSelesai.split(":");
    let jamSelesaiDate = new Date();
    jamSelesaiDate.setHours(parseInt(jamSelesaiHours));
    jamSelesaiDate.setMinutes(parseInt(jamSelesaiMinutes));

    const response = await fetch(`${process.env.API_URL}/bimbingan-skripsi/${mahasiswaId}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                tanggal: value.tanggal.toISOString(),
                keterangan: value.keterangan,
                jamMulai: jamMulaiDate.toISOString(),
                jamSelesai: jamSelesaiDate.toISOString(),
            })
        }
    )
    // console.log(await response.text())

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function putBimbinganSkripsi(value: any, bimbinganSkripsiId: number) {
    const token = cookies().get('token')?.value
    let [jamMulaiHours, jamMulaiMinutes] = value.jamMulai.split(":");
    let jamMulaiDate = new Date();
    jamMulaiDate.setHours(parseInt(jamMulaiHours));
    jamMulaiDate.setMinutes(parseInt(jamMulaiMinutes));

    let [jamSelesaiHours, jamSelesaiMinutes] = value.jamSelesai.split(":");
    let jamSelesaiDate = new Date();
    jamSelesaiDate.setHours(parseInt(jamSelesaiHours));
    jamSelesaiDate.setMinutes(parseInt(jamSelesaiMinutes));
    console.log(value)

    const response = await fetch(`${process.env.API_URL}/bimbingan-skripsi/${bimbinganSkripsiId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                tanggal: value.tanggal.toISOString(),
                keterangan: value.keterangan,
                jamMulai: jamMulaiDate.toISOString(),
                jamSelesai: jamSelesaiDate.toISOString()
            })
        }
    )
    // console.log(await response.text())

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function deleteBimbinganSkripsi(izinBimbinganSkripsiId: number) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/bimbingan-skripsi/${izinBimbinganSkripsiId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        }
    )

    if (!response.ok) {
        console.log(await response.text())
        throw new Error('Failed to fetch data')
    }

    return response.json()
}