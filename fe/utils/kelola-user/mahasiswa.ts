'use server'
import { cache } from 'react'
// import 'server-only'
import { cookies } from 'next/headers'

// export async function getAllMahasiswa(params?: { tahunAjaranId: string }) {
//     const token = cookies().get('token')?.value

//     const response = await fetch(`${process.env.API_URL}/mahasiswa?nim=&nama=&kelas=&prodi=&dosenId=&pemlapId=&satkerId=&email=&statusRek&tahunAjaran=${params?.tahunAjaranId || ''}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + token
//         },
//     })

//     if (!response.ok) {
//         throw new Error('Failed to fetch data')
//     }

//     return response.json()
// }

export async function getAllMahasiswa(params?: {
  searchNama?: string;
  searchNIM?: string;
  searchKelas?: string;
  searchAlamat?: string;
  searchSatker?: string;
  searchBank?: string;
  searchStatusRek?: string;
  tahunAjaran?: string; // ini dikirim sebagai tahunAjaran ke backend
  page?: number;
  pageSize?: number;
}) {
  const token = cookies().get('token')?.value;
  const query = new URLSearchParams();

  // Tambahkan hanya jika valuenya tidak kosong string atau null
  if (params?.searchNama?.trim()) query.append('searchNama', params.searchNama.trim());
  if (params?.searchNIM?.trim()) query.append('searchNIM', params.searchNIM.trim());
  if (params?.searchKelas?.trim()) query.append('searchKelas', params.searchKelas.trim());
  if (params?.searchAlamat?.trim()) query.append('searchAlamat', params.searchAlamat.trim());
  if (params?.searchSatker?.trim()) query.append('searchSatker', params.searchSatker.trim());
  if (params?.searchBank?.trim()) query.append('searchBank', params.searchBank.trim());
  if (params?.searchStatusRek?.trim()) query.append('searchStatusRek', params.searchStatusRek.trim());
  if (params?.tahunAjaran?.trim()) query.append('tahunAjaran', params.tahunAjaran.trim());

  // Pagination
  query.append('page', (params?.page ?? 1).toString());
  if (params?.pageSize !== undefined) {query.append('pageSize', params.pageSize.toString());}
//   console.log("utils", query)

  const response = await fetch(`${process.env.API_URL}/mahasiswa?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
}




export async function getChartJmlhMhs(params?: { tahunAjaranId: string }) {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/mahasiswa/chart/jmlh-mhs`, {
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


export async function postAllMahasiswa(file: File) {
    const token = cookies().get('token')?.value;
    if (file) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const formdata = new FormData();
        formdata.append("file", file);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            // redirect: "follow"
        };

        try {
            const response = await fetch(`${process.env.API_URL}/mahasiswa/excel`, requestOptions);
            const result = await response.json();
            console.log(await response.text());

            // // Assuming the API returns the updated list of mahasiswa
            // const modifiedData = result.data.map((item: { mahasiswaId: any; }) => ({
            //     ...item,
            //     id: item.mahasiswaId,  // Add the `id` field using `mahasiswaId`
            // }));
            // setData(modifiedData);
        } catch (error) {
            console.error("Failed to upload file", error);
        }
    }
}

export async function getToken() {
    const token = cookies().get('token')?.value;
    return token;
}


export async function putMahasiswa(id: number, values: any) {
    const token = cookies().get('token')?.value;

    const response = await fetch(`${process.env.API_URL}/mahasiswa/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            ...values,
            dosenPembimbingMagang: {
                dosenId: values.dosenId !== "null" ? Number(values.dosenId) : ""
            },
            pembimbingLapangan: {
                pemlapId: values.pemlapId !== "null" ? Number(values.pemlapId) : ""
            },
            satker: {
                satkerId: values.satkerId !== "null" ? Number(values.satkerId) : ""
            },
        })
    });


    if (!response.ok) {
        console.log(await response);
        // throw new Error('Failed to fetch data')
    }

    return response.json()
}