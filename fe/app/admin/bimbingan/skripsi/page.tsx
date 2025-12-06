"use client"
import { Box, Button, Card, Group, Modal, Stack, Text, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { DateInput } from '@mantine/dates';
import { IconPlus } from '@tabler/icons-react'
import TableBimbinganSkripsi, { RecordBimbinganSkripsi } from '@/components/Table/TableBimbinganSkripsi/TableBimbinganSkripsi';
import { getAllBimbinganSkripsi, getBimbinganSkripsi } from '@/utils/bimbingan-skripsi';
import { getAllMahasiswa } from '@/utils/kelola-user/mahasiswa';
import { useEffect, useState } from 'react';

// const records: RecordBimbinganSkripsi[] =
//     [
//         {
//             id: 1,
//             jenis: 1, // incremental
//             id_mahasiswa: 1,
//             nama: 'Ahmad Affandi',
//             nim: '1234567890',
//             tanggal: '2021-10-10',
//             deskripsi: 'Lorem ipsum dolor sit amet',
//             status: 'Disetujui',
//         },
//         {
//             id: 2,
//             jenis: 2,
//             id_mahasiswa: 2,
//             nama: 'Rico Maldini',
//             nim: '1234567891',
//             tanggal: '2021-10-10',
//             deskripsi: 'Lorem ipsum dolor sit amet',
//             status: 'Menunggu',
//         }
//     ]

const BimbinganSkripsi = () => {

    const [opened, { open, close }] = useDisclosure(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const response = await getAllBimbinganSkripsi();
        const response2 = await getAllMahasiswa();
        const combinedData = response.data.map((bimbingan: { mahasiswaId: any; izinBimbinganId: any; }) => {
            // Find the matching mahasiswa record
            const mahasiswa = response2.data.find((m: { mahasiswaId: any; }) => m.mahasiswaId === bimbingan.mahasiswaId);

            // If a matching mahasiswa is found, add nama and nim to the bimbingan record
            if (mahasiswa) {
                return {
                    ...bimbingan,
                    id: bimbingan.izinBimbinganId,
                    nama: mahasiswa.nama,
                    nim: mahasiswa.nim
                };
            }

            // If no matching mahasiswa is found, return the original bimbingan record
            return bimbingan;
        });
        // console.log(combinedData);
        setData(combinedData);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Text c="dimmed" mb="md">Perizinan Bimbingan Skripsi</Text>
            <TableBimbinganSkripsi records={data} loading={loading} fetchData={fetchData} />
        </>
    );
}

export default BimbinganSkripsi