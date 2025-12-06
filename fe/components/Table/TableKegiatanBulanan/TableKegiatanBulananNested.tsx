'use client'

import { ActionIcon, Badge, Button, Grid, GridCol, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'
import { IconChevronRight, IconEdit, IconEye, IconTrash, IconUser } from '@tabler/icons-react'
import { closeModal, openModal } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { DateInput } from '@mantine/dates'
import clsx from 'clsx'
import classes from './NestedTables.module.css'
import { RecordKegiatanBulanan } from './TableKegiatanBulanan'
import { notifications } from '@mantine/notifications'
import { putKualitasKegiatanBulanan } from '@/utils/kegiatan-bulanan'

export interface RecordKegiatanBulananNested {
    id: number
    nim: string
    nama: string
    data_kegiatan: RecordKegiatanBulanan[]
}

const TableKegiatanBulananNested = ({ records, dataKegiatanBulanan, loading, fetchData, periode }: { records: RecordKegiatanBulananNested[], dataKegiatanBulanan: any; loading: boolean; fetchData: any, periode: string }) => {
    const [expandedPresensiIds, setExpandedPresensiIds] = useState<number[]>([]);
    const PAGE_SIZES = [10, 15, 20];


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



    return (
        <><DataTable
            style={{ minHeight: recordsPaged.length > 0 ? '0' : '180px' }}  
            fetching={loading}
            highlightOnHover
            withColumnBorders
            withTableBorder
            columns={[
                {
                    accessor: 'id',
                    title: 'ID Mahasiswa',
                    hidden: true,
                },

                {
                    accessor: 'index',
                    title: 'No',
                    textAlign: 'right',
                    width: 40,
                    render: (record) => records.indexOf(record) + 1,
                },

                {
                    accessor: 'nama',
                    title: 'Nama',
                    textAlign: 'left',
                    render: ({ id, nama }) => (
                        <>
                            {/* <IconChevronRight
                                className={clsx(classes.icon, classes.expandIcon, {
                                    [classes.expandIconRotated]: expandedPresensiIds.includes(id),
                                })}
                            />
                            <IconUser className={classes.icon} /> */}
                            <span>{nama}</span>
                        </>
                    ),

                },
                {
                    accessor: 'nim',
                    title: 'NIM',
                    textAlign: 'left'
                },

                {
                    accessor: 'aksi',
                    title: 'Aksi',
                    textAlign: 'center',
                    width: '0%',
                    render: (record) => (
                        <Group gap={4} justify="right" wrap="nowrap">
                            <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="blue"
                                onClick={(record) => {
                                    showModal({ record, action: 'view', dataKegiatanBulanan, fetchData, periode })
                                }}
                                title='edit'
                            >
                                <IconEdit size={16} />
                            </ActionIcon>
                        </Group>
                    ),
                }
            ]}
            onRowClick={(record) => {
                showModal({ record, action: 'view', dataKegiatanBulanan, fetchData, periode })
            }}

            records={recordsPaged}

        //# pagination
        // totalRecords={records.length}
        // recordsPerPage={pageSize}
        // page={page}
        // onPageChange={setPage}
        // recordsPerPageOptions={PAGE_SIZES}
        // onRecordsPerPageChange={setPageSize}

        // rowExpansion={{
        //     allowMultiple: false,
        //     expanded: { recordIds: expandedPresensiIds, onRecordIdsChange: setExpandedPresensiIds },
        //     content: (record) => (
        //         <>
        //         </>
        //     )
        // }}
        />

        </>
    )
}


const showModal = ({ record, action, dataKegiatanBulanan, fetchData, periode }: { record: any; action: 'view' | 'edit' | 'delete'; dataKegiatanBulanan: any; fetchData: any, periode: string }) => {
    if (action === 'view') {
        openModal({
            modalId: action,
            title: 'Detail Kegiatan Bulanan',
            size: '100%',
            centered: true,
            children: (
                <ModalContent record={record} action={action} dataKegiatanBulanan={dataKegiatanBulanan} fetchData={fetchData} periode={periode} />
            ),
        });
    }

};

const ModalContent = ({ record, action, dataKegiatanBulanan, fetchData, periode }: { record: any; action: 'view' | 'edit' | 'delete'; dataKegiatanBulanan: any; fetchData: any, periode: string }) => {
    // console.log(dataKegiatanBulanan, record);
    const filteredData = dataKegiatanBulanan.filter((item: { mahasiswaId: number }) => item.mahasiswaId === record.record.id);
    // console.log(filteredData);

    const lastData = filteredData[0]?.RekapKegiatanBulananTipeKegiatan.map((item: { rekapTipeId: any }) => ({
        ...item,
        id: item.rekapTipeId
    }))

    // how to get the newest data without closign modal
    return (
        <>
            <Text size='sm'><span style={{ display: 'inline-block', width: '50px' }}>Nama</span>: {record.record.nama}</Text>
            <Text size='sm' mb={"sm"}><span style={{ display: 'inline-block', width: '50px' }}>NIM</span>: {record.record.nim}</Text>
            {/* periode */}
            <Text size='sm' mb={"sm"}><span style={{ display: 'inline-block', width: '50px' }}>Periode</span>: {periode}</Text>
            <DataTable
                style={{ minHeight: lastData?.length > 0 ? '0' : '180px' }}  
                withColumnBorders
                withTableBorder
                groups={[
                    {
                        id: 'id',
                        title: '',
                        style: { borderBottomColor: 'transparent' },
                        columns: [
                            {
                                accessor: 'id',
                                title: (
                                    <Text inherit >
                                        No
                                    </Text>
                                ),
                                hidden: true,
                                textAlign: 'right'
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
                                    <Text inherit >
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
                                    <Text inherit >
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
                                    <Text inherit >
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
                                    <Text inherit >
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
                        style: { borderBottomColor: 'transparent' },
                        columns: [
                            {
                                accessor: 'aksi',
                                title: 'Aksi',
                                textAlign: 'center',
                                width: '0%',
                                render: (record) => (
                                    <Group gap={4} justify="right" wrap="nowrap">
                                        <ActionIcon
                                            size="sm"
                                            variant="subtle"
                                            color="blue"
                                            onClick={() => {
                                                showModalKeterangan({ record, action: 'edit', fetchData });
                                            }}
                                        >
                                            <IconEdit size={16} />
                                        </ActionIcon>
                                    </Group>
                                ),
                            }]
                    }
                ]}

                // pinLastColumn
                // totalRecords={records.length}
                // recordsPerPage={pageSize}
                // page={page}
                // onPageChange={setPage}
                // recordsPerPageOptions={PAGE_SIZES}
                // onRecordsPerPageChange={setPageSize}
                highlightOnHover

                records={lastData}
            // totalRecords={record.record.data_presensi.length}
            // recordsPerPage={pageSizeNested}
            // page={pageNested}
            // onPageChange={setPageNested}
            // recordsPerPageOptions={PAGE_SIZES}
            // onRecordsPerPageChange={setPageSizeNested}

            />
        </>
    )
}
const showModalKeterangan = ({ record, action, fetchData }: { record: any; action: 'edit'; fetchData: any }) => {
    // console.log(record);
    const FormComponent = () => {
        const form = useForm({
            initialValues: {
                rekapTipeId: record.id || '',
                keterangan: record.keterangan || '',
                tingkatKualitas: record.tingkatKualitas || '',
            },
            validate: {
                keterangan: (value) => {
                    if (value.length > 200) {
                        return 'Keterangan tidak boleh lebih dari 200 karakter';
                    }
                },
                tingkatKualitas: (value) => {
                    if (value < 0 || value > 100) {
                        return 'Tingkat Kualitas harus diantara 0 - 100';
                    }
                    if (value === '') {
                        return 'Tingkat Kualitas tidak boleh kosong';
                    }
                }
            }
        });

        return (
            <form onSubmit={form.onSubmit(async (values) => {
                // console.log(values);
                try {
                    const response = await putKualitasKegiatanBulanan(values);
                    // console.log(response);
                    notifications.show({
                        title: 'Berhasil',
                        message: 'Kegiatan bulanan berhasil diubah',
                    });
                    fetchData();
                    closeModal(action);
                } catch (error) {
                    notifications.show({
                        title: 'Gagal',
                        message: "Terjadi kesalahan saat mengubah kegiatan bulanan",
                        color: 'red',
                    });
                }
            })}>
                <Stack gap="md">
                    {/* hidden value */}
                    <TextInput
                        variant='filled'
                        readOnly
                        label='Nama Kegiatan'
                        value={record.uraian}
                    />

                    <TextInput
                        variant='filled'
                        readOnly
                        label='Satuan'
                        value={record.tipeKegiatan.satuan}
                    />

                    <Group wrap='nowrap' grow>
                        <TextInput
                            variant='filled'
                            readOnly
                            label='Target'
                            value={record.target}
                        />
                        <TextInput
                            variant='filled'
                            readOnly
                            label='Realisasi'
                            value={record.realisasi}
                        />
                        <TextInput
                            variant='filled'
                            readOnly
                            label='Persentase'
                            value={record.persentase + '%'}
                        />

                    </Group>

                    <TextInput
                        type='hidden'
                        {...form.getInputProps('id')}
                    />
                    <NumberInput
                        min={0}
                        max={100}
                        clampBehavior="strict"
                        stepHoldDelay={500}
                        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                        label='Tingkat Kualitas'
                        description='Tingkat Kualitas dalam %'
                        // placeholder='Tingkat Kualitas dalam %'
                        {...form.getInputProps('tingkatKualitas')}
                    />
                    <TextInput
                        label='Keterangan'
                        description='Isi keterangan jika diperlukan'
                        // placeholder='Isi keterangan'
                        {...form.getInputProps('keterangan')}
                    />

                    <Group justify="right">
                        <Button onClick={
                            () => {
                                closeModal(action)
                            }
                        } color="grey" variant="light">Batal</Button>
                        <Button type="submit" variant="light">Simpan</Button>
                    </Group>
                </Stack>
            </form>
        );
    };

    openModal({
        modalId: action,
        title: 'Tingkat Kualitas Kegiatan Bulanan',
        children: (
            <FormComponent />
        ),
    });
}


export default TableKegiatanBulananNested