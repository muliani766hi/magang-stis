'use server'
import { cache } from 'react'
// import 'server-only'
import { cookies } from 'next/headers'
import { getMahasiswaId } from './kegiatan-harian'
import { getDosenId } from './get-profile'


export async function getBimbinganMagang() {
    const token = cookies().get('token')?.value
    // const mahasiswaId = await getMahasiswaId()

    const response = await fetch(`${process.env.API_URL}/bimbingan-magang??nim=&nipDosen=&tanggal=&status=`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    }
    )

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function postBimbinganMagang(values: any) {
    try {
        const token = cookies().get('token')?.value;
        const mahasiswaId = await getMahasiswaId();

        const response = await fetch(`${process.env.API_URL}/bimbingan-magang/mahasiswa/${mahasiswaId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(
                {
                    tanggal: values.tanggal,
                    tempat: values.tempat,
                    deskripsi: values.deskripsi,
                }
            )
        });
        // console.log(values)

        // console.log(await response.json());
        // console.log(await response.text());

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
}

export async function putBimbinganMagang(values: any) {
    try {
        const token = cookies().get('token')?.value;
        // const mahasiswaId = await getMahasiswaId();

        const response = await fetch(`${process.env.API_URL}/bimbingan-magang/${values.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(
                {
                    tanggal: values.tanggal,
                    tempat: values.tempat,
                    deskripsi: values.deskripsi,
                }
            )
        });


        console.log(await response.json());
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
}

export async function putConfirmBimbinganMagang(bimbinganId: number) {
    try {
        const token = cookies().get('token')?.value;

        const response = await fetch(`${process.env.API_URL}/bimbingan-magang/confirm/${bimbinganId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // console.log(await response.text());
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
}

export async function putFinalizeBimbinganMagang(bimbinganId: number) {
    try {
        const token = cookies().get('token')?.value;

        const response = await fetch(`${process.env.API_URL}/bimbingan-magang/finalize/${bimbinganId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // console.log(await response.text());
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
}

export async function postBimbinganMagangByDosen(values: any) {
    try {
        const token = cookies().get('token')?.value;
        const dosenId = await getDosenId();
        // console.log(dosenId)
        const response = await fetch(`${process.env.API_URL}/bimbingan-magang/dosen-pembimbing/${dosenId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(
                {
                    tanggal: values.tanggal,
                    tempat: values.tempat,
                    deskripsi: values.deskripsi,
                    pesertaBimbinganMahasiswa: values.pesertaBimbinganMahasiswa.map((item: any) => ({
                        mahasiswaId: Number(item)
                    }))
                }
            )
        });

        // console.log(await response.text());
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
}

export async function deleteBimbinganMagang(bimbinganId: number) {
    try {
        const token = cookies().get('token')?.value;

        const response = await fetch(`${process.env.API_URL}/bimbingan-magang/${bimbinganId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // console.log(await response.text());
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
}
