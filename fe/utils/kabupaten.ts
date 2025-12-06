'use server'
import { cache } from 'react'
import { cookies } from 'next/headers'

export async function getKabupaten(params: {provinsiId: string}) {
    const token = cookies().get('token')?.value
    const response = await fetch(`${process.env.API_URL}/kabupaten?provinsiId=${params.provinsiId}`,
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

export async function getAllKabupaten() {
  const token = cookies().get('token')?.value
  const response = await fetch(`${process.env.API_URL}/kabupaten/list`,
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