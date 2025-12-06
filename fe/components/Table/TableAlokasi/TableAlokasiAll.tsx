'use client'

import { ActionIcon, Badge, Box, Button, Grid, GridCol, Group, Input, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { closeModal, openModal } from '@mantine/modals';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'

export interface RecordAlokasiAll {
    id: number
    namaMahasiswa: string
    nim: string
    alamat: string
    namaSatker: string
    status: string
}

const PAGE_SIZES = [10, 15, 20];

const TableAlokasiAll = ({ records, loading, fetchData }: { records: RecordAlokasiAll[], loading: boolean, fetchData: () => void }) => {
    // pagination
    const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);

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
        <DataTable
            fetching={loading}
            pinLastColumn
            columns={[
                { accessor: 'id', title: 'No', textAlign: 'right', hidden: true },
                { accessor: 'no', title: 'No', textAlign: 'right', width: 40, render: (record, index) => (page - 1) * pageSize + (index + 1) },
                { accessor: 'namaMahasiswa', title: 'Nama', textAlign: 'left' },
                { accessor: 'nim', title: 'NIM', textAlign: 'left' },
                { accessor: 'alamat', title: 'Alamat', textAlign: 'left' },
                {
                    accessor: 'status',
                    title: 'Status',
                    textAlign: 'left',
                    render: (record) => record.status === 'Diterima' ? (
                        <Badge color='green'>{record.status}</Badge>
                    ) : record.status === 'Ditolak' ? (
                        <Badge color='red'>{record.status}</Badge>
                    ) : (
                        <Badge color='gray'>{record.status}</Badge>
                    )

                },
                { accessor: 'namaSatker', title: 'Unit Kerja', textAlign: 'left' },
                {
                    accessor: 'aksi', title: 'Aksi',
                    textAlign: 'center',
                    width: '0%',
                    render: (record) => (
                        <Group gap={4} justify="right" wrap="nowrap">
                            <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="green"
                                onClick={() => {
                                    showModal({ record, action: 'view' })
                                }}
                            >
                                <IconEye size={16} />
                            </ActionIcon>
                            {/* <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="blue"
                                onClick={() => {
                                    showModal({ record, action: 'edit' })
                                }}
                            >
                                <IconEdit size={16} />
                            </ActionIcon> */}
                            {/* <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="red"
                                onClick={() => {
                                    showModal({ record, action: 'delete' })
                                }}
                            >
                                <IconTrash size={16} />
                            </ActionIcon> */}
                        </Group>
                    ),
                }
            ]}
            records={recordsPaged}

            totalRecords={records.length}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={setPage}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
        />
    )
}

const showModal = ({ record, action }: { record: RecordAlokasiAll; action: 'view' | 'edit' | 'delete' }) => {

    if (action === 'view') {
        openModal({
            modalId: action,
            title: 'Lihat tempat magang',
            children: (
                <Stack>
                    <TextInput label="Nama" value={record.namaMahasiswa} readOnly />
                    <TextInput label="NIM" value={record.nim} readOnly />
                    <TextInput label="Alamat" value={record.alamat} readOnly />
                    <TextInput label="Status" value={record.status} readOnly />
                    <TextInput label="Pilihan" value={record.namaSatker} readOnly />



                    {/* <Grid gutter="md">
                        <GridCol span={2}>NIM</GridCol>
                        <GridCol span={10}>{record.nim}</GridCol>
                        <GridCol span={2}>Name</GridCol>
                        <GridCol span={10}>{record.nama}</GridCol>
                        <GridCol span={2}>Kelas</GridCol>
                        <GridCol span={10}>{record.kelas}</GridCol>
                        <GridCol span={4}>Pembimbing Lapangan</GridCol>
                        <GridCol span={6}>{record.pembimbing_lapangan}</GridCol>
                        <GridCol span={4}>Dosen Pembimbing</GridCol>
                        <GridCol span={6}>{record.dosen_pembimbing}</GridCol>
                        <GridCol span={2}>Tempat Magang</GridCol>
                        <GridCol span={10}>{record.tempat_magang}</GridCol>
                        <GridCol span={2}>Alamat</GridCol>
                        <GridCol span={10}>{record.alamat}</GridCol>
                    </Grid> */}
                    <Button onClick={() => closeModal(action)}>Tutup</Button>
                </Stack>
            ),
        });

    } else if (action === 'edit') {
        const FormComponent = () => {
            const form = useForm({
                initialValues: {
                    namaMahasiswa: record.namaMahasiswa,
                    nim: record.nim,
                    alamat: record.alamat,
                    namaSatker: record.namaSatker,
                }
            });

            // Rest of the code...

            return (
                <form onSubmit={form.onSubmit((values) => { console.log(values) })}>
                    <Stack>
                        <TextInput label="Nama" {...form.getInputProps('namaMahasiswa')} />
                        <TextInput label="NIM" {...form.getInputProps('nim')} />
                        <TextInput label="Alamat" {...form.getInputProps('alamat')} />
                        <TextInput label="Pilihan" {...form.getInputProps('namaSatker')} />

                        <Group justify="right">
                            <Button type='submit' color='blue' variant='light' onClick={() => closeModal(action)}>Setujui</Button>
                            <Button color='red' variant='light' onClick={() => closeModal(action)}>Tolak</Button>
                            <Button color='gray' variant='light' onClick={() => closeModal(action)}>Batal</Button>
                        </Group>
                    </Stack>
                </form>
            );
        };

        openModal({
            modalId: action,
            title: 'Edit tempat magang',
            children: (
                <FormComponent />
            ),
        });
    } else if (action === 'delete') {
        openModal({
            modalId: action,
            title: 'Hapus tempat magang',
            children: (
                <Stack>
                    <Text>Apakah anda yakin ingin menghapus tempat magang ini?</Text>
                    <Grid gutter="md">
                        <GridCol span={2}>NIM</GridCol>
                        <GridCol span={10}>{record.nim}</GridCol>
                        <GridCol span={2}>Nama</GridCol>
                        <GridCol span={10}>{record.namaMahasiswa}</GridCol>
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


export default TableAlokasiAll