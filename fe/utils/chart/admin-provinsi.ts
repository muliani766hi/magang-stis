'use server'
import { cookies } from 'next/headers'


export async function getChartAdprov() {
    try {
        const token = cookies().get('token')?.value
    
        const response = await fetch(`${process.env.API_URL}/admin-provinsi/chart`, {
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
    } catch (error) {
        console.log(error)
    }
}
