'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ActionIcon, Button, Group, Modal, Select, Stack, Text, TextInput } from '@mantine/core'
import { IconEye, IconEyeOff, IconFileImport, IconMapPin, IconPlus, IconSearch, IconX } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { getToken } from '@/utils/kelola-user/mahasiswa'
import { getAllAdminProvinsi, postAdminProvinsi } from '@/utils/kelola-user/admin-provinsi'
import TableAdminProvinsi from '@/components/Table/TableAdminProvinsi/TableAdminProvinsi'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { getProvinsi } from '@/utils/provinsi'
import { useDebouncedValue } from '@mantine/hooks';


const KelolaAdminProvinsi = () => {
    const [data, setData] = useState([]);
    const [dataProvinsi, setDataProvinsi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);
    const submitButtonRef = useRef(null);
    const [loadingButton, setLoadingButton] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchNama, setSearchNama] = useState('');
    const [searchNIP, setSearchNIP] = useState('');
    const [filterProvinsi, setFilterProvinsi] = useState('');
    const [debouncedFilterProvinsi] = useDebouncedValue(filterProvinsi, 300);
    const [debouncedSearchNama] = useDebouncedValue(searchNama, 300); // 200ms delay
    const [debouncedSearchNIP] = useDebouncedValue(searchNIP, 300);
    const [visible, setVisible] = useState(false);


    const fetchData = async (currentPage = page) => {
        try {
            setLoading(true);
            const response = await getAllAdminProvinsi({
                searchNama: debouncedSearchNama,
                searchNIP: debouncedSearchNIP,
                namaProvinsi: debouncedFilterProvinsi,
                page: currentPage,
                pageSize,
            });
            let modifiedData = response.data.adminProvinsis.map((item: { adminProvinsiId: any; }) => ({
            ...item,
            id: item.adminProvinsiId,
            }));
            setData(modifiedData);
            setTotalRecords(response.total);

            if (!dataProvinsi?.length){
                const response2 = await getProvinsi();
                let modifiedDataProvinsi = response2.data.map((item: { kodeProvinsi: any; nama: any; }) => ({
                    value: item.nama, 
                    label: item.nama
                }));

                setDataProvinsi(modifiedDataProvinsi);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
        };

    useEffect(() => {
        setPage(1);
        // setLoading(true);
        fetchData(1); // <= fetch dengan page 1
    }, [debouncedSearchNama, debouncedSearchNIP, debouncedFilterProvinsi]);

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
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-provinsi/bulk`, requestOptions);
                // console.log(await response.json());

                if (!response.ok) {
                    throw new Error('Failed to upload file');
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
            kodeProvinsi: '',
            email: '',
            password: '',
        },
        validate: {
            nip: (value) =>
                value !== '' ? null : 'NIP tidak boleh kosong',
            nama: (value) =>
                value !== '' ? null : 'Nama tidak boleh kosong',
            kodeProvinsi: (value) =>
                value !== '' ? null : 'kodeProvinsi tidak boleh kosong',
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
                if (!value) {
                    return 'Password tidak boleh kosong';
                }
                if (value.length < 8) {
                    return 'Password minimal 8 karakter';
                }
            }

        },
    })
    return (<>
        <Text c="dimmed" mb="md">Kelola Admin Provinsi</Text>
        <Group mb={10}>
            <Button leftSection={<IconPlus size={14} />}
                onClick={
                    open
                }>
                Tambah
            </Button>
            <Button leftSection={<IconFileImport size={14} />}>
                <input type="file" accept=".xlsx" onChange={handleFileUpload} style={{ display: 'none' }} id="fileUpload" />
                <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>Impor</label>
            </Button>
        </Group>
        {/* <TableAdminProvinsi records={data} loading={loading} fetchData={fetchData} /> */}

        <Group grow mb="md">
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
            placeholder="Cari NIP"
            value={searchNIP}
            onChange={(e) => setSearchNIP(e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            rightSection={
            searchNIP && (
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchNIP('')}>
                <IconX size={14} />
                </ActionIcon>
            )
            }
        />
        <Select
            placeholder="Cari Provinsi"
            searchable
            clearable
            value={filterProvinsi}
            onChange={(val) => setFilterProvinsi(val || '')}
            data={dataProvinsi}
            leftSection={<IconMapPin size={16} />}
        />
        </Group>

        <TableAdminProvinsi
            records={data}
            loading={loading}
            fetchData={fetchData}
            page={page}
            pageSize={pageSize}
            totalRecords={totalRecords}
            setPage={setPage}
            setPageSize={setPageSize}
            searchNama={searchNama}
            searchNIP={searchNIP}
            setSearchNama={setSearchNama}
            setSearchNIP={setSearchNIP}
        />


        <Modal
            size="md"
            opened={opened}
            onClose={close}
            closeOnClickOutside={false}
            title={<Text size="xl">Tambah Admin Provinsi</Text>}
            centered
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <form onSubmit={form.onSubmit(async (values) => {
                try {
                    setLoadingButton(true);

                    const response = await postAdminProvinsi(values);

                    notifications.show({
                        title: 'Berhasil',
                        message: 'Admin Provinsi berhasil ditambahkan',
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
                        message: 'Admin Provinsi gagal ditambahkan',
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
                        label="Provinsi"
                        placeholder="Pilih Provinsi"

                        data={dataProvinsi}
                        {...form.getInputProps('kodeProvinsi')}
                    />
                    <TextInput
                        label="Email"
                        placeholder="Masukkan Email"

                        {...form.getInputProps('email')}
                    />
                    {/* <TextInput
                        label="Password"
                        placeholder="Masukkan Password"

                        // type="password"
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
                                title: 'Batal Penambahan Admin Provinsi',
                                centered: true,
                                children: (
                                    <Text size="sm">
                                        Apakah Anda yakin ingin membatalkan penambahan Admin Provinsi ini?
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
                                            Apakah Anda yakin ingin menyimpan data Admin Provinsi ini?
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

export default KelolaAdminProvinsi