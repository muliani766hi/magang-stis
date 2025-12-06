'use client'
import TablePresensiByPembimbing from '@/components/Table/TablePresensi/TablePresensiByPembimbing'
import TablePerizinanbyPembimbing from '@/components/Table/TablePresensi/TablePerizinanByPembimbing'
import { Tabs, Text } from '@mantine/core'
import { IconClockCheck, IconClockExclamation, IconMailCheck } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { getPerizinan, getPresensiManual, getPresensiNew } from '@/utils/presensi'
import TablePresensiManualByPembimbing from '@/components/Table/TablePresensi/TablePresensiManualByPembimbing'
import TablePresensiNew from '@/components/Table/TablePresensi/TablePresensiNew'


const DaftarPresensi = () => {
    const [presensiData, setPresensiData] = useState<any[]>([])
    const [perizinanData, setPerizinanData] = useState<any[]>([])
    const [presensiManualData, setPresensiManualData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const presensi = await getPresensiNew()
            const perizinan = await getPerizinan()
            const presensiManual = await getPresensiManual()

            let modifiedDataPresensi = presensi.data.map((item: { mahasiswaId: any; }) => ({
                ...item,
                id: item.mahasiswaId,  
            }))

            const modifiedDataPerizinan = perizinan.data.map((item: { izinId: any; }) => ({
                ...item,
                id: item.izinId,  
            }));

            const modifiedDataPresensiManual = presensiManual.data.map((item: { presensiManualId: any; }) => ({
                ...item,
                id: item.presensiManualId,
            }));

            setPresensiData(modifiedDataPresensi)
            setPerizinanData(modifiedDataPerizinan)
            setPresensiManualData(modifiedDataPresensiManual)
        } catch (error) {
            console.error("Failed to fetch data", error)
        } finally {
            setLoading(false)
        }
    }

    

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <>
            <Text c="dimmed" mb="md">Daftar Presensi</Text>
            <Tabs variant='outline' defaultValue="presensi">
                <Tabs.List>
                    <Tabs.Tab value="presensi" leftSection={<IconClockCheck width={15} />}>
                        Presensi
                    </Tabs.Tab>
                    <Tabs.Tab value="perizinan" leftSection={<IconMailCheck width={15} />}>
                        Perizinan
                    </Tabs.Tab>
                    <Tabs.Tab value="manual" leftSection={<IconClockExclamation width={15} />}>
                        Presensi Manual
                    </Tabs.Tab>

                </Tabs.List>

                <Tabs.Panel value="presensi">
                    <TablePresensiNew records={presensiData} loading={loading} />
                </Tabs.Panel>

                <Tabs.Panel value="perizinan">
                    <TablePerizinanbyPembimbing records={perizinanData} loading={loading} fetchData={fetchData} />
                </Tabs.Panel>
                <Tabs.Panel value="manual">
                    <TablePresensiManualByPembimbing records={presensiManualData} loading={loading} fetchData={fetchData} />
                </Tabs.Panel>
            </Tabs>

        </>
    )
}

export default DaftarPresensi