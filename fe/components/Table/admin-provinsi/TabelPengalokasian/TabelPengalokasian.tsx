'use client'

import { getJarakPenempatan, confirmPenempatan } from '@/utils/pemilihan-tempat';
import { ActionIcon, Badge, Button, Grid, GridCol, Group, Select, Stack, Text, TextInput } from '@mantine/core';
import { closeModal, openModal } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconEye, IconEdit, IconSearch, IconX } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'
import { modals } from '@mantine/modals'
import { useDebouncedValue } from '@mantine/hooks';


const PAGE_SIZES = [10, 15, 20];

// const TabelPengalokasianMahasiswa = ({ records, loading, fetchData, aksesEdit }: { records: any, loading: boolean, fetchData: () => void, aksesEdit: boolean }) => {
const TabelPengalokasianMahasiswa = ({ 
  records, 
  loading, 
  fetchData,
  page,
  pageSize,
  totalRecords,
  setPage,
  setPageSize,
  aksesEdit,
 }: { 
  records: any, 
  loading: boolean, 
  fetchData: () => void,
  page: number;
  pageSize: number;
  totalRecords: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  aksesEdit: boolean 
}) => {    
    return (
        <DataTable
            fetching={loading}
            style={{ minHeight: records.length > 0 ? '0' : '180px' }}  
            pinLastColumn
            withTableBorder
            columns={[
                { accessor: 'no', title: 'No', textAlign: 'center', width: 40, render: (record, index) => (page - 1) * pageSize + (index + 1) },
                {
                    accessor: "nama",
                    title: "Nama",
                },
                {
                    accessor: "alamatWali",
                    title: "Alamat",
                },
                {
                    accessor: "prodi",
                    title: "Prodi",                  
                },
                {
                    accessor: "penempatan",
                    title: "Penempatan",
                    render: (value) => value.penempatan.satker.nama,               
                },
                {
                    accessor: "statusPenempatan",
                    title: "Status",
                    render: (records) => {
                        const status = records.statusPenempatan || "disetujui"; 
                        return (
                            <Badge
                            color={
                                status === "disetujui"
                                ? "grey"
                                : status === "dikonfirmasi"
                                ? "green"
                                : "gray"
                            }
                            >
                            {status}
                            </Badge>
                        );
                    },                           
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
                                    showModal({ record, action: 'view', fetchData })
                                }}
                            >
                                <IconEye size={16} />
                            </ActionIcon>
                            {aksesEdit && (
                            <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="blue"
                                onClick={async () => {
                                    // const result = await getJarakPenempatan(record.mahasiswaId as any)
                                    // console.log('test', result)
                                    // setListPenempatan(result.data)
                                    // setLoadingPenempatan(false)
                                    showModal({ record, action: 'edit', fetchData })
                                }}
                            >
                                <IconEdit size={16} />
                            </ActionIcon>
                            )}
                            {/* <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="red"
                                onClick={() => {
                                    showModal({ record, action: 'delete', fetchData })
                                }}
                            >
                                <IconTrash size={16} />
                            </ActionIcon> */}
                        </Group>
                    ),
                }
            ]}
            records={records}
            key={"index"}
            totalRecords={totalRecords}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={setPage}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
        />
    )
}

const showModal = ({ record, action, fetchData }: { record: any, action: string, fetchData: () => void }) => {

    if (action === 'view') {
        openModal({
            modalId: action,
            title: 'Lihat tempat magang',
            children: (
                <Stack>
                    <TextInput label="Nama" value={record.nama} readOnly />
                    <TextInput label="NIM" value={record.nim} readOnly />
                    <TextInput label="Alamat" value={record.alamat} readOnly />
                    <TextInput label="Status" value={record.statusPenempatan} readOnly />
                    <TextInput label="Penempatan Mahasiswa" value={record.penempatan?.satker.nama ? record.penempatan?.satker.nama : '-'} readOnly />
                    <Button onClick={() => closeModal(action)}>Tutup</Button>
                </Stack>
            ),
        });

    } else if (action === 'edit') {
        const FormComponent = () => {
            const [loading, setLoading] = useState(true)
            const [listJarakPenempatan, setListJarakPenempatan] = useState([])
            const [listPenempatan, setListPenempatan] = useState([])
            const [selectedSatker, setSelectedSatker] = useState('')
            const fetch = async () => {
                const result = await getJarakPenempatan(record.mahasiswaId)
                setListJarakPenempatan(result.data.listJarakTerdekat)
                setListPenempatan(result.data.listPilihanSatker)
                setLoading(false)
            }


            useEffect(() => {
                fetch()
            }, [])

            return (
                <Stack>
                    <TextInput variant="filled" label="Penempatan Mahasiswa" value={record.penempatan?.satker.nama ? record.penempatan?.satker.nama : '-'} readOnly />
                    
                    <Text mt="md" style={{ fontSize: "13px", fontWeight: "bold" }} >Tabel jarak rumah mahasiswa dengan satker dalam provinsi.</Text>
                    <DataTable
                        fetching={loading}
                        // highlightOnHover
                        withTableBorder
                        withColumnBorders
                        records={listJarakPenempatan}
                        key={"index"}
                        style={{ minHeight: listJarakPenempatan.length > 0 ? '0' : '180px' }}  
                        pinLastColumn
                        columns={[
                            {
                                accessor: "kodeSatker",
                                title: "Kode Satker",
                            },
                            {
                                accessor: "nama",
                                title: "SatKer",
                            },
                            {
                                accessor: "provinsi",
                                title: "Provinsi",
                                render: (value: any) => value.provinsi.nama
                            },
                            {
                                accessor: "distance",
                                title: "Jarak",
                                render: (value: any) => `${value.distance} Km`
                            },

                        ]}
                    />
                    <Select
                        allowDeselect={false}
                        label="Pilih Penempatan Mahasiswa"
                        required
                        placeholder="Bisa melihat berdasarkan jarak atau pilihan mahasiswa"
                        data={listPenempatan.map((satker: any) => ({ value: String(satker.satkerId), label: satker.nama }))}
                        value={selectedSatker}
                        onChange={(value: any) => {
                            setSelectedSatker(value);
                        }}
                    />

                    <Group justify="right">
                        <Button
                            type='submit'
                            color='green'
                            variant='light'
                            onClick={() => {
                                closeModal(action)
                                modals.openConfirmModal({
                                    centered: true,
                                    children: <Text size="sm">Apakah pilihan anda telah sesuai ?</Text>,
                                    labels: { confirm: 'Ya', cancel: 'Tidak' },
                                    cancelProps: { variant: 'light', color: 'gray' },
                                    confirmProps: { variant: 'light', color: 'red' },
                                    onCancel: () => {
                                        fetchData()
                                        showModal({ record, action: 'edit', fetchData })
                                    },
                                    onConfirm: async () => {
                                        console.log(record.mahasiswaId, Number(selectedSatker))
                                        await confirmPenempatan(record.mahasiswaId, Number(selectedSatker))
                                        notifications.show(
                                            {
                                                title: 'Berhasil',
                                                message: 'Data penempatan berhasil diubah',
                                            }
                                        ),
                                        fetchData()
                                    }
                                });
                            }}>Konfirmasi</Button>
                    </Group>
                </Stack>
            );
        };

        openModal({
            modalId: action,
            title: 'Konfirmasi Penempatan',
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

const confirmModal = ({ title, message, form, action }: {
    title?: string,
    message: string,
    form: any,
    action: () => void
}) => {
    openModal({
        modalId: "confirm",
        title: title,
        children: (
            <Stack>
                <Text>
                    {message}
                </Text>
            </Stack>
        ),
    });

    // <Button onClick={() => {
    //     modals.openConfirmModal({
    //         title: title,
    //         centered: true,
    //         children: <Text size="sm">{message}</Text>,
    //         labels: { confirm: 'Ya', cancel: 'Tidak' },
    //         cancelProps: { variant: 'light', color: 'gray' },
    //         confirmProps: { variant: 'light', color: 'red' },
    //         onCancel: () => form.reset(),
    //         onConfirm: () => {
    //             action();
    //             form.reset();
    //         }
    //     });
    // }} />
}

export default TabelPengalokasianMahasiswa