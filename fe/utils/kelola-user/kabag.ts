'use server'
import { cache } from 'react'
// import 'server-only'
import { cookies } from 'next/headers'

export async function getAllKabag() {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/kabag`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function postKabag(values: any) {
    const token = cookies().get('token')?.value;

    const response = await fetch(`${process.env.API_URL}/kabag`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nama: values.nama,
            nip: values.nip,
            user: {
                email: values.email,
                password: values.password,
            }
        })
    })


    if (!response.ok) {
        console.log(await response.text())
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function putKabag(values: any) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/kabag/${values.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nama: values.nama,
            nip: values.nip,
            user: {
                email: values.email,
                password: values.password,
            }
        })
    })

    // console.log(await response.text())

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function putKabagWithoutPassword(values: any) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/kabag/${values.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nama: values.nama,
            nip: values.nip,
            user: {
                email: values.email,
            }
        })
    })


    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function deleteKabag(id: number) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/kabag/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    })

    // console.log(await response.text())

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return response.json()
}