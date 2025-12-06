'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ActionIcon, Button, Group, Modal, Select, Stack, Text, TextInput } from '@mantine/core'
import TablePembimbingLapangan from '@/components/Table/TablePembimbingLapangan/TablePembimbingLapangan'
import { IconMapPin, IconPlus, IconSearch, IconX, IconEye, IconEyeOff } from '@tabler/icons-react'
import { getAllMahasiswa, getToken } from '@/utils/kelola-user/mahasiswa'
import { notifications } from '@mantine/notifications'
import { getAllPembimbingLapangan, postPembimbingLapangan } from '@/utils/kelola-user/pembimbing-lapangan'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { getUnitKerja } from '@/utils/unit-kerja'

const KelolaPembimbingLapangan = () => {
    const [data, setData] = useState([]);
    const [dataSatker, setDataSatker] = useState([]);
    const [loading, setLoading] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);
    const submitButtonRef = useRef(null);
    const [loadingButton, setLoadingButton] = useState(false);
    const [dataMahasiswa, setDataMahasiswa] = useState<{ value: string; label: string; }[]>([]);
    const [dataMahasiswaFull, setDataMahasiswaFull] = useState<[]>([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchNama, setSearchNama] = useState('');
    const [searchNIP, setSearchNIP] = useState('');
    const [filterSatker, setFilterSatker] = useState('');
    const [debouncedSearchNama] = useDebouncedValue(searchNama, 300);
    const [debouncedSearchNIP] = useDebouncedValue(searchNIP, 300);
    const [debouncedFilterSatker] = useDebouncedValue(filterSatker, 300);
    const [visible, setVisible] = useState(false);

    const fetchData = async (currentPage = page) => {
        try {
            setLoading(true);
            const response = await getAllPembimbingLapangan({
                searchNama: debouncedSearchNama,
                searchNIP: debouncedSearchNIP,
                kodeSatker: debouncedFilterSatker,
                page: currentPage,
                pageSize,
            });
            let modifiedData = response.data.map((item: any) => ({
                ...item,
                id: item.pemlapId,  // Add the `id` field using `pemlapId`
                user: { email: item.email },
                satker: { nama: item.namaSatker },
            }));
            // modifiedData = modifiedData.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
            setData(modifiedData);
            setTotalRecords(response.total);
            
            // data satker for select
            if(!dataSatker?.length){
                const response2 = await getUnitKerja();
                let modifiedDataSatker = response2.data.map((item: { kodeSatker: any; nama: any; }) => ({
                    value: String(item.kodeSatker),
                    label: item.nama
                }));
                setDataSatker(modifiedDataSatker);
            }

            // modif mahasiswa
            if(!dataMahasiswa?.length || !dataMahasiswaFull?.length){
                const response3 = await getAllMahasiswa();
                let modifiedDataMahasiswa = response3.data.map((item: { mahasiswaId: any; nama: any; }) => ({
                    value: String(item.mahasiswaId),
                    label: item.nama
                }));
                setDataMahasiswa(modifiedDataMahasiswa);
                setDataMahasiswaFull(response3.data);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        setLoading(true);
        fetchData(1); // <= fetch dengan page 1
    }, [debouncedSearchNama, debouncedSearchNIP, debouncedFilterSatker]);

    useEffect(() => {
        setLoading(true);
        fetchData(page);
    }, [page, pageSize]);       

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        const token = await getToken();
        console.log(token);
        if (file) {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            // myHeaders.append("Content-Type", "multipart/form-data");

            const formdata = new FormData();
            formdata.append("file", file);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
                // redirect: "follow"
            };

            // console.log(process.env.API_URL)

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dosen/excel`, requestOptions);
                // console.log(await response.json());

                if (!response.ok) {
                    throw new Error("Failed to upload file");
                }

                notifications.show(
                    {
                        title: "Berhasil",
                        message: "File berhasil diunggah",
                    }
                )
                fetchData();
            } catch (error) {
                console.error("Failed to upload file", error);
                notifications.show(
                    {
                        title: "Gagal",
                        message: "File gagal diunggah",
                        color: "red"
                    }
                )
            }
        }
    };

    const form = useForm({
        initialValues: {
            nip: '',
            nama: '',
            satker: '',
            email: '',
            password: '',
        },
        validate: {
            nip: (value) =>
                value !== '' ? null : 'NIP tidak boleh kosong',
            nama: (value) =>
                value !== '' ? null : 'Nama tidak boleh kosong',
            satker: (value) =>
                value !== '' ? null : 'Satker tidak boleh kosong',
            email: (value) => {
                if (value === '') {
                    return 'Email tidak boleh kosong';
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Email tidak valid';
                }
            },
            password: (value) => {
                if (value === '') {
                    return 'Password tidak boleh kosong';
                }
                if (value.length < 6) {
                    return 'Password minimal 6 karakter';
                }
            }

        },
    })
    return (
        <>
            <Text c="dimmed" mb="md">Kelola Pembimbing Lapangan</Text>
            <Group mb={10}>
                <Button leftSection={<IconPlus size={14} />}
                    onClick={
                        open
                    }>
                    Tambah
                </Button>
                {/* <Button leftSection={<IconFileImport size={14} />}>
                    <input type="file" accept=".xlsx" onChange={handleFileUpload} style={{ display: 'none' }} id="fileUpload" />
                    <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>Impor</label>
                </Button> */}
            </Group>

            <Group grow mb="md">
                <TextInput
                    placeholder="Cari Nama"
                    value={searchNama}
                    onChange={(e) => setSearchNama(e.currentTarget.value)}
                    leftSection={<IconSearch size={16} />}
                    rightSection={searchNama && (
                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchNama('')}>
                            <IconX size={14} />
                        </ActionIcon>
                    )}
                />
                <TextInput
                    placeholder="Cari NIP"
                    value={searchNIP}
                    onChange={(e) => setSearchNIP(e.currentTarget.value)}
                    leftSection={<IconSearch size={16} />}
                    rightSection={searchNIP && (
                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchNIP('')}>
                            <IconX size={14} />
                        </ActionIcon>
                    )}
                />
                <Select
                    placeholder="Cari Satker"
                    searchable
                    clearable
                    value={filterSatker}
                    onChange={(val) => setFilterSatker(val || '')}
                    data={dataSatker}
                    leftSection={<IconMapPin size={16} />}
                />
            </Group>

            {/* <TablePembimbingLapangan records={data} loading={loading} fetchData={fetchData} dataMahasiswa={dataMahasiswa} dataMahasiswaFull={dataMahasiswaFull} /> */}

            <TablePembimbingLapangan
                records={data}
                loading={loading}
                fetchData={fetchData}
                dataMahasiswa={dataMahasiswa}
                dataMahasiswaFull={dataMahasiswaFull}
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                totalRecords={totalRecords}
                searchNama={searchNama}
                setSearchNama={setSearchNama}
                searchNIP={searchNIP}
                setSearchNIP={setSearchNIP}
            />

            <Modal
                size="md"
                opened={opened}
                onClose={close}
                closeOnClickOutside={false}
                title={<Text size="xl">Tambah Pembimbing Lapangan</Text>}
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <form onSubmit={form.onSubmit(async (values) => {
                    try {
                        setLoadingButton(true);

                        const response = await postPembimbingLapangan(values);

                        notifications.show({
                            title: 'Berhasil',
                            message: 'Pembimbing Lapangan berhasil ditambahkan',
                            color: 'blue',
                        });


                        setLoading(true);
                        await fetchData();
                        close();
                        form.reset();
                    } catch (error) {
                        console.log(error);
                        notifications.show({
                            title: 'Gagal',
                            message: 'Pembimbing Lapangan gagal ditambahkan',
                            color: 'red',
                        });
                    } finally {
                        setLoadingButton(false);
                    }
                })}>
                    <Stack>
                        <TextInput
                            label="NIP"
                            placeholder="Masukkan NIP"

                            {...form.getInputProps('nip')}
                        />
                        <TextInput
                            label="Nama"
                            placeholder="Masukkan Nama"

                            {...form.getInputProps('nama')}
                        />
                        <Select
                            label="Satker"
                            placeholder="Pilih Satker"

                            searchable
                            data={dataSatker}
                            {...form.getInputProps('satker')}
                        />
                        <TextInput
                            label="Email"
                            placeholder="Masukkan Email"

                            {...form.getInputProps('email')}
                        />
                        {/* <TextInput
                            label="Password"
                            placeholder="Masukkan Password"

                            type="password"
                            {...form.getInputProps('password')}
                        /> */}
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

                        <Group justify="right">
                            <Button
                                loading={loadingButton}
                                type="submit"
                                ref={submitButtonRef}
                                style={{ display: 'none' }}
                                color="blue"
                                variant="light">Simpan</Button>
                            <Button onClick={() => {
                                modals.openConfirmModal({
                                    title: 'Batal Penambahan Pembimbing Lapangan',
                                    centered: true,
                                    children: (
                                        <Text size="sm">
                                            Apakah Anda yakin ingin membatalkan penambahan Pembimbing Lapangan ini?
                                        </Text>
                                    ),
                                    labels: { confirm: 'Ya', cancel: 'Tidak' },
                                    cancelProps: { variant: 'light', color: 'gray' },
                                    confirmProps: { variant: 'light', color: 'red' },
                                    onCancel: () => console.log('Cancel'),
                                    onConfirm: () => {
                                        form.reset();
                                        close();
                                    }
                                });
                            }}
                                color="red" variant="light">Batal</Button>
                            <Button
                                loading={loadingButton}
                                type="button"
                                onClick={() => {
                                    modals.openConfirmModal({
                                        // title: 'Simpan Kegiatan',
                                        centered: true,
                                        children: (
                                            <Text size="sm">
                                                Apakah Anda yakin ingin menyimpan data Pembimbing Lapangan ini?
                                            </Text>
                                        ),
                                        labels: { confirm: 'Ya', cancel: 'Tidak' },
                                        cancelProps: { variant: 'light', color: 'gray' },
                                        confirmProps: { variant: 'light', color: 'blue' },
                                        onCancel: () => console.log('Cancel'),
                                        onConfirm: () => {
                                            if (submitButtonRef.current) {
                                                (submitButtonRef.current as any).click();
                                            }
                                        }
                                    });
                                }}
                                color="blue"
                                variant="light">Simpan</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal >
        </>
    )
}

export default KelolaPembimbingLapangan