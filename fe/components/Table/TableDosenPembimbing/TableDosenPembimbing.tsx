'use client'

import { putAssignMahasiswaToDosen, putDosenPembimbing, putDosenPembimbingWihoutPassword, putUnassignMahasiswaToDosen } from '@/utils/kelola-user/dosen-pembimbing';
import { ActionIcon, Button, Grid, GridCol, Group, MultiSelect, Pill, Select, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { closeModal, openModal } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconEyeOff, IconSearch, IconSelectAll, IconX } from '@tabler/icons-react';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'

export interface RecordDosbing {
    id: number
    nama: string
    nip: string
    email: string
    dosenId: number
    prodi: string
    user: {
        userId: number
        email: string
    }

}

const PAGE_SIZES = [10, 15, 20];

const TableDosenPembimbing = ({
    records,
    loading,
    fetchData,
    dataMahasiswa,
    dataMahasiswaFull,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalRecords,
    searchNama,
    setSearchNama,
    searchNIP,
    setSearchNIP,
}: {
    records: RecordDosbing[]
    loading: boolean
    fetchData: () => void
    dataMahasiswa: { value: string; label: string }[]
    dataMahasiswaFull: any[]
    page: number
    setPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    totalRecords: number
    searchNama: string
    setSearchNama: (val: string) => void
    searchNIP: string
    setSearchNIP: (val: string) => void
}) => {

    return (
        <DataTable
            fetching={loading}
            withTableBorder
            // withColumnBorders
            pinLastColumn
            columns={[
                { accessor: 'id', title: 'No', textAlign: 'right', hidden: true },
                { accessor: 'no', title: 'No', textAlign: 'center', width: 40, render: (record, index) => (page - 1) * pageSize + (index + 1) },
                {
                    accessor: 'nama', title: 'Nama', textAlign: 'left',
                },
                {
                    accessor: 'nip', title: 'NIP', textAlign: 'left',
                },
                { accessor: 'email', title: 'Email', textAlign: 'left' },
                {
                    accessor: 'mahasiswa', title: 'Mahasiswa', textAlign: 'left',
                    render: (record) => {
                        // Filter data mahasiswa by pemlapId
                        const dataMahasiswaFiltered = dataMahasiswaFull.filter((item: any) => item.dosenId === record.id);

                        return (
                            <>
                                <Stack gap={'xs'}>
                                    {dataMahasiswaFiltered.map((item: any, index: number) => (
                                        <Pill size='xs' key={index}>{item.nama}</Pill>
                                    ))}
                                </Stack>
                            </>
                        );
                    }
                },
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
                                    showModal({ record, action: 'view', fetchData, dataMahasiswa, dataMahasiswaFull })
                                }}
                                title="Lihat"
                            >
                                <IconEye size={16} />
                            </ActionIcon>
                            <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="blue"
                                onClick={() => {
                                    showModal({ record, action: 'edit', fetchData, dataMahasiswa, dataMahasiswaFull })
                                }}
                                title='Ubah'
                            >
                                <IconEdit size={16} />
                            </ActionIcon>
                            {/* <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="red"
                                onClick={() => {
                                    showModal({ record, action: 'delete', fetchData })
                                }}
                                title='Hapus'
                            >
                                <IconTrash size={16} />
                            </ActionIcon> */}
                        </Group>
                    ),
                }
            ]}
            records={records}
            style={{ minHeight: records.length > 0 ? '0' : '180px' }}  
            totalRecords={totalRecords}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={setPage}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
        />
    )
}

const showModal = ({ record, action, fetchData, dataMahasiswa, dataMahasiswaFull }: { record: RecordDosbing; action: 'view' | 'edit' | 'delete'; fetchData: () => void; dataMahasiswa: { value: string; label: string; }[], dataMahasiswaFull: any[] }) => {
    // filter data mahasiswa by pemlapId
    const dataMahasiswaFiltered = dataMahasiswaFull.filter((item: any) => item.dosenId === record.id).map((item: any) => {
        return {
            value: String(item.mahasiswaId),
            label: item.nama
        }
    });

    if (action === 'view') {
        openModal({
            modalId: action,
            title: 'Lihat Data Dosen Pembimbing',
            children: (
                <Stack>
                    <TextInput label="NIP" value={record.nip} readOnly />
                    <TextInput label="Nama" value={record.nama} readOnly />
                    <TextInput label="Email" value={record.email} readOnly />
                    <Button onClick={() => closeModal(action)}>Tutup</Button>
                </Stack>
            ),
        });

    } else if (action === 'edit') {
        const FormComponent = () => {
            const [visible, setVisible] = useState(false);

            const form = useForm({
                initialValues: {
                    id: record.id,
                    nip: record.nip,
                    nama: record.nama,
                    prodi: record.prodi,
                    email: record.email,
                    password: '',
                    mahasiswaBimbingan: dataMahasiswaFiltered.map((item: { value: string; }) => item.value),
                    mahasiswaBimbinganFull: dataMahasiswaFiltered.map((item: { value: string; }) => item.value),
                },
                validate: {
                    email: (value) => {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            return 'Alamat email tidak valid';
                        }
                    },
                    password: (value) => {
                        if (value.length < 8 && value.length > 0) {
                            return 'Password minimal 8 karakter';
                        }
                    },
                }
            });

            const [loadingButton, setLoadingButton] = useState(false);
            // Rest of the code...

            return (
                <form onSubmit={form.onSubmit(async (values) => {
                    try {
                        setLoadingButton(true);

                        if (values.password === '') {
                            const response = await putDosenPembimbingWihoutPassword(values);
                        } else {
                            const response = await putDosenPembimbing(values);
                        }
                        // console.log(response);

                        await putAssignMahasiswaToDosen(values)
                        await putUnassignMahasiswaToDosen(values)

                        notifications.show({ title: 'Berhasil', message: 'Data dosen pembimbing berhasil diubah', color: 'teal' });
                        closeModal(action);
                        fetchData();
                    } catch (error) {
                        console.error('Failed to update data', error);
                        notifications.show({ title: 'Gagal', message: 'Data dosen pembimbing gagal diubah', color: 'red' });
                    } finally {
                        setLoadingButton(false);
                    }

                })}>
                    <Stack>
                        <TextInput label="NIP" {...form.getInputProps('nip')} />
                        <TextInput label="Nama" {...form.getInputProps('nama')} />
                        {/* <TextInput label="Prodi" {...form.getInputProps('prodi')} /> */}
                        <Select
                            label="Prodi"
                            placeholder="Pilih Prodi"
                            data={[
                                { value: 'DIII ST', label: 'DIII ST' },
                                { value: 'DIV ST', label: 'DIV ST' },
                                { value: 'DIV KS', label: 'DIV KS' },
                            ]}
                            searchable
                            clearable
                            {...form.getInputProps('prodi')}
                        />
                        <TextInput label="Email" {...form.getInputProps('email')} />
                        {/* <TextInput label="Password" {...form.getInputProps('password')} /> */}
                        <TextInput
                            label="Password"
                            type={visible ? 'text' : 'password'}
                            rightSection={
                                <ActionIcon onClick={() => setVisible((v) => !v)} variant="subtle">
                                {visible ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                                </ActionIcon>
                            }
                            {...form.getInputProps('password')}
                        />
                        <MultiSelect
                            label='Mahasiswa Bimbingan'
                            placeholder='Pilih mahaasiswa'
                            // select all icon
                            leftSection={
                                <ActionIcon
                                    title='Pilih semua mahasiswa'
                                    variant="subtle"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        form.setFieldValue('mahasiswaBimbingan', dataMahasiswa.map((item: { value: string; }) => item.value))
                                    }}
                                >
                                    <IconSelectAll size={14} />
                                </ActionIcon>}
                            data={dataMahasiswa}
                            // select all button
                            searchable
                            clearable
                            {...form.getInputProps('mahasiswaBimbingan')}
                        />

                        <Button
                            loading={loadingButton}
                            type='submit' color='orange' variant='light'>Ubah</Button>
                    </Stack>
                </form>
            );
        };

        openModal({
            modalId: action,
            title: 'Edit Data Dosen Pembimbing',
            closeOnClickOutside: false,
            children: (
                <FormComponent />
            ),
        });
    } else if (action === 'delete') {
        openModal({
            modalId: action,
            title: 'Hapus Data Dosen Pembimbing',
            children: (
                <Stack>
                    <Text>Apakah anda yakin ingin menghapus data dosen pembimbing ini?</Text>
                    <Grid gutter="md">
                        <GridCol span={2}>NIP</GridCol>
                        <GridCol span={10}>{record.nip}</GridCol>
                        <GridCol span={2}>Nama</GridCol>
                        <GridCol span={10}>{record.nama}</GridCol>
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


export default TableDosenPembimbing