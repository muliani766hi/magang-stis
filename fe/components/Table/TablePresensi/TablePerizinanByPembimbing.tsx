'use client'

import { ActionIcon, Badge, Button, Grid, GridCol, Group, Stack, Text, TextInput } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'
import { IconCheck, IconDownload, IconEdit, IconEye, IconTrash, IconX } from '@tabler/icons-react'
import { closeModal, openConfirmModal, openModal } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { DateInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { getToken } from '@/utils/get-profile'
import { putSetujuPerizinan, putTolakPerizinan } from '@/utils/presensi'

export interface RecordPerizinan {
    id: number
    tanggal: string
    mahasiswa: {
        nim: string
        nama: string

    }
    jenisIzin: string
    keterangan: string
    status: string
    fileBukti: []
}

const getFileBukti = async (laporan: string[]) => {
    if (typeof window === 'undefined') {
        // This code is running on the server
        console.error('window is not defined');
        return;
    }

    try {
        const token = await getToken()

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/presensi/izin-presensi/download/${laporan}`, {
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

const TablePerizinanByPembimbing
    = ({ records, loading, fetchData }: { records: RecordPerizinan[], loading: boolean, fetchData: () => void }) => {
        const PAGE_SIZES = [10, 15, 20];
        // console.log(records)

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

        return (
            <>
                <DataTable
                    fetching={loading}
                    style={{ minHeight: recordsPaged.length > 0 ? '0' : '180px' }}  
                    columns={[
                        { accessor: 'id', title: 'ID', textAlign: 'center', hidden: true },
                        { accessor: 'index', title: 'No', textAlign: 'center', width: 40, render: (record) => records.indexOf(record) + 1 },
                        { accessor: 'tanggal', title: 'Tanggal', textAlign: 'left', render: ({ tanggal }) => new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                        { accessor: 'mahasiswa.nim', title: 'NIM', textAlign: 'left' },
                        { accessor: 'mahasiswa.nama', title: 'Nama', textAlign: 'left' },
                        { accessor: 'jenisIzin', title: 'Jenis Izin', textAlign: 'left' },
                        { accessor: 'keterangan', title: 'Keterangan', textAlign: 'left' },
                        {
                            accessor: 'fileBukti', title: 'Bukti', textAlign: 'left',
                            render: (record) => (
                                record.fileBukti !== null ? (
                                    <Button
                                        size='xs'
                                        variant="filled"
                                        color="blue"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent the click from selecting the option

                                            getFileBukti(record.fileBukti);
                                        }}
                                        leftSection={< IconDownload size={16} />}
                                        title={String(record.fileBukti)}
                                    >
                                        {record.fileBukti.slice(0, 10)}...
                                    </Button>
                                ) : (
                                    <Text fs="italic" size='xs'>Belum ada file</Text>
                                )
                            )
                        },
                        { accessor: 'status', title: 'Status', textAlign: 'center', render: (record) => <Badge color={record.status === 'Disetujui' ? 'green' : record.status === 'Ditolak' ? 'red' : 'gray'}>{record.status}</Badge> },

                        {
                            accessor: 'action', title: 'Aksi', textAlign: 'center', width: 100,
                            render: (record) => (
                                <Group>
                                    <ActionIcon
                                        onClick={() => showModal({ record, action: 'setuju', fetchData })}
                                        title='Setujui'
                                        color='green'
                                        variant='subtle'
                                    >
                                        <IconCheck />
                                    </ActionIcon>
                                    <ActionIcon
                                        onClick={() => showModal({ record, action: 'tolak', fetchData })}
                                        title='Tolak'
                                        color='red'
                                        variant='subtle'
                                    >
                                        <IconX />
                                    </ActionIcon>
                                </Group>
                            )
                        }


                    ]}
                    withRowBorders={false}
                    withColumnBorders={false}
                    highlightOnHover

                    records={recordsPaged}
                    totalRecords={records.length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={setPage}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    pinLastColumn
                />
            </>
        )
    }


const showModal = ({ record, action, fetchData }: { record: RecordPerizinan; action: 'setuju' | 'tolak'; fetchData: () => void }) => {

    if (action === 'setuju') {
        openConfirmModal({
            centered: true,
            children: (
                <Text size="sm">
                    Apakah anda yakin ingin menyetujui perizinan mahasiswa {record.mahasiswa.nama}?
                </Text>
            ),
            labels: { confirm: 'Ya', cancel: 'Tidak' },
            cancelProps: { variant: 'light', color: 'gray' },
            confirmProps: { variant: 'light', color: 'green' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => {
                putSetujuPerizinan(record.id) // Assuming `record.id` is the parameter required by `putSetujuPerizinan`
                    .then(() => {
                        console.log('setuju');
                        notifications.show({
                            title: 'Berhasil',
                            message: 'Perizinan berhasil disetujui',
                            color: 'green',
                        });
                        fetchData(); // Refresh data to reflect changes
                    })
                    .catch((error) => {
                        notifications.show({
                            title: 'Gagal',
                            message: error.message || 'Terjadi kesalahan saat menyetujui perizinan',
                            color: 'red',
                        });
                    });
            }
        });
    }
    else if (action === 'tolak') {
        openConfirmModal({
            centered: true,
            children: (

                <Text size="sm">
                    Apakah anda yakin ingin menolak perizinan mahasiswa {record.mahasiswa.nama}?
                </Text>
            ),
            labels: { confirm: 'Ya', cancel: 'Tidak' },
            cancelProps: { variant: 'light', color: 'gray' },
            confirmProps: { variant: 'light', color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => {
                putTolakPerizinan(record.id) // Assuming `record.id` is the parameter required by `putSetujuPerizinan`
                    .then(() => {
                        console.log('setuju');
                        notifications.show({
                            title: 'Berhasil',
                            message: 'Perizinan berhasil ditolak',
                            color: 'green',
                        });
                        fetchData(); // Refresh data to reflect changes
                    })
                    .catch((error) => {
                        notifications.show({
                            title: 'Gagal',
                            message: error.message || 'Terjadi kesalahan saat menolak perizinan',
                            color: 'red',
                        });
                    });
            }
        });
    }

    // if (action === 'view') {
    //     openModal({
    //         modalId: action,
    //         title: 'Lihat Detail Bimbingan Skripsi',
    //         children: (
    //             <Stack>
    //                 <TextInput label='mahasiswa.NIM' value={record.mahasiswa.nim} readOnly />
    //                 <TextInput label='mahasiswa.Nama' value={record.mahasiswa.nama} readOnly />
    //                 <DateInput label='Tanggal' value={new Date(record.tanggal)} readOnly />
    //                 <TextInput label='Deskripsi' value={record.deskripsi} readOnly />
    //                 <TextInput label='Status' value={record.status} readOnly />

    //                 <Button onClick={() => closeModal(action)}>Tutup</Button>
    //             </Stack>
    //         ),
    //     });

    // } else if (action === 'edit') {
    //     const FormComponent = () => {
    //         const form = useForm({
    //             initialValues: {
    //                 id: record.id,
    //                 mahasiswa.nim: record.mahasiswa.nim,
    //                 mahasiswa.nama: record.mahasiswa.nama,
    //                 tanggal: new Date(record.tanggal),
    //                 deskripsi: record.deskripsi,
    //                 status: record.status
    //             }

    //         });

    //         // Rest of the code...

    //         return (
    //             <form onSubmit={form.onSubmit((values) => { console.log(values) })}>
    //                 <Stack>
    //                     <TextInput label='mahasiswa.NIM' {...form.getInputProps('mahasiswa.nim')} readOnly />
    //                     <TextInput label='mahasiswa.Nama' {...form.getInputProps('mahasiswa.nama')} readOnly />
    //                     <DateInput label='Tanggal' {...form.getInputProps('tanggal')} />
    //                     <TextInput label='Deskripsi' {...form.getInputProps('deskripsi')} />

    //                     <Group justify='right'>
    //                         <Button
    //                             type='submit'
    //                             color='red'
    //                             variant='light'
    //                             onClick={() => {
    //                                 form.setValues({ status: 'Ditolak' });
    //                                 closeModal(action)
    //                             }}>Tolak</Button>
    //                         <Button
    //                             type='submit'
    //                             color='blue'
    //                             variant='light'
    //                             onClick={() => {
    //                                 form.setValues({ status: 'Disetujui' });
    //                                 closeModal(action)
    //                             }}>Setuju</Button>
    //                     </Group>
    //                 </Stack >
    //             </form >
    //         );
    //     };

    //     openModal({
    //         modalId: action,
    //         title: 'Konfirmasi Bimbingan Skripsi',
    //         children: (
    //             <FormComponent />
    //         ),
    //     });
    // } else if (action === 'delete') {
    //     openModal({
    //         modalId: action,
    //         title: 'Hapus Data Bimbingan Skripsi',
    //         children: (
    //             <Stack>
    //                 <Text>Apakah anda yakin ingin menghapus jadwal bimbingan ini?</Text>
    //                 <Grid gutter="md">
    //                     <GridCol span={2}>mahasiswa.NIM</GridCol>
    //                     <GridCol span={10}>{record.mahasiswa.nim}</GridCol>
    //                     <GridCol span={2}>mahasiswa.Nama</GridCol>
    //                     <GridCol span={10}>{record.mahasiswa.nama}</GridCol>
    //                 </Grid>
    //                 <Group justify="right">
    //                     <Button color='gray' variant='light' onClick={() => closeModal(action)}>Batal</Button>
    //                     <Button color='red' variant='light' onClick={() => closeModal(action)}>Hapus</Button>
    //                 </Group>
    //             </Stack>
    //         ),
    //     });
    // }
};


export default TablePerizinanByPembimbing
