'use server'
import { cache } from 'react'
// import 'server-only'
import { cookies } from 'next/headers'

export async function getAdminSatker(params?: { 
  searchSatker?: string;
  email?: string;
  namaSatker?: string;
  page?: number;
  pageSize?: number;
}) {
  const token = cookies().get('token')?.value;

  // Buat query string yang rapi
  const query = new URLSearchParams();

  if (params?.searchSatker) {query.append('searchSatker', params.searchSatker);}
  if (params?.email) {query.append('email', params.email);}
  if (params?.namaSatker) {query.append('namaSatker', params.namaSatker);}
  query.append('page', String(params?.page ?? 1));
  if (params?.pageSize !== undefined) {query.append('pageSize', String(params.pageSize));}

  const url = `${process.env.API_URL}/admin-satker?${query.toString()}`;
//   console.log('🔗 Full URL:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function postAdminSatker(values: any) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/admin-satker/${values.satkerId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nama: values.nama,
            nip: values.nip,
            email: values.email,
            password: values.password,
        })
    })


    if (!response.ok) {
        // console.log(await response.text())
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function putAdminSatker(values: any) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/admin-satker/${values.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nama: values.nama,
            nip: values.nip,
            email: values.email,
            password: values.password,
        })
    })

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function putAdminSatkerWithoutPassword(values: any) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/admin-satker/${values.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nama: values.nama,
            nip: values.nip,
            email: values.email,
        })
    })

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function putAssignMahasiswaToPembimbing(values: any) {
    const token = cookies().get('token')?.value
    // console.log(values)

    const convertedArray = values.mahasiswaBimbingan.map((id: any) => ({ mahasiswaId: Number(id) }));
    const response = await fetch(`${process.env.API_URL}/admin-satker/assign-mahasiswa/pemlap/${values.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(convertedArray)
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch data ${await response.text()}`)
    }

    return response.json()
}

export async function putUnassignMahasiswaToPembimbing(values: any) {
    const token = cookies().get('token')?.value
    // console.log(values)
    // get the unslected mahasiswa from the selected mahasiswa by values.mahasiswaBimbingan and values.mahasiswaBimbinganFull
    const unselectedMahasiswa = values.mahasiswaBimbinganFull.filter((mahasiswa: any) => !values.mahasiswaBimbingan.includes(mahasiswa))
    // console.log(unselectedMahasiswa)
    const convertedArray = unselectedMahasiswa.map((mahasiswa: any) => ({ mahasiswaId: Number(mahasiswa) }));


    // console.log(convertedArray)
    if (convertedArray.length === 0) {
        return
    }
    const response = await fetch(`${process.env.API_URL}/admin-satker/unassign-mahasiswa/pemlap/${values.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(convertedArray)
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch data ${await response.text()}`)
    }

    return response.json()
}