'use server'

import { cookies } from 'next/headers'
import { getMahasiswaId } from './kegiatan-harian'

export async function postDokumenTranslok(payload: FormData) {
  const token = cookies().get('token')?.value;
  const mahasiswaId = await getMahasiswaId();

  // Tambahkan mahasiswaId ke form-data
  payload.append('mahasiswaId', mahasiswaId.toString());

  const response = await fetch(`${process.env.API_URL}/dokumen-translok`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Tidak set Content-Type! Biarkan fetch yang handle multipart boundary-nya
    },
    body: payload,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
}

// export async function getDokumenTranslok() {
//   const token = cookies().get('token')?.value;
//   const mahasiswaId = await getMahasiswaId();

//   const response = await fetch(`${process.env.API_URL}/dokumen-translok?mahasiswaId=${mahasiswaId || ''}`, {
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Failed to fetch data');
//   }

//   return response.json();
// }

export async function getDokumenTranslok(params?: {
  searchNama?: string;
  searchKelas?: string;
  searchSatker?: string;
  searchBulan?: string;
  searchStatus?: string;
  page?: number;
  pageSize?: number;
}) {
  const token = cookies().get('token')?.value;
  const mahasiswaId = await getMahasiswaId();

  // Bangun query string dengan URLSearchParams
  const query = new URLSearchParams();

  if (mahasiswaId) {
    query.append('mahasiswaId', mahasiswaId.toString());
  }

  if (params?.searchNama) {
    query.append('searchNama', params.searchNama);
  }

  if (params?.searchKelas) {
    query.append('searchKelas', params.searchKelas);
  }

  if (params?.searchSatker) {
    query.append('searchSatker', params.searchSatker);
  }

  if (params?.searchBulan) {
    query.append('searchBulan', params.searchBulan);
  }

  if (params?.searchStatus) {
    query.append('searchStatus', params.searchStatus);
  }

  if (params?.page !== undefined) {
    query.append('page', String(params.page));
  }

  if (params?.pageSize !== undefined) {
    query.append('pageSize', String(params.pageSize));
  }

  const url = `${process.env.API_URL}/dokumen-translok?${query.toString()}`;
  console.log('🔗 Full URL:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
}


export async function getQueryDokumenTranslok(status?: string) {
  const token = cookies().get('token')?.value;
  const mahasiswaId = await getMahasiswaId();

  const response = await fetch(`${process.env.API_URL}/dokumen-translok/status?mahasiswaId=${mahasiswaId}&status=${status}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
}

export async function getQueryStatusRekening(statusRek?: string) {
  const token = cookies().get('token')?.value;
  const mahasiswaId = await getMahasiswaId();

  const response = await fetch(`${process.env.API_URL}/dokumen-translok/statusRekening?mahasiswaId=${mahasiswaId}&statusRek=${statusRek}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
}

export async function putDokumenTranslok(documentId: number, payload: FormData) {
  const token = cookies().get('token')?.value;

  const response = await fetch(`${process.env.API_URL}/dokumen-translok/${documentId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: payload,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
}

export async function confirmDokumenTranslok(
  mahasiswaId: number,
  payload: { id : number; status: 'disetujui' | 'dikembalikan'; catatan?: string }
) {
  const token = cookies().get('token')?.value;

  if (!token) {
    throw new Error('Token tidak ditemukan');
  }

  const response = await fetch(`${process.env.API_URL}/dokumen-translok/confirm/${mahasiswaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Gagal mengirim data konfirmasi');
  }

  return response.json();
}

export async function confirmRekening(
  mahasiswaId: number,
  payload: { status: 'disetujui' | 'dikembalikan'; catatan?: string }
) {
  const token = cookies().get('token')?.value;

  if (!token) {
    throw new Error('Token tidak ditemukan');
  }

  const response = await fetch(`${process.env.API_URL}/dokumen-translok/confirm2/${mahasiswaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Gagal mengirim data konfirmasi');
  }

  return response.json();
}