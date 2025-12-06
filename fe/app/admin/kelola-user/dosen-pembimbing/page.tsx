'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ActionIcon, Button, Group, Modal, Select, Stack, Text, TextInput } from '@mantine/core'
import TableDosenPembimbing from '@/components/Table/TableDosenPembimbing/TableDosenPembimbing'
import { IconEye, IconEyeOff, IconPlus, IconSearch, IconX } from '@tabler/icons-react'
import { getAllMahasiswa, getToken } from '@/utils/kelola-user/mahasiswa'
import { notifications } from '@mantine/notifications'
import { getAllDosenPembimbing, postDosenPembimbing } from '@/utils/kelola-user/dosen-pembimbing'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'

const dataProdi = [
    { value: "DIII ST", label: "DIII ST" },
    { value: "DIV KS", label: "DIV KS" },
    { value: "DIV ST", label: "DIV ST" }
]

const KelolaDosenPembimbing = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);
    const submitButtonRef = useRef(null);
    const [loadingButton, setLoadingButton] = useState(false);
    const [dataMahasiswa, setDataMahasiswa] = useState<{ value: string; label: string; }[]>([]);
    const [dataMahasiswaFull, setDataMahasiswaFull] = useState<[]>([]);
    const [selectedProdi, setSelectedProdi] = useState<string | null>(null);
    const [searchNama, setSearchNama] = useState('');
    const [searchNIP, setSearchNIP] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [debouncedSearchNama] = useDebouncedValue(searchNama, 300);
    const [debouncedSearchNIP] = useDebouncedValue(searchNIP, 300);
    const [visible, setVisible] = useState(false);
    
    const fetchData = async (currentPage = page) => {
        try {
            setLoading(true);
            const response = await getAllDosenPembimbing({
                searchNama: debouncedSearchNama,
                searchNIP: debouncedSearchNIP,
                page: currentPage,
                pageSize,
            });
            let modifiedData = response.data.map((item: { dosenId: any; }) => ({
                ...item,
                id: item.dosenId,  // Add the `id` field using `dosenId`
            }));
            // modifiedData = modifiedData.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
            setData(modifiedData);
            setTotalRecords(response.total);

            // mahasiswa
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
    }, [debouncedSearchNIP, debouncedSearchNama]);

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
            prodi: '',
            email: '',
            password: '',
        },
        validate: {
            nip: (value) =>
                value !== '' ? null : 'NIP tidak boleh kosong',
            nama: (value) =>
                value !== '' ? null : 'Nama tidak boleh kosong',
            prodi: (value) =>
                value !== '' ? null : 'Prodi tidak boleh kosong',
            email: (value) => {
                if (!value) {
                    return 'Email tidak boleh kosong';
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return 'Email tidak valid';
                }
            },
            password: (value) => {
                if (!value) {
                    return 'Password tidak boleh kosong';
                }
                if (value.length < 8) {
                    return "Password minimal 8 karakter";
                }
            }

        },
    })
    return (
        <>
            <Text c="dimmed" mb="md">Kelola Dosen Pembimbing</Text>
            <Group mb={10}>
                <Button leftSection={<IconPlus size={14} />}
                    onClick={
                        open
                    }>
                    Tambah
                </Button>
            </Group>
            {/* <TableDosenPembimbing records={data} loading={loading} fetchData={fetchData} dataMahasiswa={dataMahasiswa} dataMahasiswaFull={dataMahasiswaFull} /> */}
            <Group mb="sm" grow>
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
            </Group>

            <TableDosenPembimbing
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
                title={<Text size="xl">Tambah Dosen Pembimbing</Text>}
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <form onSubmit={form.onSubmit(async (values) => {
                    try {
                        setLoadingButton(true);

                        const response = await postDosenPembimbing(values);

                        notifications.show({
                            title: 'Berhasil',
                            message: 'Dosen pembimbing berhasil ditambahkan',
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
                            message: 'Dosen pembimbing gagal ditambahkan',
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
                            // required
                            {...form.getInputProps('nip')}
                        />
                        <TextInput
                            label="Nama"
                            placeholder="Masukkan Nama"
                            // required
                            {...form.getInputProps('nama')}
                        />
                        {/* <TextInput
                            label="Prodi"
                            placeholder="Masukkan Prodi"
                            // required
                            {...form.getInputProps('prodi')}
                        /> */}
                        <Select
                            allowDeselect={false}
                            label="Prodi"
                            required
                            data={dataProdi.map((args) => ({
                                value: args.value,
                                label: args.label
                            }))}
                            description="Pilih Prodi"
                            value={selectedProdi || form.values.prodi}
                            onChange={(value) => {
                                setSelectedProdi(value);
                                form.setFieldValue("prodi", value ?? "");
                            }}
                        />
                        <TextInput
                            label="Email"
                            placeholder="Masukkan Email"
                            // required
                            {...form.getInputProps('email')}
                        />
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
                                style={{ display: 'none' }} // Hide the button
                                color="blue"
                                variant="light">Simpan</Button>
                            <Button onClick={() => {
                                modals.openConfirmModal({
                                    title: 'Batal Penambahan Dosen Pembimbing',
                                    centered: true,
                                    children: (
                                        <Text size="sm">
                                            Apakah Anda yakin ingin membatalkan penambahan dosen pembimbing ini?
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
                                                Apakah Anda yakin ingin menyimpan data dosen pembimbing ini?
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

export default KelolaDosenPembimbing