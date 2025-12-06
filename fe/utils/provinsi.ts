'use server'
import { cache } from 'react'
import { cookies } from 'next/headers'

export async function getProvinsi() {
    const token = cookies().get('token')?.value
    const response = await fetch(`${process.env.API_URL}/provinsi?nama=&kodeProvinsi=`,
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