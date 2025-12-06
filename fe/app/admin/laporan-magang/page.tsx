'use client'
import { Button, Card, Group, NumberInput, Select, SimpleGrid, Stack, Text, TextInput, rem } from '@mantine/core'
import { DateInput } from '@mantine/dates'

import React, { useEffect, useRef, useState } from 'react'
import { IconUpload } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { FileWithPath } from '@mantine/dropzone'
import TableLaporan from '@/components/Table/TableLaporan/TableLaporan'
import { useDisclosure } from '@mantine/hooks'
import { getAllLaporan } from '@/utils/laporan'

const LaporanMagang = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await getAllLaporan();
            let modifiedData = response.data.map((item: { laporanId: any; }) => ({
                ...item,
                id: item.laporanId,  // Add the `id` field using `laporanId`
            }));
            modifiedData = modifiedData.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
            console.log(modifiedData);
            setData(modifiedData);
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
            <Text c="dimmed" mb="md">Laporan Magang</Text>

            <TableLaporan records={data} loading={loading} fetchData={fetchData} />

        </>
    )
}

export default LaporanMagang