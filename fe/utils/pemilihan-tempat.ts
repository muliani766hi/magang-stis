'use server'
import { cache } from 'react'
// import 'server-only'
import { cookies } from 'next/headers'
import { getMahasiswaId } from './kegiatan-harian'

export async function getPemilihanPenempatan() {
    const token = cookies().get('token')?.value
    const mahasiswaId = await getMahasiswaId()

    const response = await fetch(`${process.env.API_URL}/pemilihan-penempatan?satkerId=&mahasiswaId=${mahasiswaId}`,
        {
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

interface GetListPemilihanPenempatanParams {
  searchSatker?: string;
  searchProvinsiSatker?: string;
  searchStatusSatker?: string;

  searchNamaMahasiswa?: string;
  searchProdi?: string;
  searchPenempatan?: string;
  searchPilihan1?: string;
  searchProvPilihan1?: string;
  searchPilihan2?: string;
  searchProvPilihan2?: string;
  searchStatusMahasiswa?: string;

  pageSatker?: number;
  pageSizeSatker?: number;
  pageMahasiswa?: number;
  pageSizeMahasiswa?: number;
}

export async function getListPemilihanPenempatan(params: GetListPemilihanPenempatanParams = {}) {
    const token = cookies().get('token')?.value

    const query = new URLSearchParams({
        // Filter untuk Satker
        searchSatker: params.searchSatker || '',
        searchProvinsiSatker: params.searchProvinsiSatker || '',
        searchStatusSatker: params.searchStatusSatker || '',

        // Filter untuk Mahasiswa
        searchNamaMahasiswa: params.searchNamaMahasiswa || '',
        searchProdi: params.searchProdi || '',
        searchPenempatan: params.searchPenempatan || '',
        searchPilihan1: params.searchPilihan1 || '',
        searchProvPilihan1: params.searchProvPilihan1 || '',
        searchPilihan2: params.searchPilihan2 || '',
        searchProvPilihan2: params.searchProvPilihan2 || '',
        searchStatusMahasiswa: params.searchStatusMahasiswa || '',

        // Pagination untuk Satker
        pageSatker: (params.pageSatker || 1).toString(),
        // Pagination untuk Mahasiswa
        pageMahasiswa: (params.pageMahasiswa || 1).toString(),
    });
    // console.log("query", query)
    if (params?.pageSizeSatker !== undefined) {query.append('pageSizeSatker', params.pageSizeSatker.toString());}
    if (params?.pageSizeMahasiswa !== undefined) {query.append('pageSizeMahasiswa', params.pageSizeMahasiswa.toString());}

    const response = await fetch(`${process.env.API_URL}/pemilihan-penempatan/list?${query.toString()}`,
        {
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

export async function getPemilihanPenempatanById(id: string) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/pemilihan-penempatan?satkerId=${id}`,
        {
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

export async function getJarakPenempatan(mahasiswaId: number) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/pemilihan-penempatan/jarak/${mahasiswaId}`,
        {
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

export async function confirmPenempatan(mahasiswaId: number, satkerId: number) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/pemilihan-penempatan/confirm/${mahasiswaId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                satkerId: satkerId
            })
        }
    )

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function confirmBulkPenempatan(payload: { mahasiswa: string[], satkerId: string[] }) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/pemilihan-penempatan/bulk`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                mahasiswa: payload.mahasiswa,
                satkerId: payload.satkerId
            })
        }
    )

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function postPemilihanPenempatan(values: any) {
    try {
        const token = cookies().get('token')?.value;
        const mahasiswaId = await getMahasiswaId();

        const response = await fetch(`${process.env.API_URL}/pemilihan-penempatan/${mahasiswaId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(
                {
                    satkerId: values.satkerId,
                }
            )
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error(error);
    }
}

export async function getAllPemilihanPenempatan() {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/pemilihan-penempatan?satkerId=&mahasiswaId=`,
        {
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

export async function putKonfirmasiPenempatan(id: number) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/pemilihan-penempatan/konfirmasi/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        console.log(await response.text())
        throw new Error('Failed to fetch data');
    }

    return response.json();
}