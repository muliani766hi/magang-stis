'use server'
import { cache } from 'react'
// import 'server-only'
import { cookies } from 'next/headers'


export async function postPenilaianBimbingan(values: any) {
    const token = cookies().get('token')?.value

    try {
        const response = await fetch(`${process.env.API_URL}/penilaian/bimbingan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(values)
        })

        // console.log(await response.text())

        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }

        return response.json()
    } catch (error) {
        console.error('Error fetching data:', error)
        throw new Error('Failed to fetch data')
    }
}

export async function getPenilaianBimbingan() {
    const token = cookies().get('token')?.value

    try {
        const response = await fetch(`${process.env.API_URL}/penilaian/bimbingan`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        // console.log(await response.text())

        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }

        return response.json()
    } catch (error) {
        console.error('Error fetching data:', error)
        throw new Error('Failed to fetch data')
    }
}

export async function putPenilaianBimbingan(values: any) {
    const token = cookies().get('token')?.value

    try {
        const response = await fetch(`${process.env.API_URL}/penilaian/bimbingan`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(values)
        })

        // console.log(await response.text())

        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }

        return response.json()
    } catch (error) {
        console.error('Error fetching data:', error)
        throw new Error('Failed to fetch data')
    }
}

/// penilian laporan by dosen
export async function postPenilaianLaporanByDosen(values: any) {
    const token = cookies().get('token')?.value

    try {
        const response = await fetch(`${process.env.API_URL}/penilaian/laporan-dosen`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(values)
        })

        // console.log(await response.text())

        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }

        return response.json()
    } catch (error) {
        console.error('Error fetching data:', error)
        throw new Error('Failed to fetch data')
    }
}

export async function getPenilaianLaporanByDosen() {
    const token = cookies().get('token')?.value

    try {
        const response = await fetch(`${process.env.API_URL}/penilaian/laporan-dosen`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        // console.log(await response.text())

        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }

        return response.json()
    } catch (error) {
        console.error('Error fetching data:', error)
        throw new Error('Failed to fetch data')
    }
}

export async function putPenilaianLaporanByDosen(values: any) {
    const token = cookies().get('token')?.value

    try {
        const response = await fetch(`${process.env.API_URL}/penilaian/laporan-dosen`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(values)
        })

        // console.log(await response.text())

        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }

        return response.json()
    } catch (error) {
        console.error('Error fetching data:', error)
        throw new Error('Failed to fetch data')
    }
}
// penilaian kinerja by pembimbing lapanagan
export async function postPenilaianKinerjaByPembimbingLapangan(values: any) {
    const token = cookies().get('token')?.value

    try {
        const response = await fetch(`${process.env.API_URL}/penilaian/kinerja`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(values)
        })

        // console.log(await response.text())

        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }

        return response.json()
    } catch (error) {
        console.error('Error fetching data:', error)
        throw new Error('Failed to fetch data')
    }
}

export async function getPenilaianKinerjaByPembimbingLapangan() {
    const token = cookies().get('token')?.value

    try {
        const response = await fetch(`${process.env.API_URL}/penilaian/kinerja`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        // console.log(await response.text())

        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }

        return response.json()
    } catch (error) {
        console.error('Error fetching data:', error)
        throw new Error('Failed to fetch data')
    }
}

export async function putPenilaianKinerjaByPembimbingLapangan(values: any) {
    const token = cookies().get('token')?.value

    try {
        const response = await fetch(`${process.env.API_URL}/penilaian/kinerja`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(values)
        })

        // console.log(await response.text())

        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }

        return response.json()
    } catch (error) {
        console.error('Error fetching data:', error)
        throw new Error('Failed to fetch data')
    }
}

// penilaian laporan by pembimbing lapangan
export async function postPenilaianLaporanByPembimbingLapangan(values: any) {
    const token = cookies().get('token')?.value

    try {
        const response = await fetch(`${process.env.API_URL}/penilaian/laporan-pemlap`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(values)
        })

        // console.log(await response.text())

        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }

        return response.json()
    } catch (error) {
        console.error('Error fetching data:', error)
        throw new Error('Failed to fetch data')
    }
}

export async function getPenilaianLaporanByPembimbingLapangan() {
    const token = cookies().get('token')?.value

    try {
        const response = await fetch(`${process.env.API_URL}/penilaian/laporan-pemlap`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        // console.log(await response.text())

        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }

        return response.json()
    } catch (error) {
        console.error('Error fetching data:', error)
        throw new Error('Failed to fetch data')
    }
}

export async function putPenilaianLaporanByPembimbingLapangan(values: any) {
    const token = cookies().get('token')?.value

    try {
        const response = await fetch(`${process.env.API_URL}/penilaian/laporan-pemlap`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(values)
        })

        // console.log(await response.text())

        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }

        return response.json()
    } catch (error) {
        console.error('Error fetching data:', error)
        throw new Error('Failed to fetch data')
    }
}