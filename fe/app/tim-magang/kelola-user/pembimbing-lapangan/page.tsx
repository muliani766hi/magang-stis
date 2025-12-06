'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button, Group, Modal, Select, Stack, Text, TextInput } from '@mantine/core'
import TablePembimbingLapangan from '@/components/Table/TablePembimbingLapangan/TablePembimbingLapangan'
import { IconFileImport, IconPlus } from '@tabler/icons-react'
import { RecordPemlap } from '@/components/Table/TablePembimbingLapangan/TablePembimbingLapangan'
import { getAllMahasiswa, getToken } from '@/utils/kelola-user/mahasiswa'
import { notifications } from '@mantine/notifications'
import { getAllPembimbingLapangan, postPembimbingLapangan } from '@/utils/kelola-user/pembimbing-lapangan'
import { useDisclosure } from '@mantine/hooks'
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

    const fetchData = async () => {
        try {
            const response = await getAllPembimbingLapangan();
            const response2 = await getUnitKerja();
            const response3 = await getAllMahasiswa();

            let modifiedData = response.data.map((item: { pemlapId: any; }) => ({
                ...item,
                id: item.pemlapId,  // Add the `id` field using `pemlapId`
            }));
            modifiedData = modifiedData.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
            // console.log(modifiedData);
            setData(modifiedData);

            // data satker for select
            let modifiedDataSatker = response2.data.map((item: { kodeSatker: any; nama: any; }) => ({
                value: String(item.kodeSatker),
                label: item.nama
            }));
            // console.log(modifiedDataSatker);
            setDataSatker(modifiedDataSatker);

            // modif mahasiswa
            let modifiedDataMahasiswa = response3.data.map((item: { mahasiswaId: any; nama: any; }) => ({
                value: String(item.mahasiswaId),
                label: item.nama
            }));
            // console.log(modifiedDataMahasiswa);
            setDataMahasiswa(modifiedDataMahasiswa);
            setDataMahasiswaFull(response3.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
            <TablePembimbingLapangan records={data} loading={loading} fetchData={fetchData} dataMahasiswa={dataMahasiswa} dataMahasiswaFull={dataMahasiswaFull} />

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
                        <TextInput
                            label="Password"
                            placeholder="Masukkan Password"

                            // type="password"
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