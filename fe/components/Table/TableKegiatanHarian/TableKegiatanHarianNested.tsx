'use client'

import { ActionIcon, Badge, Button, Grid, GridCol, Group, Stack, Tabs, Text, TextInput } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'
import { IconCheckbox, IconChevronRight, IconEdit, IconEye, IconList, IconTrash, IconUser } from '@tabler/icons-react'
import { closeModal, openModal } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { DateInput } from '@mantine/dates'
import clsx from 'clsx'
import classes from './NestedTables.module.css'
import { RecordKegiatanHarian } from './TableKegiatanHarian'
import { notifications } from '@mantine/notifications'
import { approveKegiatanHarian, getKegiatanHarian } from '@/utils/kegiatan-harian'

export interface RecordKegiatanHarianNested {
    id: number
    nim: string
    nama: string
    data_kegiatan: RecordKegiatanHarian[]
}

const TableKegiatanHarianNested = ({ records, dataKegiatanHarian, loading, fetchData }: { records: any, dataKegiatanHarian: any, loading: boolean, fetchData: any }) => {
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
                                    showModal({ record, action: 'view', dataKegiatanHarian, fetchData })
                                    console.log("modal record", record)
                                    console.log("modal dataKegiatanHarian", dataKegiatanHarian)
                                }}
                                title='Konfirmasi'
                            >
                                <IconCheckbox size={16} />
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
                showModal({ record, action: 'view', dataKegiatanHarian, fetchData })
            }}
        />

        </>
    )
}


const showModal = ({ record, action, dataKegiatanHarian, fetchData }: { record: any, action: 'view' | 'edit' | 'delete', dataKegiatanHarian: any, fetchData: any }) => {

    if (action === 'view') {
        openModal({
            modalId: action,
            title: 'Konfirmasi Kegiatan',
            size: '100%',
            centered: true,
            children: (
                <ModalContent record={record} action={action} dataKegiatanHarian={dataKegiatanHarian} fetchData={fetchData} />
            ),
        });
    }
};


const ModalContent = ({ record, action, dataKegiatanHarian, fetchData }: { record: any, action: 'view' | 'edit' | 'delete', dataKegiatanHarian: any, fetchData: any }) => {
    const [selectedRecords, setSelectedRecords] = useState([]);

    const filteredData = dataKegiatanHarian.filter((item: { mahasiswaId: any; }) => item.mahasiswaId === record.record.id)

    const sortedData = filteredData.sort((a: { tanggal: string; }, b: { tanggal: string; }) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
    // select if isFinal is true
    const dataIsFinal = sortedData.filter((item: { isFinal: boolean; }) => item.isFinal === true)

    const dataIsNotFinal = sortedData.filter((item: { isFinal: boolean; }) => item.isFinal === false)

    return (
        <>
            <Text size='sm'><span style={{ display: 'inline-block', width: '50px' }}>Nama</span>: {record.record.nama}</Text>
            <Text size='sm' mb={"sm"}><span style={{ display: 'inline-block', width: '50px' }}>NIM</span>: {record.record.nim}</Text>
            <Tabs variant='outline' defaultValue="konfirmasi">
                <Tabs.List>
                    <Tabs.Tab value="konfirmasi" leftSection={<IconCheckbox width={15} />}>
                        Konfirmasi
                    </Tabs.Tab>
                    <Tabs.Tab value="daftar" leftSection={<IconList width={15} />}>
                        Daftar Kegiatan
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="konfirmasi">
                    <DataTable
                        style={{ minHeight: dataIsNotFinal.length > 0 ? '0' : '180px' }}  
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
                                        textAlign: 'left'
                                    },
                                ]
                            },
                            {
                                id: 'kuantitas',
                                title: 'Kuantitas',
                                textAlign: 'center',
                                columns: [
                                    { accessor: 'volume', title: 'Volume', textAlign: 'right' },
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
                                        textAlign: 'left'
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
                                            <Text inherit fw={700}>
                                                Status Penyelesaian
                                            </Text>
                                        ),
                                        textAlign: 'right',
                                        render: (record) => `${record.statusPenyelesaian}%`
                                    },
                                ]
                            }
                        ]}
                        records={dataIsNotFinal}
                        // totalRecords={record.record.data_presensi.length}
                        // recordsPerPage={pageSizeNested}
                        // page={pageNested}
                        // onPageChange={setPageNested}
                        // recordsPerPageOptions={PAGE_SIZES}
                        // onRecordsPerPageChange={setPageSizeNested}
                        selectedRecords={selectedRecords}
                        onSelectedRecordsChange={(selectedRecords: any) => setSelectedRecords(selectedRecords)}
                        selectionTrigger="cell"
                    />

                    <Group justify='center' m={10}>
                        {selectedRecords.length > 0 ? (
                            <Button
                                color='blue'
                                variant='light'
                                onClick={async () => {
                                    let kegiatan = selectedRecords.map((item: { kegiatanId: number }) => ({
                                        kegiatanHarianId: item.kegiatanId
                                    }));

                                    try {
                                        await approveKegiatanHarian(kegiatan)
                                        notifications.show({ title: 'Berhasil', message: 'Kegiatan berhasil dikonfirmasi', color: 'blue' })
                                    } catch (error) {
                                        console.error("Failed to approve kegiatan", error);
                                        notifications.show({ title: 'Gagal', message: 'Gagal mengkonfirmasi kegiatan', color: 'red' })
                                    }
                                    fetchData()

                                    closeModal(action)
                                }}
                            >
                                Konfirmasi {selectedRecords.length} Kegiatan
                            </Button>
                        ) : (
                            <Button
                                color='blue'
                                variant='light'
                                disabled
                            >
                                Konfirmasi Kegiatan
                            </Button>
                        )}
                    </Group>
                </Tabs.Panel>

                <Tabs.Panel value="daftar">
                    <DataTable
                        style={{ minHeight: dataIsFinal.length > 0 ? '0' : '180px' }}  
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
                                        textAlign: 'left'
                                    },
                                ]
                            },
                            {
                                id: 'kuantitas',
                                title: 'Kuantitas',
                                textAlign: 'center',
                                columns: [
                                    { accessor: 'volume', title: 'Volume', textAlign: 'right' },
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
                                        textAlign: 'left'
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
                                            <Text inherit fw={700}>
                                                Status Penyelesaian
                                            </Text>
                                        ),
                                        textAlign: 'right',
                                        render: (record) => `${record.statusPenyelesaian}%`
                                    },
                                ]
                            }



                        ]}
                        records={dataIsFinal}
                        // totalRecords={record.record.data_presensi.length}
                        // recordsPerPage={pageSizeNested}
                        // page={pageNested}
                        // onPageChange={setPageNested}
                        // recordsPerPageOptions={PAGE_SIZES}
                        // onRecordsPerPageChange={setPageSizeNested}
                        selectedRecords={selectedRecords}
                        onSelectedRecordsChange={(selectedRecords: any) => setSelectedRecords(selectedRecords)}
                        selectionTrigger="cell"
                    />
                </Tabs.Panel>
            </Tabs>
        </>
    )
}

export default TableKegiatanHarianNested