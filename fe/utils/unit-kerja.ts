'use server'
import { cache } from 'react'
// import 'server-only'
import { cookies } from 'next/headers'
import { getMahasiswaId } from './kegiatan-harian'
import { getProfile } from './get-profile'

// export async function getUnitKerja() {
//     const token = cookies().get('token')?.value

//     const response = await fetch(`${process.env.API_URL}/satker?satkerId=&kodeSatker=&namaProvinsi=&kodeProvinsi=&kabupatenKota=&kodeKabupatenKota=&alamat=&internalBPS`,
//         {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer ' + token
//             },
//         }
//     )

//     // console.log(await response.text())

//     if (!response.ok) {
//         throw new Error('Failed to fetch data')
//     }
    

//     return response.json()
// }

export async function getUnitKerja(params?: {
  satkerId?: string;
  kodeSatker?: string;
  namaProvinsi?: string;
  kodeProvinsi?: string;
  namaKabupatenKota?: string;
  kodeKabupatenKota?: string;
  alamat?: string;
  internalBps?: string;
  searchSatker?: string;
  searchProvinsi?: string;
  page?: number;
  pageSize?: number;
}) {
  const token = cookies().get('token')?.value;
  const query = new URLSearchParams();

  if (params?.satkerId?.trim()) query.append('satkerId', params.satkerId.trim());
  if (params?.kodeSatker?.trim()) query.append('kodeSatker', params.kodeSatker.trim());
  if (params?.namaProvinsi?.trim()) query.append('namaProvinsi', params.namaProvinsi.trim());
  if (params?.kodeProvinsi?.trim()) query.append('kodeProvinsi', params.kodeProvinsi.trim());
  if (params?.namaKabupatenKota?.trim()) query.append('namaKabupatenKota', params.namaKabupatenKota.trim());
  if (params?.kodeKabupatenKota?.trim()) query.append('kodeKabupatenKota', params.kodeKabupatenKota.trim());
  if (params?.alamat?.trim()) query.append('alamat', params.alamat.trim());
  if (params?.internalBps !== undefined) query.append('internalBps', params.internalBps);

  if (params?.searchSatker?.trim()) query.append('searchSatker', params.searchSatker.trim());
  if (params?.searchProvinsi?.trim()) query.append('searchProvinsi', params.searchProvinsi.trim());

  query.append('page', (params?.page ?? 1).toString());
  if (params?.pageSize !== undefined) {query.append('pageSize', params.pageSize.toString());}

//   console.log("query", query)

  const response = await fetch(`${process.env.API_URL}/satker?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
}


export async function getUnitKerjaByAdprov() {
    const token = cookies().get('token')?.value
    const profile = await getProfile()
    console.log(profile)
    const response = await fetch(`${process.env.API_URL}/satker?satkerId=&kodeSatker=&namaProvinsi=&kodeProvinsi=&kabupatenKota=&kodeKabupatenKota=&alamat=&internalBPS`,
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

export async function getUnitKerjaByProvinsi(id?: string, internalBPS?: boolean | null) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/satker?kodeProvinsi=${id || ''}&internalBps=${internalBPS}`,
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

export async function getUnitKerjaById(id: number) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/satker?satkerId=${id}`,
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
                [
                    {
                        satkerId: Number(values.pilihan1),
                    },
                    {
                        satkerId: Number(values.pilihan2),
                    },
                    {
                        satkerId: Number(values.pilihan3),
                    }

                ]
            )
        });

        // console.log(await response.text());

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        throw new Error('Failed to fetch data');
        console.error(error);
    }
}

export async function getPenempatanById() {
    
    const token = cookies().get('token')?.value
    const mahasiswaId = await getMahasiswaId();

    const response = await fetch(`${process.env.API_URL}/pemilihan-penempatan/test/${mahasiswaId}`, {
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

    return await response.json()
}

export async function postPilihPenempatan(values: any) {
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
                    satker: values.pilihan,
                }
            )
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        return responseData
    } catch (error) {
        console.log('Failed to fetch data');
        return error
    }
}

export async function postUnitKerja(values: any) {
    const token = cookies().get('token')?.value;

    const response = await fetch(`${process.env.API_URL}/satker`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nama: values.nama,
            email: values.email,
            alamat: values.alamat,
            provinsi: {
                kodeProvinsi: values.kodeProvinsi
            },
            kabupatenKota: {
                kodeKabupatenKota: values.kodeKabupatenKota,
                namaKabupatenKota: values.namaKabupatenKota
            },
            internalBPS: values.internalBPS
        })
    })


    if (!response.ok) {
        console.log(await response.text())
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function putUnitKerja(values: any) {
    const token = cookies().get('token')?.value

    console.log(values)

    const response = await fetch(`${process.env.API_URL}/satker/${values.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nama: values.nama,
            email: values.email,
            alamat: values.alamat,
            kode: values.kode,
            provinsi: {
                kodeProvinsi: values.kodeProvinsi
            },
            kabupatenKota: {
                kodeKabupatenKota: values.kodeKabupatenKota,
                // namaKabupatenKota: values.namaKabupatenKota
            },
            kapasitasSatkerTahunAjaran: {
                kapasitas: values.kapasitas
            },
            latitude: Number(values.latitude),
            longitude: Number(values.longitude),
        })
    })

    // console.log(await response.text())

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function deleteUnitKerja(id: number) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/satker/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })


    if (!response.ok) {
        // console.log(await response.text())
        throw new Error('Failed to fetch data')
    }

    return response.json()
}