'use client'
import TablePresensiByPembimbing, { RecordPresensiAll } from '@/components/Table/TablePresensi/TablePresensiByPembimbing'
import { getAllMahasiswa } from '@/utils/kelola-user/mahasiswa'
import { Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'


const DaftarPresensi = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const response = await getAllMahasiswa()

            let modifiedData = response.data.map((item: { mahasiswaId: any; }) => ({
                ...item,
                id: item.mahasiswaId,  // Add the `id` field using `mahasiswaId`
            }))

            setData(modifiedData)
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch data", error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <Text c="dimmed" mb="md">Daftar Presensi</Text>

            <TablePresensiByPembimbing records={data} loading={loading} />
        </>
    )
}

export default DaftarPresensi