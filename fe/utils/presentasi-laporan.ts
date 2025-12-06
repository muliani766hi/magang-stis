'use server'
import { cache } from 'react'
// import 'server-only'
import { cookies } from 'next/headers'
import { getMahasiswaId } from './kegiatan-harian'


export async function getPresentasiLaporan() {
    const token = cookies().get('token')?.value
    const mahasiswaId = await getMahasiswaId()

    const response = await fetch(`${process.env.API_URL}/presentasi-laporan-magang?mahasiswaId=${mahasiswaId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        }
    )


    if (!response.ok) {
        console.log(await response.text())
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function postPresentasiLaporan(values: any) {
    try {
        const token = cookies().get('token')?.value;
        const mahasiswaId = await getMahasiswaId();

        const formdata = new FormData();
        formdata.append('file', values.fileLaporan[0]); // Assuming only one file is selected
        formdata.append('json', JSON.stringify({
            tanggal: values.tanggal,
            jumlahPenonton: values.jumlahPenonton,
            komentar: values.komentar,
            lokasiPresentasi: values.lokasiPresentasi,
            metodePresentasi: values.metodePresentasi,
        }));

        console.log('FormData:', formdata); // Log FormData content

        const response = await fetch(`${process.env.API_URL}/laporan-magang/${mahasiswaId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formdata,
        });

        console.log('Response:', response); // Log response object

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        return response.json();
    } catch (error) {
        console.error('Error posting laporan:', error);
        throw error;
    }
}

export async function getAllPresentasiLaporan() {
    const token = cookies().get('token')?.value

    const response = await fetch(`${process.env.API_URL}/presentasi-laporan-magang?mahasiswaId&tanggal&metodePresentasi`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        }
    )


    if (!response.ok) {
        console.log(await response.text())
        throw new Error('Failed to fetch data')
    }

    return response.json()
}

export async function getFilePresentasiLaporan(laporan: string) {
    if (typeof window === 'undefined') {
        // This code is running on the server
        console.error('window is not defined');
        return;
    }

    try {
        const token = cookies().get('token')?.value;

        const response = await fetch(`${process.env.API_URL}/laporan-magang/download/${laporan}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        });

        if (!response.ok) throw new Error('Network response was not ok.');

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        // Open the blob URL in a new tab
        const newWindow = window.open(blobUrl, '_blank');
        if (newWindow) {
            newWindow.onload = () => window.URL.revokeObjectURL(blobUrl); // Revoke URL once loaded
        } else {
            // If the browser blocks the pop-up, inform the user
            alert('Please allow pop-ups for this website');
        }
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
}

export async function putUlasanPresentasiLaporan(values: any) {
    const token = cookies().get('token')?.value;
    const laporanId = values.id;
    const response = await fetch(`${process.env.API_URL}/laporan-magang/ulas/${laporanId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            ulasan: values.ulasan,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    return response.json();
}