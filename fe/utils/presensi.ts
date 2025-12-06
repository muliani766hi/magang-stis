'use server'
import { cache } from 'react'
// import 'server-only'
import { cookies } from 'next/headers'
import { getMahasiswaId } from './kegiatan-harian'

export async function getPresensiNew() {
    const token = cookies().get('token')?.value
    const response = await fetch(`${process.env.API_URL}/presensi/grouping`,
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

export async function getChartPerizinan() {
    const token = cookies().get('token')?.value
    const response = await fetch(`${process.env.API_URL}/presensi/presensi/chart/izin-presensi`,
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

export async function getPresensiNewById() {
    const token = cookies().get('token')?.value
    const mahasiswaId = await getMahasiswaId()

    const response = await fetch(`${process.env.API_URL}/presensi/chart/${mahasiswaId}`,
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

export async function getPresensi() {
    const token = cookies().get('token')?.value

    const mahasiswaId = await getMahasiswaId()
    console.log(mahasiswaId, "mhs")

    const response = await fetch(`${process.env.API_URL}/presensi?tanggal=&mahasiswaId=${mahasiswaId}`,
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


export async function postDatang() {
    const token = cookies().get('token')?.value
    const mahasiswaId = await getMahasiswaId()

    const response = await fetch(`${process.env.API_URL}/presensi/datang/${mahasiswaId}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                tanggal: new Date().toISOString(),
                waktuDatang: new Date().toISOString(),
            })
        }
    )
    // console.log(await response.text())

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function putPulang(presensiId: number) {
    const token = cookies().get('token')?.value
    const response = await fetch(`${process.env.API_URL}/presensi/pulang/${presensiId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                waktuPulang: new Date().toISOString(),
            })
        }
    )
    // console.log(await response.text())

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return response.json()
}


export async function getPresensiByMahasiswaId(mahasiswaId?: number) {
    console.log('oi', mahasiswaId)
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/presensi?tanggal=&mahasiswaId=${mahasiswaId}`,
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

export async function postPresensi(values: any) {
    const token = cookies().get('token')?.value
    // console.log(values)
    const response = await fetch(`${process.env.API_URL}/presensi`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                tanggal: values.tanggal,
                waktu: values.waktu,
            })
        }
    )


    if (!response.ok) {
        console.log(await response.text())
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function getPerizinan() {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/presensi/izin-presensi`,
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

export async function postPerizinan(values: any) {
    const token = cookies().get('token')?.value
    // console.log(values)
    const response = await fetch(`${process.env.API_URL}/presensi/izin-presensi`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                tanggal: values.tanggal,
                keterangan: values.keterangan,
                jenisIzin: values.jenisIzin,
            })
        }
    )

    if (!response.ok) {
        console.log(await response.text())
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function putPerizinan(values: any) {
    const token = cookies().get('token')?.value
    // console.log(values)
    const response = await fetch(`${process.env.API_URL}/presensi/izin-presensi/${values.izinId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                tanggal: values.tanggal,
                keterangan: values.keterangan,
                jenisIzin: values.jenisIzin,
            })
        }
    )

    if (!response.ok) {
        console.log(await response.text())
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function putSetujuPerizinan(izinId: number) {
    const token = cookies().get('token')?.value
    const response = await fetch(`${process.env.API_URL}/presensi/izin-presensi/${izinId}/approve`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }
    )


    if (!response.ok) {
        let errorMessage = 'Failed to fetch data'; // Default error message
        try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
                errorMessage = errorData.message;
            }
        } catch (error) {
            // If parsing fails, keep the default error message
        }

        throw new Error(errorMessage);
    }

    // If the response is OK, parse and return the JSON body
    return response.json();
}

export async function putTolakPerizinan(izinId: number) {
    const token = cookies().get('token')?.value
    const response = await fetch(`${process.env.API_URL}/presensi/izin-presensi/${izinId}/reject`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }
    )

    // Check if the response is not OK (status is not in the range 200-299).
    if (!response.ok) {
        let errorMessage = 'Failed to fetch data'; // Default error message
        try {
            // Attempt to parse the error message from the response
            const errorData = await response.json();
            // Update the error message if the server provides one
            if (errorData && errorData.message) {
                errorMessage = errorData.message;
            }
        } catch (error) {
            // If parsing fails, keep the default error message
        }
        // Throw an error with the message
        throw new Error(errorMessage);
    }

    // If the response is OK, parse and return the JSON body
    return response.json();
}


/// presensi manual

export async function getPresensiManual() {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/presensi-manual?presensiManualId`,
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

export async function putSetujuPresensiManual(presensiManualId: any) {
    const token = cookies().get('token')?.value
    const response = await fetch(`${process.env.API_URL}/presensi-manual/setujui/${presensiManualId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })

    if (!response.ok) {
        let errorMessage = 'Failed to fetch data'; // Default error message
        try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
                errorMessage = errorData.message;
            }
        } catch (error) {
            // If parsing fails, keep the default error message
        }

        throw new Error(errorMessage);
    }

    // If the response is OK, parse and return the JSON body
    return response.json();
}

export async function putTolakPresensiManual(presensiManualId: any) {
    const token = cookies().get('token')?.value
    const response = await fetch(`${process.env.API_URL}/presensi-manual/tolak/${presensiManualId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })

    if (!response.ok) {
        let errorMessage = 'Failed to fetch data'; // Default error message
        try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
                errorMessage = errorData.message;
            }
        } catch (error) {
            // If parsing fails, keep the default error message
        }

        throw new Error(errorMessage);
    }

    // If the response is OK, parse and return the JSON body
    return response.json();
}

export async function deletePresensiManual(presensiManualId: any) {
    const token = cookies().get('token')?.value
    const response = await fetch(`${process.env.API_URL}/presensi-manual/${presensiManualId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })

    if (!response.ok) {
        let errorMessage = 'Failed to fetch data'; // Default error message
        try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
                errorMessage = errorData.message;
            }
        } catch (error) {
            // If parsing fails, keep the default error message
        }

        throw new Error(errorMessage);
    }

    // If the response is OK, parse and return the JSON body
    return response.json();
}