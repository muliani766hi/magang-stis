'use client'

import { deleteKegiatanHarian, putKegiatanHarian, putTipeKegiatan } from '@/utils/kegiatan-harian'
import { ActionIcon, Box, Button, Group, NumberInput, Select, Stack, Text, Textarea, TextInput } from '@mantine/core'
import { DateInput, DatePicker, type DatesRangeValue } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { closeModal, openModal } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconEdit, IconSearch, IconTrash, IconX } from '@tabler/icons-react'
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { useDebouncedValue } from '@mantine/hooks'
import { recordTraceEvents } from 'next/dist/trace'

export interface RecordKegiatanHarian {
    id?: number
    kegiatanId?: number
    nama: string
    tanggal: string
    deskripsi: string
    volume: number | null
    satuan: string
    durasi: number | null
    pemberiTugas: string
    tim : string
    statusPenyelesaian: number | null
    tipeKegiatanId: number
    isFinal: boolean
}

const PAGE_SIZES = [10, 15, 20];

const TableKegiatanHarian = ({ 
    records, 
    isLoading, 
    fetchData,  
    page, 
    pageSize,  
    totalRecords, 
    setPage,  
    setPageSize
 }: { 
    records: RecordKegiatanHarian[], 
    isLoading: boolean, 
    fetchData: () => void,   
    page: number, 
    pageSize: number, 
    totalRecords: number, 
    setPage: React.Dispatch<React.SetStateAction<number>>, 
    setPageSize: React.Dispatch<React.SetStateAction<number>>, }) => {
    // const [recordsMain, setRecordsMain] = useState(records);

    // const [query, setQuery] = useState('');
    // const [query2, setQuery2] = useState('');
    // const [harianSearchRange, setHarianSearchRange] = useState<DatesRangeValue>();
    // const [debouncedQuery] = useDebouncedValue(query, 200)
    // // const [debouncedQuery2] = useDebouncedValue(query2, 200)


    // useEffect(() => {
    //     setRecordsMain(records.filter(({ deskripsi, tanggal }) => {
    //         if (debouncedQuery !== '' && !`${deskripsi}`.toLowerCase().includes(debouncedQuery.toLowerCase())) {
    //             return false;
    //         }

    //         if (
    //             harianSearchRange &&
    //             harianSearchRange[0] &&
    //             harianSearchRange[1] &&
    //             (dayjs(harianSearchRange[0]).isAfter(tanggal, 'day') ||
    //                 dayjs(harianSearchRange[1]).isBefore(tanggal, 'day'))
    //         )
    //             return false;

    //         // if (debouncedQuery2 !== '' && !`${nip}`.toLowerCase().includes(debouncedQuery2.toLowerCase())) {
    //         //     return false;
    //         // }
    //         return true;
    //     }));

    // }, [debouncedQuery, harianSearchRange, records]);

    // // pagination
    // const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    // useEffect(() => {
    //     setPage(1);
    // }, [pageSize]);

    // const [page, setPage] = useState(1);
    // const [recordsPaged, setRecordsPaged] = useState(recordsMain.slice(0, pageSize));

    // useEffect(() => {
    //     const from = (page - 1) * pageSize;
    //     const to = from + pageSize;
    //     setRecordsPaged(recordsMain.slice(from, to));
    // }, [page, pageSize, recordsMain]);
    return (
        <DataTable
            // minHeight={210}
            style={{ minHeight: records.length > 0 ? '0' : '210px' }}  
            fetching={isLoading}
            withColumnBorders
            withTableBorder
            pinLastColumn
            groups={[
                {
                    id: 'id',
                    title: '',
                    style: { borderBottomColor: 'transparent' },
                    columns: [
                        {
                            accessor: 'id',
                            title: (
                                <Text inherit pos="absolute" mt={-28}>
                                    No
                                </Text>
                            ),
                            hidden: true,
                            textAlign: 'right'
                        },
                    ]
                },
                {
                    id: 'kegiatanId',
                    title: '',
                    style: { borderBottomColor: 'transparent' },
                    columns: [
                        {
                            accessor: 'kegiatanId',
                            title: (
                                <Text inherit pos="absolute" mt={-28}>
                                    No
                                </Text>
                            ),
                            hidden: true,
                            textAlign: 'center'
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
                                <Text inherit >
                                    No
                                </Text>
                            ),
                            textAlign: 'center',
                            width: 40,
                            render: (record) => records.indexOf(record) + 1,
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
                                <Text inherit>
                                    Tanggal
                                </Text>
                            ),
                            textAlign: 'left',
                            render: (record) => new Date(record.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                            // filter: ({ close }) => (
                            //     <Stack>
                            //         <DatePicker
                            //             maxDate={new Date()}
                            //             type="range"
                            //             value={harianSearchRange}
                            //             onChange={setHarianSearchRange}
                            //         />
                            //         <Button
                            //             disabled={!harianSearchRange}
                            //             variant="light"
                            //             onClick={() => {
                            //                 setHarianSearchRange(undefined);
                            //                 close();
                            //             }}
                            //         >
                            //             Batal
                            //         </Button>
                            //     </Stack>
                            // ),
                            // filtering: Boolean(harianSearchRange),
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
                                <Text inherit>
                                    Deskripsi Kegiatan
                                </Text>
                            ),
                            textAlign: 'left',
                            // filter: (
                            //     <TextInput
                            //         label="Deskripsi"
                            //         description="Cari deskripsi kegiatan"
                            //         placeholder="Mencari deskripsi..."
                            //         leftSection={<IconSearch size={16} />}
                            //         rightSection={
                            //             <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setQuery('')}>
                            //                 <IconX size={14} />
                            //             </ActionIcon>
                            //         }
                            //         value={query}
                            //         onChange={(e) => setQuery(e.currentTarget.value)}
                            //     />
                            // ),
                            // filtering: query !== '',
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
                                <Text inherit>
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
                                <Text inherit>
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
                                <Text inherit>
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
                            textAlign: 'left',
                            render: (record) => record.isFinal ? <IconCheck size={16} /> : null
                        },
                    ]

                },
                {
                    id: 'tipeKegiatan',
                    title: '',
                    style: { borderBottomColor: 'transparent' },
                    columns: [
                        {
                            accessor: 'tipeKegiatanId',
                            textAlign: 'left',
                            hidden: true
                        },
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
                                    <ActionIcon
                                        size="sm"
                                        variant="subtle"
                                        color="red"
                                        onClick={() => {
                                            showModal({ record, action: 'delete', fetchData })
                                        }}
                                    >
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            ),
                        }
                    ]
                }


            ]}

            records={records}
            totalRecords={totalRecords}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={setPage}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
        />
    )
}

const showModal = ({ record, action, fetchData }: { record: RecordKegiatanHarian; action: 'edit' | 'delete'; fetchData: () => void }) => {
    if (action === 'edit') {
        const FormComponent = () => {
            const form = useForm({
                initialValues: {
                    nama: record.nama,
                    kegiatanId: record.kegiatanId,
                    tanggal: new Date(record.tanggal),
                    deskripsi: record.deskripsi,
                    volume: record.volume,
                    satuan: record.satuan,
                    durasi: record.durasi,
                    pemberiTugas: record.pemberiTugas,
                    tim: record.tim,
                    statusPenyelesaian: record.statusPenyelesaian,
                    tipeKegiatanId: record.tipeKegiatanId,
                },
                validate: {
                    tanggal: (value) =>
                        value.toString() !== "" ? null : "Tanggal kegiatan harus diisi",
                    deskripsi: (value) =>
                        value !== "" ? null : "Deskripsi kegiatan harus diisi",
                    volume: (value) =>
                        value !== null ? null : "Volume harus diisi",
                    satuan: (value) =>
                        value !== "" ? null : "Satuan harus diisi",
                    durasi: (value) =>
                        value !== null ? null : "Durasi harus diisi",
                    pemberiTugas: (value) =>
                        value !== "" ? null : "Pemberi tugas harus diisi",
                    tim: (value) =>
                        value !== "" ? null : "Tim kerja harus diisi",
                    statusPenyelesaian: (value) =>
                        value !== null ? null : "Status penyelesaian harus diisi",
                }
            });

            return (
                <form onSubmit={form.onSubmit(async (values) => {
                    // console.log(values);

                    try {
                        const response = await putKegiatanHarian(values, values.kegiatanId, values.tipeKegiatanId);
                        const response2 = await putTipeKegiatan(values.nama, values.satuan, values.tipeKegiatanId);
                        // console.log(response);
                        closeModal(action)
                        notifications.show({
                            title: 'Ubah Kegiatan Harian',
                            message: 'Kegiatan harian berhasil diubah',
                        });
                        fetchData();

                    } catch (error) {
                        notifications.show({
                            title: 'Gagal Ubah Kegiatan Harian',
                            message: "Terjadi kesalahan saat mengubah kegiatan harian",
                            color: 'red',
                        });
                    }
                })}>
                    <Stack gap="md">
                        <DateInput label="Tanggal Kegiatan"
                            valueFormat='DD-MM-YYYY'
                            placeholder="Masukkan tanggal kegiatan"
                            {...form.getInputProps("tanggal")} />
                        <Textarea
                            label="Deskripsi Kegiatan"
                            placeholder="Masukkan deskripsi kegiatan"
                            {...form.getInputProps("deskripsi")} />
                        <NumberInput
                            label="Volume"
                            min={0}
                            max={1000}
                            key="volume"
                            clampBehavior="strict"
                            stepHoldDelay={500}
                            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                            placeholder="Masukkan volume"
                            {...form.getInputProps("volume")} />
                        <TextInput
                            label="Satuan"
                            placeholder="Masukkan satuan"
                            {...form.getInputProps("satuan")} />
                        <NumberInput
                            label="Durasi"
                            min={0}
                            max={1000}
                            stepHoldDelay={500}
                            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                            placeholder="Masukkan durasi"
                            {...form.getInputProps("durasi")} />
                        <TextInput
                            label="Pemberi Tugas"
                            placeholder="Masukkan pemberi tugas"
                            {...form.getInputProps("pemberiTugas")} />
                         <Select
                            label="Tim Kerja"
                            description="Pilih tim kerja yang terkait dengan kegiatan"
                            placeholder="Pilih tim kerja"
                            data={[
                            { value: "Tim Kerja Sub Bagian Umum", label: "Tim Kerja Sub Bagian Umum" },
                            { value: "Tim Kerja Statistik Distribusi dan Harga", label: "Tim Kerja Statistik Distribusi dan Harga" },
                            { value: "Tim Kerja Keuangan Teknologi Informasi dan Pariwisata", label: "Tim Kerja Keuangan Teknologi Informasi dan Pariwisata" },
                            { value: "Tim Kerja Statistik Produksi", label: "Tim Kerja Statistik Produksi" },
                            { value: "Tim Kerja Statistik Sosial", label: "Tim Kerja Statistik Sosial" },
                            { value: "Tim Pengolahan dan TI", label: "Tim Pengolahan dan TI" },
                            { value: "Tim Diseminasi Statistik", label: "Tim Diseminasi Statistik" },
                            { value: "Tim Pembinaan Statistik Sektoral", label: "Tim Pembinaan Statistik Sektoral" },
                            { value: "Tim Kerja Neraca Wilayah dan Analisis Statistik", label: "Tim Kerja Neraca Wilayah dan Analisis Statistik" },
                            { value: "Tim Kerja ZI/RB", label: "Tim Kerja ZI/RB" },
                            { value: "Tim SAKIP", label: "Tim SAKIP" },
                            { value: "Unit Pendukung PPID", label: "Unit Pendukung PPID" },
                            { value: "Tim Pengendalian Gratifikasi", label: "Tim Pengendalian Gratifikasi" },
                            { value: "Tim Pelaksana SPIP", label: "Tim Pelaksana SPIP" },
                            { value: "Tim Penanganan Pengaduan Masyarakat dan Whistleblowingsystem (WBS)", label: "Tim Penanganan Pengaduan Masyarakat dan Whistleblowingsystem (WBS)" },
                            { value: "Lainnya", label: "Lainnya" },
                            ]}
                            searchable
                            {...form.getInputProps("tim")}
                        />
                        <NumberInput
                            label="Status Penyelesaian"
                            min={0}
                            max={100}
                            clampBehavior="strict"
                            stepHoldDelay={500}
                            stepHoldInterval={(t) => Math.max(100 / t ** 2, 25)}
                            placeholder="Masukkan status penyelesaian"
                            {...form.getInputProps("statusPenyelesaian")} />

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
            title: 'Ubah Data Kegiatan Harian',
            children: (
                <FormComponent />
            ),
        });
    }

    if (action === 'delete') {
        openModal({
            centered: true,
            modalId: action,
            title: 'Hapus Data Kegiatan Harian',
            children: (
                <Box>
                    <Text>Apakah Anda yakin ingin menghapus data kegiatan harian?</Text>
                    <Group justify="right">
                        <Button onClick={() => closeModal(action)} color="gray" variant="light">Batal</Button>
                        <Button onClick={async () => {
                            try {
                                const response = await deleteKegiatanHarian(record.id ?? 0);

                                notifications.show({
                                    title: 'Hapus Kegiatan Harian',
                                    message: 'Kegiatan harian berhasil dihapus',
                                });
                                fetchData();
                            } catch (error) {
                                notifications.show({
                                    title: 'Gagal Hapus Kegiatan Harian',
                                    message: "Terjadi kesalahan saat menghapus kegiatan harian",
                                    color: 'red',
                                });
                            }
                            closeModal(action)
                        }} color="red" variant="light">Hapus</Button>
                    </Group>
                </Box>
            ),
        });
    }
};

export default TableKegiatanHarian