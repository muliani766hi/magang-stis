'use client'
import { confirmRekening } from '@/utils/dokumen-translok';
import { DataTable } from 'mantine-datatable'
import React, { useState, useEffect } from 'react'
import { ActionIcon, Badge, Group, Input, NumberInput, Select, SimpleGrid, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { IconEye, IconEdit, IconCheck, IconX, IconSearch, IconMapPin } from '@tabler/icons-react';
import { openConfirmModal } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { getAllMahasiswa } from '@/utils/kelola-user/mahasiswa';
import { useDebouncedValue } from '@mantine/hooks';

interface MahasiswaRekening {
  mahasiswaId: number;
  nim: string;
  nama: string;
  bank: string;
  kelas: string;
  nomorRekening: string;
  namaRekening: string;
  statusRek: 'disetujui' | 'dikembalikan' | 'menunggu' | string;
  catatanRek?: string;
}

const PAGE_SIZES = [10, 15, 20];
const TableRekening = () => {
    const [loading, setLoading] = useState(true);
    const [dokumen, setDokumen] = useState<MahasiswaRekening[]>([]);
    const [searchNama, setSearchNama] = useState('');
    const [searchKelas, setSearchKelas] = useState('');
    const [searchBank, setSearchBank] = useState('');
    const [searchStatusRek, setSearchStatusRek] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [debouncedSearchNama] = useDebouncedValue(searchNama, 400);
    const [debouncedSearchKelas] = useDebouncedValue(searchKelas, 400);
    const [debouncedSearchBank] = useDebouncedValue(searchBank, 400);
    const [debouncedSearchStatusRek] = useDebouncedValue(searchStatusRek, 400);


    // const [mahasiswa, setMahasiswa] = useState([])
    const fetchRekening = async (currentPage = page) => {
        setLoading(true)
        const res = await getAllMahasiswa({
            searchNama: debouncedSearchNama,
            searchKelas: debouncedSearchKelas,
            searchBank: debouncedSearchBank,
            searchStatusRek: debouncedSearchStatusRek,
            page: currentPage,
            pageSize,
        })
        setTotal(res.total)
        setDokumen(res.data)
        setLoading(false)
    }

    useEffect(() => {
        fetchRekening()
    }, [])

    useEffect(() => {
        setPage(1);
        // setLoading(true);
        fetchRekening(1); // <= fetch dengan page 1
    }, [ debouncedSearchNama, debouncedSearchBank, debouncedSearchKelas, debouncedSearchStatusRek]);

    // Page atau pageSize berubah: fetch data ulang
    useEffect(() => {
        // setLoading(true);
        fetchRekening(page);
    }, [page, pageSize]);
    
    return (
        <>
      <SimpleGrid cols={{ md: 2, xl: 4 }} mb="md">    
        {/* Nama */}
        <TextInput
            placeholder="Cari Nama"
            value={searchNama}
            onChange={(e) => setSearchNama(e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            rightSection={
            searchNama && (
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchNama('')}>
                <IconX size={14} />
                </ActionIcon>
            )
            }
        />
        <TextInput
            placeholder="Cari Kelas"
            value={searchKelas}
            onChange={(e) => setSearchKelas(e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            rightSection={
            searchKelas && (
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchKelas('')}>
                <IconX size={14} />
                </ActionIcon>
            )
            }
        />
        <TextInput
            placeholder="Cari Bank"
            value={searchBank}
            onChange={(e) => setSearchBank(e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            rightSection={
            searchBank && (
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchBank('')}>
                <IconX size={14} />
                </ActionIcon>
            )
            }
        />
        <Select
            placeholder="Cari Status"
            searchable
            clearable
            value={searchStatusRek}
            onChange={(val) => setSearchStatusRek(val || '')}
            data={[
                { value: 'kosong', label: 'Kosong' },      
                { value: 'menunggu', label: 'Menunggu' },
                { value: 'disetujui', label: 'Disetujui' },
                { value: 'dikembalikan', label: 'Dikembalikan' },
            ]}
            leftSection={<IconSearch size={16} />}
        />
    
        </SimpleGrid>    
        <DataTable
            fetching={loading}
            withTableBorder
            // withColumnBorders
            columns={[
                { accessor: 'no', title: 'No', textAlign: 'center', width: 40, render: (_, index) => (page - 1) * pageSize + (index + 1) },
                { accessor: 'nim', title: 'NIM', textAlign: 'left' },
                { accessor: 'nama', title: 'Nama', textAlign: 'left'},
                { accessor: 'kelas', title: 'Kelas', textAlign: 'left'},
                { accessor: 'noHp', title: 'No HP', textAlign: 'left' },
                { accessor: 'bank', title: 'Bank', textAlign: 'left' },
                { accessor: 'nomorRekening', title: 'Nomor Rekening', textAlign: 'left' },
                { accessor: 'namaRekening', title: 'Nama di rekening', textAlign: 'left' },
                { accessor: 'statusRek', title: 'Status',
                    render: (record) => (
                        <Badge
                            color={
                                record.statusRek == "dikembalikan"
                                        ? "red"
                                : record.statusRek == "menunggu"
                                        ? "blue"
                                : record.statusRek == "disetujui"
                                        ? "green"    
                                : record.statusRek == "kosong"
                                        ? "grey"      
                                : "grey"
                                }
                        >
                        {record.statusRek}
                        </Badge>
                     )                  
                },
                {
                    accessor: 'action', title: 'Aksi', textAlign: 'center', width: 100,
                    render: (record) => (
                        <Group>
                            <ActionIcon
                                onClick={() => showModal({ record, action: 'setuju', fetchRekening })}
                                title='Setujui'
                                color='green'
                                variant='subtle'
                            >
                                <IconCheck />
                            </ActionIcon>
                            <ActionIcon
                                onClick={() => showModal({ record, action: 'tolak', fetchRekening })}
                                title='Tolak'
                                color='red'
                                variant='subtle'
                            >
                                <IconX />
                            </ActionIcon>
                        </Group>
                    )
                },
                { accessor: 'catatanRek', title: 'Catatan', textAlign: 'left',
                    render: (record) => (
                        <Text
                            size="sm"
                            style={{
                                color: record.statusRek === 'disetujui' ? 'transparent' : undefined,
                            }}
                        >
                        {record.catatanRek}
                        </Text>
                    ),
                 },
            ]}
            records={dokumen}
            totalRecords={total}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={setPage}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
        />
        </>
    )
}

const showModal = ({ record, action, fetchRekening }: { record: any; action: 'setuju' | 'tolak'; fetchRekening: () => void }) => {

    if (action === 'setuju') {
        openConfirmModal({
            centered: true,
            children: (
                <Text size="sm">
                    Apakah anda yakin ingin menyetujui data rekening mahasiswa {record.nama}?
                </Text>
            ),
            labels: { confirm: 'Ya', cancel: 'Tidak' },
            cancelProps: { variant: 'light', color: 'gray' },
            confirmProps: { variant: 'light', color: 'green' },
            onCancel: () => console.log('Cancel'),
            onConfirm: async () => {
                confirmRekening(record.mahasiswaId, { status: 'disetujui' }).then(() => {
                    notifications.show({
                        title: 'Berhasil',
                        message: 'Data berhasil disetujui',
                        color: 'green',
                    });
                    fetchRekening();
                }).catch((error) => {
                    notifications.show({
                        title: 'Gagal',
                        message: error.message || 'Terjadi kesalahan saat menyetujui dokumen',
                        color: 'red',
                    });
                });
            }
        });
    }
    else if (action === 'tolak') {
        const catatanRef = { current: '' }
        openConfirmModal({
            children: (
                <Textarea
                    label="Isi atau ubah pengumuman"
                    description="Isi pengumuman mengenai kesalahan pengisian rekening"
                    onChange={(e) => catatanRef.current = e.currentTarget.value}
                />
            ),
            labels: { confirm: 'Ya', cancel: 'Tidak' },
            cancelProps: { variant: 'light', color: 'gray' },
            confirmProps: { variant: 'light', color: 'green' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => {
                const catatan = catatanRef.current.trim()
                console.log(record.mahasiswaId, { status: 'dikembalikan', catatan: catatan })
                confirmRekening(record.mahasiswaId, { status: 'dikembalikan', catatan: catatan }).then(() => {
                    notifications.show({
                        title: 'Berhasil',
                        message: 'Berhasil mengisi catatan',
                        color: 'green',
                    });
                    fetchRekening();
                }).catch((error) => {
                    notifications.show({
                        title: 'Gagal',
                        message: error.message || 'Terjadi kesalahan saat menyetujui dokumen',
                        color: 'red',
                    });
                });
            }
        });
    }
};

export default TableRekening