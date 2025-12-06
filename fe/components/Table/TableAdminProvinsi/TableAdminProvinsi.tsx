'use client'

import { deleteAdminProvinsi, putAdminProvinsi, putAdminProvinsiWithoutPassword } from '@/utils/kelola-user/admin-provinsi';
import { ActionIcon, Button, Grid, GridCol, Group, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { closeModal, openModal } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconEye, IconEdit, IconTrash, IconEyeOff } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'

export interface RecordPemlap {
    id: number
    nama: string
    nip: string
    user: {
        email: string
    }
    provinsi: {
        nama: string
    }
}

const PAGE_SIZES = [10, 15, 20];

const TableAdminProvinsi = ({
  records,
  loading,
  fetchData,
  page,
  pageSize,
  totalRecords,
  setPage,
  setPageSize,
  searchNama,
  searchNIP,
  setSearchNama,
  setSearchNIP,
}: {
  records: RecordPemlap[];
  loading: boolean;
  fetchData: () => void;
  page: number;
  pageSize: number;
  totalRecords: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  searchNama: string;
  searchNIP: string;
  setSearchNama: React.Dispatch<React.SetStateAction<string>>;
  setSearchNIP: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <DataTable
      fetching={loading}
      pinLastColumn
    //   style={{ border: 'none' }}
      withTableBorder
    //   withColumnBorders
      columns={[
        { accessor: 'id', title: 'No', textAlign: 'left', hidden: true },
        {
          accessor: 'no',
          title: 'No',
          textAlign: 'center',
          width: 40,
          render: (_, index) => (page - 1) * pageSize + (index + 1),
        },
        {
          accessor: 'nama',
          title: 'Nama',
          textAlign: 'left',
        },
        {
          accessor: 'nip',
          title: 'NIP',
          textAlign: 'left',
        },
        { accessor: 'user.email', title: 'Email', textAlign: 'left' },
        { accessor: 'provinsi.nama', title: 'Provinsi', textAlign: 'left' },
        {
          accessor: 'aksi',
          title: 'Aksi',
          textAlign: 'center',
          width: '0%',
          render: (record) => (
            <Group gap={4} justify="right" wrap="nowrap">
              <ActionIcon size="sm" variant="subtle" color="green" onClick={() => showModal({ record, action: 'view', fetchData })} title="Lihat">
                <IconEye size={16} />
              </ActionIcon>
              <ActionIcon size="sm" variant="subtle" color="blue" onClick={() => showModal({ record, action: 'edit', fetchData })} title="Ubah">
                <IconEdit size={16} />
              </ActionIcon>
              <ActionIcon size="sm" variant="subtle" color="red" onClick={() => showModal({ record, action: 'delete', fetchData })} title="Hapus">
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ),
        },
      ]}
      records={records}
      totalRecords={totalRecords}
      recordsPerPage={pageSize}
      page={page}
      onPageChange={setPage}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      key={"index"}
    />
  );
};

const showModal = ({ record, action, fetchData }: { record: RecordPemlap; action: 'view' | 'edit' | 'delete' | 'change'; fetchData: () => void }) => {

    if (action === 'view') {
        openModal({
            modalId: action,
            title: 'Lihat Data Admin Provinsi',
            children: (
                <Stack>
                    <TextInput label="Nama" value={record.nama} readOnly />
                    <TextInput label="NIP" value={record.nip} readOnly />
                    <TextInput label="Email" value={record.user.email} readOnly />
                    <TextInput label="Provinsi" value={record.provinsi.nama} readOnly />
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
                    email: record.user.email,
                    kodeProvinsi: record.provinsi.nama,
                    password: '',
                },
                validate: {
                    email: (value) => {
                        if (!value) {
                            return 'Email tidak boleh kosong';
                        }
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
                },
            });

            // Rest of the code...
            const [loadingButton, setLoadingButton] = useState(false);

            return (
                <form onSubmit={form.onSubmit(async (values) => {
                    try {
                        setLoadingButton(true);
                        if (values.password === '') {
                            const response = await putAdminProvinsiWithoutPassword(values);
                        } else {
                            const response = await putAdminProvinsi(values);
                        }


                        // console.log(response);

                        notifications.show({ title: 'Berhasil', message: 'Data Admin Provinsi berhasil diubah', color: 'teal' });
                        closeModal(action);
                        fetchData();
                    } catch (error) {
                        console.error('Failed to update data', error);
                        notifications.show({ title: 'Gagal', message: 'Data Admin Provinsi gagal diubah', color: 'red' });
                    } finally {
                        setLoadingButton(false);
                    }
                })}>
                    <Stack>
                        <TextInput label="Nama" {...form.getInputProps('nama')} />
                        <TextInput label="NIP" {...form.getInputProps('nip')} />
                        <TextInput label="Email" {...form.getInputProps('email')} />
                        {/* <TextInput label="Provinsi" {...form.getInputProps('satker')} /> */}
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

                        <Button
                            loading={loadingButton}
                            type='submit'
                            color='orange'
                            variant='light'>
                            Ubah
                        </Button>
                    </Stack>
                </form>
            );
        };

        openModal({
            modalId: action,
            title: 'Edit Data Admin Provinsi',
            children: (
                <FormComponent />
            ),
        });
    } else if (action === 'delete') {
        openModal({
            modalId: action,
            title: 'Hapus Data Admin Provinsi',
            children: (
                <Stack>
                    <Text>Apakah anda yakin ingin menghapus data Admin Provinsi ini?</Text>

                    <Grid gutter="md">
                        <GridCol span={2}>NIP</GridCol>
                        <GridCol span={10}>{record.nip}</GridCol>
                        <GridCol span={2}>Nama</GridCol>
                        <GridCol span={10}>{record.nama}</GridCol>
                    </Grid>

                    <Group justify="right">
                        <Button color='gray' variant='light' onClick={() => closeModal(action)}>Batal</Button>
                        <Button color='red' variant='light' onClick={async () => {
                            try {
                                const response = await deleteAdminProvinsi(record.id)
                                // console.log(response);

                                notifications.show({ title: 'Berhasil', message: 'Data admin provinsi berhasil dihapus', color: 'teal' });
                                closeModal(action);
                                fetchData();
                            } catch (error) {
                                console.error('Failed to update data', error);
                                notifications.show({ title: 'Gagal', message: 'Data admin provinsi gagal dihapus', color: 'red' });
                            }
                            closeModal(action)
                            closeModal(action)
                        }}>Hapus</Button>
                    </Group>
                </Stack>
            ),
        });
    } else if (action === 'change') {
        const FormComponent = () => {
            const form = useForm({
                initialValues: {
                    nip: "",
                    nama: "",
                    email: "",
                    satker: "",
                },
            });

            // Rest of the code...

            return (
                <form onSubmit={form.onSubmit((values) => { console.log(values) })}>
                    <Stack>
                        <TextInput label="NIP" {...form.getInputProps('nip')} placeholder='Masukkan NIP' withAsterisk required />
                        <TextInput label="Nama" {...form.getInputProps('nama')} placeholder='Masukkan Nama' withAsterisk required />
                        <TextInput label="Email" {...form.getInputProps('email')} placeholder='Masukkan Email' withAsterisk required />
                        <TextInput label="Provinsi" {...form.getInputProps('satker')} placeholder='Masukkan Provinsi' withAsterisk required />

                        <Button type='submit' color='orange' variant='light'>Ganti</Button>
                    </Stack>
                </form>
            );
        };

        openModal({
            modalId: action,
            title: 'Ganti Admin Provinsi',
            children: (
                <FormComponent />
            ),
        });
    }
};


export default TableAdminProvinsi