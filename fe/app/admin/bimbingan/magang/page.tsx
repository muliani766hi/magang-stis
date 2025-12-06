"use client"
import { ActionIcon, Box, Button, Card, Group, Modal, MultiSelect, Select, Stack, Text, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { DateInput } from '@mantine/dates';
import { IconPlus, IconSelectAll } from '@tabler/icons-react'
import TableBimbinganMagang, { RecordBimbinganMagang } from '@/components/Table/TableBimbinganMagang/TableBimbinganMagang';
import { stat } from 'fs';
import { getBimbinganMagang, postBimbinganMagangByDosen } from '@/utils/bimbingan-magang';
import { useEffect, useRef, useState } from 'react';
import { getAllMahasiswa } from '@/utils/kelola-user/mahasiswa';
import { notifications } from '@mantine/notifications';


const BimbinganMagang = () => {
    const [data, setData] = useState([]);
    const [dataMahasiswa, setDataMahasiswa] = useState<{ value: string; label: string; }[]>([]);
    const [loading, setLoading] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);
    const submitButtonRef = useRef(null);

    const fetchData = async () => {
        try {
            const response = await getBimbinganMagang();
            const response2 = await getAllMahasiswa();

            let modifiedData = response.data.map((item: { bimbinganId: any; }) => ({
                ...item,
                id: item.bimbinganId,  // Add the `id` field using `bimbinganId`
            }));
            // sort by tanggal
            modifiedData = modifiedData.sort((a: { tanggal: string; }, b: { tanggal: string; }) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
            // console.log(modifiedData);
            setData(modifiedData);

            let modifiedDataMahasiswa = response2.data.map((item: { mahasiswaId: any; nama: any; }) => ({
                value: String(item.mahasiswaId),
                label: item.nama
            }));

            // console.log(modifiedDataMahasiswa);

            setDataMahasiswa(modifiedDataMahasiswa);

        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    return (
        <>
            <Text c="dimmed" mb="md">Bimbingan Magang</Text>

            <TableBimbinganMagang records={data} loading={loading} fetchData={fetchData} />

        </>
    );
}

export default BimbinganMagang