'use server'
import { cookies } from 'next/headers'


export async function getAccessAlocation() {
    try {
        const token = cookies().get('token')?.value
    
        const response = await fetch(`${process.env.API_URL}/access-alocation-magang`, {
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

export async function putAccessAlocation(id: number, status: boolean) {
    try {
        const token = cookies().get('token')?.value
        const response = await fetch(`${process.env.API_URL}/access-alocation-magang/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(
                {
                    status: status,
                }
            )
        })
    
        if (!response.ok) {
            throw new Error('Failed to update data')
        }
    
        return response.json()
    } catch (error) {
        console.log(error)
    }
}