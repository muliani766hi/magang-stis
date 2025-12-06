'use client'
import { Tabs, Text } from '@mantine/core'
import { IconClockCheck } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { getPresensiNew } from '@/utils/presensi'
import TablePresensiNew from '@/components/Table/TablePresensi/TablePresensiNew'



const DaftarPresensi = () => {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const response = await getPresensiNew()
            let modifiedData = response.data.map((item: { mahasiswaId: any; }) => ({
                ...item,
                id: item.mahasiswaId,  
            }))

            setData(modifiedData)
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

                </Tabs.List>

                <Tabs.Panel value="presensi">
                    <TablePresensiNew records={data} loading={loading} />
                </Tabs.Panel>
            </Tabs>

        </>
    )
}

export default DaftarPresensi