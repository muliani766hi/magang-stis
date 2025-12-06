'use client';

import { Button, Group, Text } from '@mantine/core'
import React from 'react'
import TableUnitKerjaMahasiswa from '@/components/Table/TableUnitKerja/TableUnitKerjaMahasiswa'
import { RecordUnitKerja } from '@/components/Table/TableUnitKerja/TableUnitKerjaMahasiswa'
import { IconFileImport, IconPlus } from '@tabler/icons-react'
import { getUnitKerja } from '@/utils/unit-kerja';



const UnitKerja = () => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchData = async () => {
        // const response = await fetch('/api/penempatan-magang/unit-kerja');
        // const res = await response.json();
        // // Update your state with the new data

        const response = await getUnitKerja();

        let modifiedData = response.data.map((item: { satkerId: any; }) => ({
            ...item,
            id: item.satkerId,  // Add the `id` field using `unitKerjaId`
        }));

        // get the firts array of kapasitas
        modifiedData = modifiedData.map((item: { kapasitas: any; }) => ({
            ...item,
            kapasitas: item.kapasitas[0]
        }));
        console.log(modifiedData);
        setData(modifiedData);
        setLoading(false)
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Text c="dimmed" mb="md">Unit Kerja</Text>
            {/* <Group justify='flex-end' mb={10}>
                <Button leftSection={<IconPlus size={14} />}>Tambah</Button>
                <Button leftSection={<IconFileImport size={14} />}>Impor</Button>
            </Group> */}
            <TableUnitKerjaMahasiswa records={data} loading={loading} />
        </>
    )
}

export default UnitKerja