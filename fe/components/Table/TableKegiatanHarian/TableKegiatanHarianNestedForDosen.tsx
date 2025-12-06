'use client'

import { ActionIcon, Badge, Button, Grid, GridCol, Group, MultiSelect, ScrollArea, Stack, Text, TextInput } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useMemo, useState } from 'react'
import { IconCheck, IconCheckbox, IconChevronRight, IconEdit, IconEye, IconSearch, IconTrash, IconUser, IconX } from '@tabler/icons-react'
import { closeModal, openModal } from '@mantine/modals'
import { RecordKegiatanHarian } from './TableKegiatanHarian'

export interface RecordKegiatanHarianNested {
    id: number
    nim: string
    nama: string
    data_kegiatan: RecordKegiatanHarian[]
}

const TableKegiatanHarianNested = ({ records, dataKegiatanHarian, loading }: { records: RecordKegiatanHarianNested[], dataKegiatanHarian: any, loading: boolean }) => {
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

    const [selectedRecords, setSelectedRecords] = useState<RecordKegiatanHarian[]>([]);


    return (
        <><DataTable
            fetching={loading}
            style={{ minHeight: recordsPaged.length > 0 ? '0' : '180px' }}  
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
                    accessor: 'no',
                    title: 'No',
                    textAlign: 'center',
                    render: (record) => records.indexOf(record) + 1,
                    width: 43
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
                                onClick={() => {
                                    showModal({ record, action: 'view', dataKegiatanHarian })
                                }}
                                title='lihat'
                            >
                                <IconEye size={16} />
                            </ActionIcon>

                        </Group>
                    )
                }
            ]}

            records={recordsPaged}

            // pagination
            // totalRecords={records.length}
            // recordsPerPage={pageSize}
            // page={page}
            // onPageChange={setPage}
            // recordsPerPageOptions={PAGE_SIZES}
            // onRecordsPerPageChange={setPageSize}

            onRowClick={(record) => {
                showModal({ record, action: 'view', dataKegiatanHarian })
            }}
        />

        </>
    )
}


const showModal = ({ record, action, dataKegiatanHarian }: { record: any, action: 'view' | 'edit' | 'delete', dataKegiatanHarian: any }) => {

    if (action === 'view') {
        openModal({
            modalId: action,
            title: 'Detail Kegiatan Harian',
            size: '100%',
            centered: true,
            scrollAreaComponent: ScrollArea.Autosize,
            children: (
                <ModalContent record={record} action={action} dataKegiatanHarian={dataKegiatanHarian} />
            ),
        });
    }
};


const ModalContent = ({ record, action, dataKegiatanHarian }: { record: any, action: 'view' | 'edit' | 'delete', dataKegiatanHarian: any }) => {
    const [selectedRecords, setSelectedRecords] = useState([]);

    const filteredData = dataKegiatanHarian.filter((item: { mahasiswaId: any; }) => item.mahasiswaId === record.record.id)

    const sortedData = filteredData.sort((a: { tanggal: string; }, b: { tanggal: string; }) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
    return (
        <>
            <Text size='sm'><span style={{ display: 'inline-block', width: '50px' }}>Nama</span>: {record.record.nama}</Text>
            <Text size='sm' mb={"sm"}><span style={{ display: 'inline-block', width: '50px' }}>NIM</span>: {record.record.nim}</Text>
            <DataTable
                style={{ minHeight: sortedData.length > 0 ? '0' : '180px' }}  
                // height={"73vh"}
                withColumnBorders
                withTableBorder
                highlightOnHover={false}
                groups={[
                    {
                        id: 'id',
                        title: '',
                        style: { borderBottomColor: 'transparent' },
                        columns: [
                            {
                                accessor: 'id',
                                title: (
                                    <Text fw={700}>
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
                                    <Text inherit fw={700} >
                                        No
                                    </Text>
                                ),
                                textAlign: 'right',
                                width: 40,
                                render: (record) => sortedData.indexOf(record) + 1,
                            },
                        ]
                    },

                    {
                        id: 'tanggal',
                        title: '',
                        style: { borderBottomColor: 'transparent' },
                        columns: [
                            {
                                accessor: 'tanggal',
                                title: (
                                    <Text inherit fw={700}>
                                        Tanggal
                                    </Text>
                                ),
                                textAlign: 'left',
                                render: (record: any) => new Date(record.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                            },
                        ]
                    },

                    {
                        id: 'deskripsi',
                        title: '',
                        style: { borderBottomColor: 'transparent' },
                        columns: [
                            {
                                accessor: 'deskripsi',
                                title: (
                                    <Text inherit fw={700}>
                                        Deskripsi Kegiatan
                                    </Text>
                                ),
                                textAlign: 'left',
                            },
                        ]
                    },

                    {
                        id: 'kuantitas',
                        title: 'Kuantitas',
                        textAlign: 'center',
                        columns: [
                            { accessor: 'volume', title: 'Volume', textAlign: 'right', },
                            { accessor: 'satuan', title: 'Satuan', textAlign: 'left' },
                        ]
                    },
                    {
                        id: 'durasi',
                        title: '',
                        style: { borderBottomColor: 'transparent' },
                        columns: [
                            {
                                accessor: 'durasi', title: (
                                    <Text inherit fw={700}>
                                        Durasi
                                    </Text>
                                ),
                                textAlign: 'right',
                                render: (record) => `${record.durasi} jam`
                            },
                        ]
                    },

                    {
                        id: 'pemberiTugas',
                        title: '',
                        style: { borderBottomColor: 'transparent' },
                        columns: [
                            {
                                accessor: 'pemberiTugas', title: (
                                    <Text inherit fw={700}>
                                        Pemberi Tugas
                                    </Text>
                                ),
                                textAlign: 'left',
                            },
                        ]
                    },
                    {
                        id: 'tim',
                        title: '',
                        style: { borderBottomColor: 'transparent' },
                        columns: [
                            {
                                accessor: 'tim', title: (
                                    <Text inherit fw={700}>
                                        Tim Kerja
                                    </Text>
                                ),
                                textAlign: 'left'
                            },
                        ]
                    },

                    {
                        id: 'statusPenyelesaian',
                        title: '',
                        style: { borderBottomColor: 'transparent' },
                        columns: [
                            {
                                accessor: 'statusPenyelesaian', title: (
                                    <Text inherit>
                                        Penyelesaian
                                    </Text>
                                ),
                                textAlign: 'right',
                                render: (record) => `${record.statusPenyelesaian}%`
                            },
                        ]
                    },
                    {
                        id: 'isFinal',
                        title: '',
                        style: { borderBottomColor: 'transparent' },
                        columns: [
                            {
                                accessor: 'isFinal', title: (
                                    <Text inherit>
                                        Status
                                    </Text>
                                ),
                                textAlign: 'center',
                                render: (record) => record.isFinal ? <IconCheck size={16} /> : null
                            },
                        ]

                    },



                ]}




                records={sortedData}
            // totalRecords={record.record.data_presensi.length}
            // recordsPerPage={pageSizeNested}
            // page={pageNested}
            // onPageChange={setPageNested}
            // recordsPerPageOptions={PAGE_SIZES}
            // onRecordsPerPageChange={setPageSizeNested}

            // selectedRecords={selectedRecords}
            // onSelectedRecordsChange={setSelectedRecords}
            // selectionTrigger="cell"
            />


        </>
    )
}

export default TableKegiatanHarianNested