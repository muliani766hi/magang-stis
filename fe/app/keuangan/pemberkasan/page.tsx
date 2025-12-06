'use client'
import {
    Button, ActionIcon, Card, Group, Stack, Text, rem, Textarea,
    TextInput,
    Badge,
    SimpleGrid,
    Select
} from '@mantine/core'
import React, { useState, useEffect } from 'react'
import { IconUpload, IconX, IconCheck, IconDownload, IconSearch  } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useForm } from '@mantine/form';
import { DataTable } from "mantine-datatable";
import { getDokumenTranslok, putDokumenTranslok } from '@/utils/dokumen-translok'
import { openConfirmModal } from '@mantine/modals';
import { confirmDokumenTranslok } from '@/utils/dokumen-translok';
import { getToken } from '@/utils/get-profile'
import { useDebouncedValue } from '@mantine/hooks';

interface FormValues {
    bulan: Date;
    fileDokumen: File[];
}

const PAGE_SIZES = [10, 15, 20];
const getFileBukti = async (laporan: string[]) => {
    if (typeof window === 'undefined') {
        // This code is running on the server
        console.error('window is not defined');
        return;
    }

    try {
        const token = await getToken()

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dokumen-translok/download?fileLaporan=${laporan}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        });

        if (!response.ok) throw new Error('Network response was not ok.');

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        // Open the blob URL in a new tab
        const newWindow = window.open(blobUrl, '_blank');
        if (newWindow) {
            newWindow.onload = () => window.URL.revokeObjectURL(blobUrl); // Revoke URL once loaded
        } else {
            // If the browser blocks the pop-up, inform the user
            alert('Please allow pop-ups for this website');
        }
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
}


const Pemberkasan = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchNama, setSearchNama] = useState('');
    const [searchKelas, setSearchKelas] = useState('');
    const [searchSatker, setSearchSatker] = useState('');
    const [searchBulan, setSearchBulan] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [debouncedSearchNama] = useDebouncedValue(searchNama, 400);
    const [debouncedSearchKelas] = useDebouncedValue(searchKelas, 400);
    const [debouncedSearchSatker] = useDebouncedValue(searchSatker, 400);
    const [debouncedSearchBulan] = useDebouncedValue(searchBulan, 400);
    const [debouncedSearchStatus] = useDebouncedValue(searchStatus, 400);

    const fetchData = async (currentPage = page) => {
        setLoading(true)
        const response = await getDokumenTranslok({
            searchNama: debouncedSearchNama,
            searchKelas: debouncedSearchKelas,
            searchSatker: debouncedSearchSatker,
            searchBulan: debouncedSearchBulan,
            searchStatus: debouncedSearchStatus,
            page: currentPage,
            pageSize,
        });
        setTotal(response.total)
        setRecords(response.data);
        // console.log(response.data)
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setPage(1);;
        fetchData(1); // <= fetch dengan page 1
    }, [ debouncedSearchNama, debouncedSearchKelas, , debouncedSearchSatker, debouncedSearchBulan, debouncedSearchStatus]);

    // Page atau pageSize berubah: fetch data ulang
    useEffect(() => {
        fetchData(page);
    }, [page, pageSize]);

    const updateform = useForm<FormValues>({
        initialValues: {
            bulan: new Date(),
            fileDokumen: [],
        },

        validate: {
            fileDokumen: (fileDokumenTranslok: File[]) => {
                if (fileDokumenTranslok.length === 0) {
                    return 'File tidak boleh kosong';
                }
                if (fileDokumenTranslok.some((file) => file.size > 20 * 1024 ** 2)) {
                    return 'Ukuran file tidak boleh melebihi 20mb';
                }
            },

        },
    });

    const [editingRecord, setEditingRecord] = useState<any | null>(null);
    const handleUpdateFileUpload = async (id: any, value: any) => {
        const formdata = new FormData();


        formdata.append("file", value.fileDokumen[0]);
        try {
            const response = await putDokumenTranslok(id, formdata);
            console.log('Upload berhasil', response);
        } catch (error) {
            console.error('Upload gagal', error);
        }
    };

    return (
        <>
            <Text size="xl">Pemberkasan</Text>
            <Stack style={{ marginTop: "10px" }}>
                <SimpleGrid cols={{ md: 2, xl: 5 }}>    
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
                    placeholder="Cari Satker"
                    value={searchSatker}
                    onChange={(e) => setSearchSatker(e.currentTarget.value)}
                    leftSection={<IconSearch size={16} />}
                    rightSection={
                    searchSatker && (
                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchSatker('')}>
                        <IconX size={14} />
                        </ActionIcon>
                    )
                    }
                />
                <Select 
                    placeholder="Cari Bulan"
                    searchable
                    clearable
                    value={searchBulan}
                    onChange={(val) => setSearchBulan(val || '')}
                    data={[
                        { value: '1', label: 'Januari' },
                        { value: '2', label: 'Februari' },
                        { value: '3', label: 'Maret' },
                        { value: '4', label: 'April' },
                        { value: '5', label: 'Mei' },
                        { value: '6', label: 'Juni' },
                        { value: '7', label: 'Juli' },
                        { value: '8', label: 'Agustus' },
                        { value: '9', label: 'September' },
                        { value: '10', label: 'Oktober' },
                        { value: '11', label: 'November' },
                        { value: '12', label: 'Desember' },
                    ]}
                    leftSection={<IconSearch size={16} />}
                />
                <Select
                    placeholder="Cari Status"
                    searchable
                    clearable
                    value={searchStatus}
                    onChange={(val) => setSearchStatus(val || '')}
                    data={[
                        // { value: 'kosong', label: 'Kosong' },      
                        { value: 'menunggu', label: 'Menunggu' },
                        { value: 'disetujui', label: 'Disetujui' },
                        { value: 'dikembalikan', label: 'Dikembalikan' },
                    ]}
                    leftSection={<IconSearch size={16} />}
                />
                </SimpleGrid>    
                <DataTable
                    fetching={loading}
                    highlightOnHover
                    withTableBorder
                    // withColumnBorders
                    records={records}
                     style={{ minHeight: records.length > 0 ? '0' : '180px' }}  
                    columns={[
                        // {
                        //     accessor: "nim",
                        //     title: "Nim",
                        // },
                        { accessor: 'no', title: 'No', textAlign: 'center', width: 40, render: (_, index) => (page - 1) * pageSize + (index + 1) },
                        {
                            accessor: "nama",
                            title: "Nama",                          
                        },
                        {
                            accessor: "kelas",
                            title: "Kelas",     
                        },
                        {
                            accessor: "satker",
                            title: "Satker",                          
                        },
                        {
                            accessor: "bulan",
                            title: "Bulan",
                            render: (record) => {
                                // Mengonversi data bulan menjadi nama bulan
                                const monthIndex = new Date(record.bulan).getMonth(); // Menangkap index bulan
                                const months = [
                                    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                                ];
                                return months[monthIndex]; // Mengambil nama bulan berdasarkan index
                            }                             
                        },
                        {
                            accessor: "totalPresensi",
                            title: "Jml Hadir",
                        },
                        {
                            accessor: "dokumen",
                            title: "Dokumen",
                            render: (record: any) => (
                                record.dokumen ? (
                                  <IconDownload
                                    size={18}
                                    style={{ fontWeight: "bold", cursor: "pointer" }}
                                    onClick={() => getFileBukti(record.dokumen)}
                                  />
                                ) : (
                                  <Text size="sm" c="dimmed">Belum ada</Text>
                                )
                              )    
                        },
                        {
                            accessor: "updateKe",
                            title: "Update Ke-",
                        },
                        {
                            accessor: "update",
                            title: "Tgl Unggah",
                        },
                        {
                            accessor: "status",
                            title: "Status",
                            render: (record) => (
                            <Badge
                                color={
                                    record.status == "dikembalikan"
                                        ? "red"
                                    : record.status == "menunggu"
                                        ? "grey"
                                    : record.status == "disetujui"
                                        ? "green"        
                                    : "grey"
                                }
                            >
                            {record.status}
                            </Badge>
                            ),                              
                        },
                        {
                            accessor: 'action', title: 'Aksi', textAlign: 'center', width: 100,
                            render: (record) => (
                                <Group>
                                    <ActionIcon
                                        onClick={() => showModal({ record, action: 'setuju', fetchData })}
                                        title='Setujui'
                                        color='green'
                                        variant='subtle'
                                    >
                                        <IconCheck />
                                    </ActionIcon>
                                    <ActionIcon
                                        onClick={() => showModal({ record, action: 'tolak', fetchData })}
                                        title='Tolak'
                                        color='red'
                                        variant='subtle'
                                    >
                                        <IconX />
                                    </ActionIcon>
                                </Group>
                            )
                        },
                        {
                            accessor: "catatan",
                            title: "Catatan",
                            render: (record) => (
                                <Text
                                    size="sm"
                                    style={{
                                        color: record.status === 'disetujui' ? 'transparent' : undefined,
                                    }}
                                >
                                {record.catatan}
                                </Text>
                            ),
                        }                        
                    ]}
                    totalRecords={total}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={setPage}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                />

            </Stack>
        </>
    )
}

const showModal = ({ record, action, fetchData }: { record: any; action: 'setuju' | 'tolak'; fetchData: () => void }) => {

    console.log('test', record)
    if (action === 'setuju') {
        openConfirmModal({
            centered: true,
            children: (
                <Text size="sm">
                    Apakah anda yakin ingin menyetujui dokumen mahasiswa {record.nama}?
                </Text>
            ),
            labels: { confirm: 'Ya', cancel: 'Tidak' },
            cancelProps: { variant: 'light', color: 'gray' },
            confirmProps: { variant: 'light', color: 'green' },
            onCancel: () => console.log('Cancel'),
            onConfirm: async () => {
                confirmDokumenTranslok(record.mahasiswaId, { id : record.id , status: 'disetujui' }).then(() => {
                    notifications.show({
                        title: 'Berhasil',
                        message: 'Dokumen berhasil disetujui',
                        color: 'green',
                    });
                    fetchData();
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
                    description="Isi pengumuman mengenai kesalahan pengisian pemberkasan"
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
                confirmDokumenTranslok(record.mahasiswaId, { id: record.id, status: 'dikembalikan', catatan: catatan }).then(() => {
                    notifications.show({
                        title: 'Berhasil',
                        message: 'Dokumen berhasil disetujui',
                        color: 'green',
                    });
                    fetchData();
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

export default Pemberkasan