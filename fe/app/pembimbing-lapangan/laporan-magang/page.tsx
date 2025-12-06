'use client'
import { Button, Card, Group, NumberInput, Select, SimpleGrid, Stack, Tabs, Text, TextInput, rem } from '@mantine/core'
import { DateInput } from '@mantine/dates'

import React, { useEffect, useRef, useState } from 'react'
import DropZone from './DropZone'
import { IconFileAnalytics, IconPdf, IconPresentation, IconPresentationAnalytics, IconUpload } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { FileWithPath } from '@mantine/dropzone'
import TableLaporan from '@/components/Table/TableLaporan/TableLaporan'
import { useDisclosure } from '@mantine/hooks'
import { getAllLaporan } from '@/utils/laporan'
import TablePresentasiLaporan from '@/components/Table/TableLaporan/TablePresentasiLaporan'
import { getAllPresentasiLaporan } from '@/utils/presentasi-laporan'

const LaporanMagang = () => {
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await getAllPresentasiLaporan();

            let modifiedData = response.data.map((item: { presentasiId: any; }) => ({
                ...item,
                id: item.presentasiId,  // Add the `id` field using `presentasiId`
            }));
            modifiedData = modifiedData.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
            // console.log(modifiedData);
            setData(modifiedData);

            const response2 = await getAllLaporan();

            let modifiedData2 = response2.data.map((item: { laporanId: any; }) => ({
                ...item,
                id: item.laporanId,  // Add the `id` field using `laporanId`
            }));
            modifiedData2 = modifiedData2.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
            // console.log(modifiedData2);
            setData2(modifiedData2);
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
            <Tabs variant='outline' defaultValue="presentasi">
                <Tabs.List>
                    <Tabs.Tab value="presentasi" leftSection={<IconPresentationAnalytics width={15} />}>
                        Presentasi
                    </Tabs.Tab>
                    <Tabs.Tab value="final" leftSection={<IconFileAnalytics width={15} />}>
                        Final
                    </Tabs.Tab>

                </Tabs.List>

                <Tabs.Panel value="presentasi">
                    <TablePresentasiLaporan records={data} loading={loading} fetchData={fetchData} />
                </Tabs.Panel>

                <Tabs.Panel value="final">
                    <TableLaporan records={data2} loading={loading} fetchData={fetchData} />
                </Tabs.Panel>
            </Tabs>

        </>
    )
}

export default LaporanMagang