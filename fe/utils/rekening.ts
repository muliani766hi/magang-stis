'use server'
import { cache } from 'react'
import { cookies } from 'next/headers'

export async function getDokumenTranslok() {
    const token = cookies().get('token')?.value

    try {
        const response = await fetch(`${process.env.API_URL}/dokumen-translok`, {
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