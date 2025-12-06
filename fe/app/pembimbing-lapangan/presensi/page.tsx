'use client'
import TablePresensiByPembimbing, { RecordPresensiAll } from '@/components/Table/TablePresensi/TablePresensiByPembimbing'
import TablePerizinanbyPembimbing, { RecordPerizinan } from '@/components/Table/TablePresensi/TablePerizinanByPembimbing'
import { Tabs, Text } from '@mantine/core'
import { IconClockCheck, IconClockExclamation, IconMailCheck } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { getAllMahasiswa } from '@/utils/kelola-user/mahasiswa'
import { getPerizinan, getPresensiManual, getPresensiNew } from '@/utils/presensi'
import TablePresensiManualByPembimbing from '@/components/Table/TablePresensi/TablePresensiManualByPembimbing'
import TablePresensiNew from '@/components/Table/TablePresensi/TablePresensiNew'


// const records2: RecordPerizinan[] = [
//     {
//         id: 1,
//         nim_mahasiswa: '222011610',
//         nama_mahasiswa: 'Rizky Theofilus',
//         alasan_izin: 'Izin Sakit',
//         tanggal: '2023-10-01',
//         status: 'Disetujui'
//     }, {
//         id: 2,
//         nim_mahasiswa: '212011688',
//         nama_mahasiswa: 'Fabian La Wima Vallessy',
//         alasan_izin: 'Izin Sakit',
//         tanggal: '2023-10-01',
//         status: 'Menuggu'
//     }
// ]

const DaftarPresensi = () => {
    const [data, setData] = useState<any[]>([])
    const [data2, setData2] = useState<any[]>([])
    const [data3, setData3] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const response = await getPresensiNew()
            const response2 = await getPerizinan()
            const response3 = await getPresensiManual()

            let modifiedData = response.data.map((item: { mahasiswaId: any; }) => ({
                ...item,
                id: item.mahasiswaId,  // Add the `id` field using `mahasiswaId`
            }))

            const modifiedDataPerizinan = response2.data.map((item: { izinId: any; }) => ({
                ...item,
                id: item.izinId,  // Add the `id` field using `perizinanId`
            }));

            const modifiedDataPresensiManual = response3.data.map((item: { presensiManualId: any; }) => ({
                ...item,
                id: item.presensiManualId,  // Add the `id` field using `presensiManualId`
            }));

            setData(modifiedData)
            setData2(modifiedDataPerizinan)
            setData3(modifiedDataPresensiManual)
            // console.log(data3)

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
                    <TablePresensiNew records={data} loading={loading} />
                </Tabs.Panel>

                <Tabs.Panel value="perizinan">
                    <TablePerizinanbyPembimbing records={data2} loading={loading} fetchData={fetchData} />
                </Tabs.Panel>
                <Tabs.Panel value="manual">
                    <TablePresensiManualByPembimbing records={data3} loading={loading} fetchData={fetchData} />
                </Tabs.Panel>
            </Tabs>

        </>
    )
}

export default DaftarPresensi