'use client'
import { ActionIcon, Badge, Button, Chip, Grid, GridCol, Group, Stack, Text, TextInput } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'
import { IconDownload, IconEdit, IconEye, IconFileTypePdf, IconTrash } from '@tabler/icons-react'
import { closeModal, openModal } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { DateInput } from '@mantine/dates'
import { getToken } from '@/utils/get-profile'
import { putUlasanLaporan } from '@/utils/laporan'
import { notifications } from '@mantine/notifications'

export interface RecordLaporan {
    id: number
    mahasiswaId: number
    fileDraftLaporanMagang: string
    tanggal: string
    komentar: string
    ulasan: string
    jumlahPenonton: number
    lokasiPresentasi: string
    metodePresentasi: string
    mahasiswa: {
        nama: string
        nim: string
    }
}

const getFileDraftLaporanMagang = async (laporan: string) => {
    if (typeof window === 'undefined') {
        // This code is running on the server
        console.error('window is not defined');
        return;
    }

    try {
        const token = await getToken()

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/presentasi-laporan-magang/download/${laporan}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        });

        if (!response.ok) throw new Error('Network response was not ok.');

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        // Open the blob URL in a new tab
        const newWindow = window.open(blobUrl, '_blank');
        if (newWindow) {
            newWindow.onload = () => window.URL.revokeObjectURL(blobUrl); // Revoke URL once loaded
        } else {
            // If the browser blocks the pop-up, inform the user
            alert('Please allow pop-ups for this website');
        }
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
}


const PAGE_SIZES = [10, 15, 20];

const TablePresentasiLaporan = ({ records, loading, fetchData }: { records: RecordLaporan[]; loading: boolean; fetchData: () => void }) => {
    // pagination
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    const [page, setPage] = useState(1);
    const [recordsPaged, setRecordsPaged] = useState(records.slice(0, pageSize));

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsPaged(records.slice(from, to));
    }, [page, pageSize, records]);
    // console.log(records)
    return (
        <>
            <DataTable
                fetching={loading}
                style={{ minHeight: recordsPaged.length > 0 ? '0' : '180px' }}  
                // withColumnBorders
                // withTableBorder
                pinLastColumn
                highlightOnHover
                columns={[
                    { accessor: 'id', title: 'ID', textAlign: 'center', hidden: true },
                    { accessor: 'no', title: 'No', textAlign: 'right', width: 40, render: (record, index) => (page - 1) * pageSize + (index + 1) },
                    { accessor: 'mahasiswa.nama', title: 'Nama Mahasiswa', textAlign: 'left' },
                    { accessor: 'mahasiswa.nim', title: 'NIM', textAlign: 'left' },
                    { accessor: 'lokasiPresentasi', title: 'Lokasi', textAlign: 'left' },
                    { accessor: 'jumlahPenonton', title: 'Audiens', textAlign: 'right' },
                    { accessor: 'metodePresentasi', title: 'Metode', textAlign: 'left' },
                    {
                        accessor: 'fileDraftLaporanMagang', title: 'File Laporan', textAlign: 'left',
                        render: (record) => (
                            // <Group>
                            //     <Text>{record.fileDraftLaporanMagang}</Text>
                            //     <ActionIcon
                            //         size="sm"
                            //         variant="subtle"
                            //         color="blue"
                            //         onClick={() => getLaporan(record.fileDraftLaporanMagang)}
                            //     >
                            //         <IconDownload size={16} />
                            //     </ActionIcon>
                            // </Group>
                            <Button
                                size='xs'
                                variant="filled"
                                color="blue"
                                onClick={() =>
                                    // window.open(`${process.env.NEXT_PUBLIC_API_URL}/laporan-magang/download/${record.fileDraftLaporanMagang}`, '_blank')
                                    getFileDraftLaporanMagang(record.fileDraftLaporanMagang)


                                }
                                leftSection={<IconDownload size={16} />}
                            >
                                {record.fileDraftLaporanMagang}
                            </Button>
                        )
                    },
                    { accessor: 'tanggal', title: 'Tanggal', textAlign: 'left', render: ({ tanggal }) => new Date(tanggal).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' }) },
                    // { accessor: 'ulasan', title: 'Komentar', textAlign: 'left' },
                    // {
                    //     accessor: 'aksi', title: 'Aksi',
                    //     textAlign: 'center',
                    //     width: '0%',
                    //     render: (record) => (
                    //         <Group gap={4} justify="right" wrap="nowrap">
                    //             {/* <ActionIcon
                    //                 size="sm"
                    //                 variant="subtle"
                    //                 color="green"
                    //                 onClick={() => {
                    //                     showModal({ record, action: 'view' ,fetchData })
                    //                 }}
                    //             >
                    //                 <IconEye size={16} />
                    //             </ActionIcon> */}
                    //             <ActionIcon
                    //                 size="sm"
                    //                 variant="subtle"
                    //                 color="blue"
                    //                 onClick={() => {
                    //                     showModal({ record, action: 'edit', fetchData })
                    //                 }}
                    //             >
                    //                 <IconEdit size={16} />
                    //             </ActionIcon>
                    //             {/* <ActionIcon
                    //                 size="sm"
                    //                 variant="subtle"
                    //                 color="red"
                    //                 onClick={() => {
                    //                     showModal({ record, action: 'delete' ,fetchData })
                    //                 }}
                    //             >
                    //                 <IconTrash size={16} />
                    //             </ActionIcon> */}
                    //         </Group>
                    //     ),
                    // }
                ]}
                records={recordsPaged}

                totalRecords={records.length}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={setPage}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
            />
        </>
    )
}


const showModal = ({ record, action, fetchData }: { record: RecordLaporan; action: 'view' | 'edit' | 'delete'; fetchData: () => void }) => {

    if (action === 'view') {
        openModal({
            modalId: action,
            title: 'Lihat Detail Bimbingan Skripsi',
            children: (
                <Stack>
                    {/* <TextInput label='NIM' value={record.mahasiswa.nim} readOnly />
                    <TextInput label='Nama' value={record.mahasiswa.nama} readOnly />
                    <DateInput label='Tanggal' value={new Date(record.tanggal)} readOnly />
                    <TextInput label='Deskripsi' value={record.deskripsi} readOnly />
                    <TextInput label='Status' value={record.status} readOnly /> */}

                    <Button onClick={() => closeModal(action)}>Tutup</Button>
                </Stack>
            ),
        });

    } else if (action === 'edit') {
        const FormComponent = () => {
            const form = useForm({
                initialValues: {
                    id: record.id,
                    nim: record.mahasiswa?.nim || '',
                    nama: record.mahasiswa?.nama || '',
                    tanggal: new Date(record.tanggal),
                    lokasiPresentasi: record.lokasiPresentasi || '',
                    jumlahPenonton: record.jumlahPenonton || '',
                    metodePresentasi: record.metodePresentasi || '',
                    fileDraftLaporanMagang: record.fileDraftLaporanMagang,
                    Ulasan: record.ulasan || '',
                }

            });

            return (
                <form onSubmit={form.onSubmit(async (values) => {
                    try {
                        await putUlasanLaporan(values)
                        notifications.show(
                            { title: 'Berhasil', message: 'Data berhasil diubah', color: 'teal' }
                        )
                        closeModal(action)
                        fetchData()
                    } catch (error) {
                        console.error(error)
                        notifications.show(
                            { title: 'Gagal', message: 'Data gagal diubah', color: 'red' }
                        )
                    }
                })}>
                    <Stack>
                        <TextInput variant="filled" label='NIM' {...form.getInputProps('nim')} readOnly />
                        <TextInput variant="filled" label='Nama' {...form.getInputProps('nama')} readOnly />
                        <DateInput variant="filled" label='Tanggal' {...form.getInputProps('tanggal')} readOnly />
                        <TextInput
                            variant="filled"
                            leftSection={<IconFileTypePdf size={20} />}
                            rightSection={<IconDownload size={20} />}

                            label='File Laporan' {...form.getInputProps('fileDraftLaporanMagang')} />
                        <TextInput label='Ulasan' {...form.getInputProps('Ulasan')} />


                        <Group justify='right'>
                            {/* batal button */}

                            <Button
                                color='gray'
                                variant='light'
                                onClick={() => {
                                    closeModal(action)
                                }}>Batal</Button>

                            <Button
                                type='submit'
                                color='blue'
                                variant='light'
                                onClick={() => {
                                }}>Simpan</Button>
                        </Group>
                    </Stack >
                </form >
            );
        };

        openModal({
            modalId: action,
            title: 'Detail Laporan Magang',
            children: (
                <FormComponent />
            ),
        });
    } else if (action === 'delete') {
        openModal({
            modalId: action,
            title: 'Hapus Data Bimbingan Skripsi',
            children: (
                <Stack>
                    <Text>Apakah anda yakin ingin menghapus jadwal bimbingan ini?</Text>
                    <Grid gutter="md">
                        <GridCol span={2}>NIM</GridCol>
                        <GridCol span={10}>{record.mahasiswa.nim}</GridCol>
                        <GridCol span={2}>Nama</GridCol>
                        <GridCol span={10}>{record.mahasiswa.nama}</GridCol>
                    </Grid>
                    <Group justify="right">
                        <Button color='gray' variant='light' onClick={() => closeModal(action)}>Batal</Button>
                        <Button color='red' variant='light' onClick={() => closeModal(action)}>Hapus</Button>
                    </Group>
                </Stack>
            ),
        });
    }
};


export default TablePresentasiLaporan