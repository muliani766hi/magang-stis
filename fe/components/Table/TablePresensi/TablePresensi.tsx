'use client'

import { ActionIcon, Badge, Button, Grid, GridCol, Group, Stack, Text, TextInput } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import { closeModal, openModal } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { DateInput } from '@mantine/dates'

export interface RecordPresensi {
    presensiId: number
    tanggal: string
    waktuDatang: string
    waktuPulang: string
    status: string
}

const TablePresensi = ({ records, loading }: { records: RecordPresensi[], loading: boolean }) => {
    const PAGE_SIZES = [5, 10, 20];
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
                style={{ minHeight: recordsPaged.length > 0 ? '0' : '180px' }}  
                fetching={loading}
                columns={[
                    { accessor: 'id', title: 'ID', textAlign: 'center', hidden: true },
                    { accessor: 'presensiId', title: 'ID', textAlign: 'center', hidden: true },
                    { accessor: 'index', title: 'No', textAlign: 'center', width: 40, render: (record) => records.indexOf(record) + 1 },
                    {
                        accessor: 'tanggal', title: 'Tanggal', textAlign: 'left', render: ({ tanggal }) => {
                            const date = new Date(tanggal);
                            date.setHours(date.getHours() - 7); // Subtract 7 hours
                            return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                            // new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                        }
                    },
                    {
                        accessor: 'waktuDatang', title: 'Waktu Datang', textAlign: 'left',
                        render:
                            ({ waktuDatang }) => new Date(waktuDatang).toISOString().slice(11, 19)
                    },
                    {
                        accessor: 'waktuPulang', title: 'Waktu Pulang', textAlign: 'left',
                        render:
                            ({ waktuPulang }) => new Date(waktuPulang).toISOString().slice(11, 19)
                    },
                    {
                        accessor: 'status', title: 'Status', textAlign: 'left',
                        render: ({ status }) => status === 'Tepat Waktu' ? (
                            <Badge color='green' variant='light'>{status}</Badge>
                        ) : status === 'Terlambat' ? (
                            <Badge color='red' variant='light'>{status}</Badge>
                        ) : (
                            <Badge color='gray' variant='light'>{status}</Badge>
                        )
                    },

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
            />
        </>
    )
}


const showModal = ({ record, action }: { record: RecordPresensi; action: 'view' | 'edit' | 'delete' }) => {

    // if (action === 'view') {
    //     openModal({
    //         modalId: action,
    //         title: 'Lihat Detail Bimbingan Skripsi',
    //         children: (
    //             <Stack>
    //                 <TextInput label='NIM' value={record.nim_mahasiswa} readOnly />
    //                 <TextInput label='Nama' value={record.nama_mahasiswa} readOnly />
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
    //                 nim: record.nim_mahasiswa,
    //                 nama: record.nama_mahasiswa,
    //                 tanggal: new Date(record.tanggal),
    //                 deskripsi: record.deskripsi,
    //                 status: record.status
    //             }

    //         });

    //         // Rest of the code...

    //         return (
    //             <form onSubmit={form.onSubmit((values) => { console.log(values) })}>
    //                 <Stack>
    //                     <TextInput label='NIM' {...form.getInputProps('nim')} readOnly />
    //                     <TextInput label='Nama' {...form.getInputProps('nama')} readOnly />
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
    //                     <GridCol span={2}>NIM</GridCol>
    //                     <GridCol span={10}>{record.nim_mahasiswa}</GridCol>
    //                     <GridCol span={2}>Nama</GridCol>
    //                     <GridCol span={10}>{record.nama_mahasiswa}</GridCol>
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


export default TablePresensi