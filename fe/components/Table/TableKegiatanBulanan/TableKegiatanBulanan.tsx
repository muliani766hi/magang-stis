'use client'

import { putKegiatanBulanan } from '@/utils/kegiatan-bulanan'
import { ActionIcon, Button, Box, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { closeModal, openModal } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconEdit } from '@tabler/icons-react'
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'

export interface RecordKegiatanBulanan {
    id?: number
    uraian: string
    tipeKegiatan: {
        satuan: string
    }
    target: number
    realisasi: number
    persentase: number  // is this needed?
    tingkatKualitas: number | null
    keterangan: string
    rekapTipeId: number
}

const PAGE_SIZES = [10, 15, 20];

const TableKegiatanBulanan = ({ 
    records, 
    isLoading, 
    fetchData, 
    // page, 
    // pageSize,  
    // totalRecords, 
    // setPage,  
    // setPageSize 
}: { 
    records: RecordKegiatanBulanan[], 
    isLoading: boolean, 
    fetchData: () => void,
    // page: number, 
    // pageSize: number, 
    // totalRecords: number, 
    // setPage: React.Dispatch<React.SetStateAction<number>>, 
    // setPageSize: React.Dispatch<React.SetStateAction<number>>, 
}) => { 

    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    const [page, setPage] = useState(1);
    const [recordsPaged, setRecordsPaged] = useState(records?.slice(0, pageSize));

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsPaged(records?.slice(from, to));
    }, [page, pageSize, records]);

    return (
        <DataTable
            // minHeight={210}
            style={{ minHeight: records?.length > 0 ? '0' : '210px' }}  
            fetching={isLoading}
            groups={[
                {
                    id: 'id',
                    title: '',
                    style: { borderBottomColor: 'transparent' },
                    columns: [
                        {
                            accessor: 'id',
                            title: (
                                <Text inherit>
                                    No
                                </Text>
                            ),
                            hidden: true,
                            textAlign: 'right'
                        },
                    ]
                },

                {
                    id: 'no',
                    title: '',
                    style: { borderBottomColor: 'transparent' },
                    columns: [
                        {
                            accessor: 'index',
                            title: (
                                <Text inherit>
                                    No
                                </Text>
                            ),
                            textAlign: 'center',
                            width: 40,
                            render: (record) => records?.indexOf(record) + 1,
                        },
                    ]
                },

                {
                    id: 'uraian',
                    title: '',
                    style: { borderBottomColor: 'transparent' },
                    columns: [
                        {
                            accessor: 'uraian',
                            title: (
                                <Text inherit>
                                    Uraian Kegiatan
                                </Text>
                            ),
                            textAlign: 'left'
                        }
                    ]
                },

                {
                    id: 'satuan',
                    title: '',
                    style: { borderBottomColor: 'transparent' },
                    columns: [
                        {
                            accessor: 'tipeKegiatan.satuan',
                            title: (
                                <Text inherit>
                                    Satuan
                                </Text>
                            ),
                            textAlign: 'left'
                        }
                    ]
                },

                {
                    id: 'kuantitas',
                    title: 'Kuantitas',
                    textAlign: 'center',
                    columns: [
                        {
                            accessor: 'target',
                            title: 'Target',
                            textAlign: 'right',
                            width: 100
                        },
                        {
                            accessor: 'realisasi',
                            title: 'Realisasi',
                            textAlign: 'right',
                            width: 100
                        },
                        {
                            accessor: 'persentase',
                            title: 'Persentase',
                            textAlign: 'right',
                            width: 100,
                            render: ({ persentase }) => persentase.toFixed(2) + '%'
                        }
                    ]
                },

                {
                    id: 'tingkatKualitas',
                    title: '',
                    style: { borderBottomColor: 'transparent' },
                    columns: [
                        {
                            accessor: 'tingkatKualitas',
                            title: (
                                <Text inherit>
                                    Tingkat Kualitas
                                </Text>
                            ),
                            textAlign: 'right',
                            width: 130,
                            render: ({ tingkatKualitas }) => tingkatKualitas + '%'
                        }
                    ]
                },

                {
                    id: 'keterangan',
                    title: '',
                    style: { borderBottomColor: 'transparent' },
                    columns: [
                        {
                            accessor: 'keterangan',
                            title: (
                                <Text inherit>
                                    Keterangan
                                </Text>
                            ),
                            textAlign: 'left'
                        }
                    ]
                },
                {
                    id: 'aksi',
                    title: '',
                    textAlign: 'center',
                    style: { borderBottomColor: 'transparent' },
                    columns: [
                        {
                            accessor: 'aksi',
                            title: (
                                <Text inherit>
                                    Aksi
                                </Text>
                            ),
                            width: 55,
                            render: (record) => (
                                <Group gap={4} justify="center" wrap="nowrap">
                                    <ActionIcon
                                        size="sm"
                                        variant="subtle"
                                        color="blue"
                                        onClick={() => {
                                            showModal({ record, action: 'edit', fetchData })
                                        }}
                                    >
                                        <IconEdit size={16} />
                                    </ActionIcon>
                                </Group>
                            ),
                        }
                    ]
                }
            ]}

            withColumnBorders
            withTableBorder
            pinLastColumn
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

const showModal = ({ record, action, fetchData }: { record: RecordKegiatanBulanan; action: 'edit'; fetchData: () => void }) => {
    if (action === 'edit') {
        const FormComponent = () => {
            const form = useForm({
                initialValues: {
                    id: record.id,
                    uraian: record.uraian || '',
                    satuan: record.tipeKegiatan.satuan,
                    target: record.target,
                    realisasi: record.realisasi,
                    persentase: record.persentase,
                    tingkatKualitas: record.tingkatKualitas,
                    keterangan: record.keterangan || '',
                    rekapTipeKegiatanId: record.rekapTipeId
                }
            });

            return (
                <form onSubmit={form.onSubmit(async (values) => {
                    // console.log(values);
                    try {
                        const response = await putKegiatanBulanan(values);
                        // console.log(response);
                        notifications.show({
                            title: 'Ubah Kegiatan Bulanan',
                            message: 'Kegiatan bulanan berhasil diubah',
                        });
                        fetchData();
                        closeModal(action);
                    } catch (error) {
                        notifications.show({
                            title: 'Gagal Ubah Kegiatan Bulanan',
                            message: "Terjadi kesalahan saat mengubah kegiatan bulanan",
                            color: 'red',
                        });
                    }

                    // fetch(`/api/kegiatan-bulanan`, {
                    //     method: 'PUT',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     },
                    //     body: JSON.stringify(values),

                    // }).then(response => response.json())
                    //     .then(data => {
                    //         // Update your state with the new data
                    //         closeModal(action)
                    //         notifications.show({
                    //             title: 'Ubah Kegiatan Bulanan',
                    //             message: 'Kegiatan bulanan berhasil diubah',
                    //         });
                    //         fetchData();

                    //     })
                    //     .catch((error) => {
                    //         notifications.show({
                    //             title: 'Error',
                    //             message: error.message,
                    //             color: 'red',
                    //         });
                    //     });
                })}>
                    <Stack gap="md">
                        {/* hidden value */}
                        <TextInput
                            type='hidden'
                            {...form.getInputProps('id')}
                        />
                        <TextInput
                            label='Uraian Kegiatan'
                            placeholder='Isi uraian kegiatan'
                            {...form.getInputProps('uraian')}
                            variant='filled'
                            readOnly
                        />
                        <TextInput
                            label='Satuan'
                            placeholder='Isi satuan'
                            {...form.getInputProps('satuan')}
                            readOnly
                            variant='filled'
                        />
                        <NumberInput
                            label='Target'
                            placeholder='Isi target'
                            {...form.getInputProps('target')}
                            readOnly
                            variant='filled'
                        />
                        <NumberInput
                            min={0}
                            max={form.values.target}
                            clampBehavior="strict"
                            stepHoldDelay={500}
                            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}

                            label='Realisasi'
                            placeholder='Isi realisasi'
                            {...form.getInputProps('realisasi')}
                        />
                        {/* <NumberInput
                            label='Persentase'
                            placeholder='Isi persentase'
                            {...form.getInputProps('persentase')}
                        /> */}
                        {/* <NumberInput
                            label='Tingkat Kualitas'
                            placeholder='Isi tingkat kualitas'
                            {...form.getInputProps('tingkatKualitas')}
                        /> */}
                        {/* <TextInput
                            label='Keterangan'
                            placeholder='Isi keterangan'
                            {...form.getInputProps('keterangan')}
                        /> */}

                        <Group justify="right">
                            <Button onClick={
                                () => {
                                    closeModal(action)
                                }
                            } color="red" variant="light">Batal</Button>
                            <Button type="submit" variant="light">Simpan</Button>
                        </Group>
                    </Stack>
                </form>
            );
        };

        openModal({
            modalId: action,
            title: 'Ubah Data Kegiatan Bulanan',
            children: (
                <FormComponent />
            ),
        });
    }
};

export default TableKegiatanBulanan