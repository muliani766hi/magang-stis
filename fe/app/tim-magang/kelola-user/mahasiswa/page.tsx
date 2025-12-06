'use client'
import TableMahasiswa from '@/components/Table/TableMahasiswa/TableMahasiswa'
import { Record } from '@/components/Table/TableMahasiswa/TableMahasiswa';
import { getAllDosenPembimbing } from '@/utils/kelola-user/dosen-pembimbing';
import { getAllMahasiswa, getToken } from '@/utils/kelola-user/mahasiswa';
import { getAllPembimbingLapangan } from '@/utils/kelola-user/pembimbing-lapangan';
import { getUnitKerja } from '@/utils/unit-kerja';
import { Button, Group, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconFileImport } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

const KelolaMahasiswa = () => {
    const [data, setData] = useState([]);
    const [dataDosen, setDataDosen] = useState([]);
    const [dataPemlap, setDataPemlap] = useState([]);
    const [dataSatker, setDataSatker] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await getAllMahasiswa();
            const response2 = await getAllDosenPembimbing();
            const response3 = await getAllPembimbingLapangan();
            const response4 = await getUnitKerja();

            let modifiedData = response.data.map((item: { mahasiswaId: any; }) => ({
                ...item,
                id: item.mahasiswaId,  // Add the `id` field using `mahasiswaId`
            }));
            modifiedData = modifiedData.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
            console.log(modifiedData);
            setData(modifiedData);

            // data dosen for select
            let modifiedDataDosen = response2.data.map((item: { dosenId: any; nama: any; }) => ({
                value: String(item.dosenId),
                label: item.nama
            }));
            setDataDosen(modifiedDataDosen);

            // data pemlap for select
            let modifiedDataPemlap = response3.data.map((item: { pemlapId: any; nama: any; }) => ({
                value: String(item.pemlapId),
                label: item.nama
            }));
            setDataPemlap(modifiedDataPemlap);

            // data satker for select
            let modifiedDataSatker = response4.data.map((item: { satkerId: any; nama: any; }) => ({
                value: String(item.satkerId),
                label: item.nama
            }));
            setDataSatker(modifiedDataSatker);

        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        const token = await getToken();
        console.log(token);
        if (file) {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            // myHeaders.append("Content-Type", "multipart/form-data");

            const formdata = new FormData();
            formdata.append("file", file);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
                // redirect: "follow"
            };

            // console.log(process.env.API_URL)

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mahasiswa/excel`, requestOptions);
                // console.log(await response.json());

                notifications.show(
                    {
                        title: "Berhasil",
                        message: "File berhasil diunggah",
                    }
                )
                fetchData();
            } catch (error) {
                console.error("Failed to upload file", error);
                notifications.show(
                    {
                        title: "Gagal",
                        message: "File gagal diunggah",
                    }
                )

            }
        }
    };

    return (
        <>
            <Text c="dimmed" mb="md">Kelola Mahasiswa</Text>
            <Group mb={10}>
                <Button leftSection={<IconFileImport size={14} />}>
                    <input type="file" accept=".xlsx" onChange={handleFileUpload} style={{ display: 'none' }} id="fileUpload" />
                    <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>Impor</label>
                </Button>
            </Group>
            <TableMahasiswa records={data} loading={loading} fetchData={fetchData} dataDosen={dataDosen} dataPemlap={dataPemlap} dataSatker={dataSatker} />
        </>
    )
}

export default KelolaMahasiswa;
