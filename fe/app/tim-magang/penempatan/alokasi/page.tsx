'use client'
import { Text } from '@mantine/core'
import React from 'react'
import TableAlokasi, { RecordAlokasiAll } from '@/components/Table/TableAlokasi/TableAlokasiAll'
import { getAllPemilihanPenempatan } from '@/utils/pemilihan-tempat';


const Alokasi = () => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchData = async () => {
        const response = await getAllPemilihanPenempatan();

        let modifiedData = response.data.map((item: { pilihanSatkerId: any; }) => ({
            ...item,
            id: item.pilihanSatkerId,  // Add the `id` field using `unitKerjaId`
        }));

        setData(modifiedData);
        setLoading(false)
    };

    React.useEffect(() => {
        fetchData();
    }, []);


    return (
        <>
            <Text c="dimmed" mb="md">Daftar Konfirmasi Penempatan</Text>

            <TableAlokasi records={data} loading={loading} fetchData={fetchData} />
        </>
    )
}

export default Alokasi