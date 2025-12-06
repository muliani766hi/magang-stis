'use client'

import { ActionIcon, Badge, Button, Grid, GridCol, Group, Stack, Text, TextInput } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'
import { IconChevronRight, IconEdit, IconEye, IconTrash, IconUser } from '@tabler/icons-react'
import { closeModal, openModal } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { DateInput } from '@mantine/dates'
import clsx from 'clsx'
import classes from './NestedTables.module.css'
import { getPresensiByMahasiswaId } from '@/utils/presensi'

export interface RecordPresensiAll {
    id: number
    nim: string
    nama: string
    data_presensi: {
        id: number
        tanggal: string
        waktu_datang: string
        waktu_pulang: string
        status: string
    }[]
}

function PresensiTable({ mahasiswaId }: { mahasiswaId: number }) {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const fetchData = async (mahasiswaId: number) => {
        try {
            const response = await getPresensiByMahasiswaId(mahasiswaId);
            let modifiedData = response.data.map((item: { presensiId: any; }) => ({
                ...item,
                id: item.presensiId,  // Add the `id` field using `presensiId`
            }));

            // sort data by tanggal
            modifiedData.sort((a: { tanggal: string; }, b: { tanggal: string; }) => {
                return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
            });

            setData(modifiedData);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    }
    useEffect(() => {
        fetchData(mahasiswaId);
    }, [mahasiswaId]);

    return (
        <DataTable
            fetching={loading}
            style={{ minHeight: data.length > 0 ? '0' : '180px' }}  
            withColumnBorders
            withTableBorder
            withRowBorders
            columns={[
                {
                    accessor: 'id',
                    title: 'ID Presensi',
                    hidden: true,

                },
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
                    accessor: 'status',
                    title: 'Status',
                    textAlign: 'left',
                    render: ({ status }) => status === 'Tepat Waktu' ? (
                        <Badge color='green' variant='light'>{status}</Badge>
                    ) : status === 'Terlambat' ? (
                        <Badge color='red' variant='light'>{status}</Badge>
                    ) : (
                        <Badge color='gray' variant='light'>{status}</Badge>
                    )
                },
                {
                    accessor: 'durasiJamKerja',
                    title: 'Durasi',
                    textAlign: 'right',
                    render: ({ durasiJamKerja }: any) => {
                        const durasi = durasiJamKerja != null ? durasiJamKerja.toFixed(2) : '0.00';
                        return `${durasi} jam`;
                    }
                }
            ]}

            // onRowClick={(record) => { console.log(expandedPresensiIds) }}
            highlightOnHover

            records={data}
        // totalRecords={record.record.data_presensi.length}
        // recordsPerPage={pageSizeNested}
        // page={pageNested}
        // onPageChange={setPageNested}
        // recordsPerPageOptions={PAGE_SIZES}
        // onRecordsPerPageChange={setPageSizeNested}

        />
    )
}

const TablePresensiByPembimbing = ({ records, loading }: { records: any, loading: boolean }) => {
    const [expandedPresensiIds, setExpandedPresensiIds] = useState<number[]>([]);
    const PAGE_SIZES = [10, 15, 20];

    // console.log(records)

    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [pageSizeNested, setPageSizeNested] = useState(PAGE_SIZES[0]);

    useEffect(() => {
        setPage(1);
        setPageNested(1);
    }, [pageSize, pageSizeNested]);

    const [page, setPage] = useState(1);
    const [recordsPaged, setRecordsPaged] = useState(records.slice(0, pageSize));

    const [pageNested, setPageNested] = useState(1);
    // const [recordsPagedNested, setRecordsPagedNested] = useState(records.slice(0, pageSizeNested));

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsPaged(records.slice(from, to));
    }, [page, pageSize, records]);

    // change name key in 



    return (
        <><DataTable
            fetching={loading}
            style={{ minHeight: recordsPaged.length > 0 ? '0' : '180px' }}  
            highlightOnHover
            columns={[
                {
                    accessor: 'id',
                    title: 'ID Mahasiswa',
                    hidden: true,
                },
                {
                    accessor: 'nama',
                    title: 'Nama Mahasiswa',
                    textAlign: 'left',
                    render: ({ id, nama }) => (
                        <>
                            <IconChevronRight
                                className={clsx(classes.icon, classes.expandIcon, {
                                    [classes.expandIconRotated]: expandedPresensiIds.includes(id),
                                })}
                            />
                            <IconUser className={classes.icon} />
                            <span>{nama}</span>
                        </>
                    ),

                },
                {
                    accessor: 'nim',
                    title: 'NIM',
                    textAlign: 'left'
                }
            ]}

            records={recordsPaged}

            totalRecords={records.length}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={setPage}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}

            rowExpansion={{
                allowMultiple: false,
                expanded: { recordIds: expandedPresensiIds, onRecordIdsChange: setExpandedPresensiIds },
                content: (record) => (
                    <PresensiTable mahasiswaId={record.record.id} />
                )
            }}
        />

        </>
    )
}


const showModal = ({ record, action }: { record: RecordPresensiAll; action: 'view' | 'edit' | 'delete' }) => {

    // if (action === 'view') {
    //     openModal({
    //         modalId: action,
    //         title: 'Lihat Detail Bimbingan Skripsi',
    //         children: (
    //             <Stack>
    //                 <TextInput label='NIM' value={record.nim} readOnly />
    //                 <TextInput label='Nama' value={record.nama} readOnly />
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
    //                 nim: record.nim,
    //                 nama: record.nama,
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
    //                     <GridCol span={10}>{record.nim}</GridCol>
    //                     <GridCol span={2}>Nama</GridCol>
    //                     <GridCol span={10}>{record.nama}</GridCol>
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


export default TablePresensiByPembimbing