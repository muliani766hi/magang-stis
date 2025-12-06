'use server'
import { cache } from 'react'
import { cookies } from 'next/headers'

export async function getPengumuman() {
    const token = cookies().get('token')?.value
    const response = await fetch(`${process.env.API_URL}/pengumuman`,
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

export async function postPengumuman(payload: any) {
  const token = cookies().get('token')?.value
  const response = await fetch(`${process.env.API_URL}/pengumuman`,
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            roleIds: payload.roleIds,
            judul: payload.judul,
            isi: payload.isi
          })
      }
  )

  if (!response.ok) {
      throw new Error('Failed to fetch data')
  }

  return response.json()
}

export async function removePengumuman(groupId: any) {
    const token = cookies().get('token')?.value
    const response = await fetch(`${process.env.API_URL}/pengumuman/${groupId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }
    )
  
    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }
  
    return response.json()
  }