'use client'

import TableRekening from "@/components/Table/TableRekening/TableRekening"
import { Button, Group, Text } from "@mantine/core"
import { IconFileExport } from "@tabler/icons-react"
import { getDokumenTranslok } from '@/utils/rekening';
import * as XLSX from 'xlsx';
import { getAllMahasiswa } from "@/utils/kelola-user/mahasiswa";

const Rekening = () => {
          
    const handleExport = async () => {
        const res = await getAllMahasiswa();
       
        const data = res.data.map((item: any) => ({
            NIM: item.nim,
            Nama: item.nama,
            Kelas: item.kelas,
            'No Hp': item.noHp,
            Bank: item.bank,
            'Nomor Rekening': item.nomorRekening,
            'Nama di Rekening': item.namaRekening,
            Catatan: item.catatanRek || '',
            Status: item.statusRek || '',
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekening');

        XLSX.writeFile(workbook, `data-rekening-${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    return (
        <>
            <Text size="xl" mb={10}>Rekening</Text>
            <Group justify="flex-start" mb={10} >
                <Button onClick={handleExport} leftSection={<IconFileExport size={14} />}>
                    Ekspor
                </Button>
            </Group>

            <TableRekening />
        </>
    )
}

export default Rekening;
