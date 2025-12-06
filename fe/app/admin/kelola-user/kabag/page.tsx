'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Group, Modal, Select, Stack, Text, TextInput } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { getProvinsi } from '@/utils/provinsi'
import { getAllKabag, postKabag } from '@/utils/kelola-user/kabag'
import TableAdminBau from '@/components/Table/TableAdminBau/TableAdminBau'

const KelolaKabag = () => {
    const [data, setData] = useState([]);
    const [dataProvinsi, setDataProvinsi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);
    const submitButtonRef = useRef(null);
    const [loadingButton, setLoadingButton] = useState(false);

    const fetchData = async () => {
        try {
            const response = await getAllKabag();
            const response2 = await getProvinsi();

            let modifiedData = response.data.map((item: { adminProvinsiId: any; }) => ({
                ...item,
                id: item.adminProvinsiId,  // Add the `id` field using `adminProvinsiId`
            }));
            modifiedData = modifiedData.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
            // console.log(modifiedData);
            setData(modifiedData);

            // set dataProvinsi
            let modifiedDataProvinsi = response2.data.map((item: { kodeProvinsi: any; nama: any; }) => ({
                value: String(item.kodeProvinsi),
                label: item.nama
            }));

            setDataProvinsi(modifiedDataProvinsi);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const form = useForm({
        initialValues: {
            nip: '',
            nama: '',
            email: '',
            password: '',
        },
        validate: {
            nip: (value) =>
                value !== '' ? null : 'NIP tidak boleh kosong',
            nama: (value) =>
                value !== '' ? null : 'Nama tidak boleh kosong',
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
        <Text c="dimmed" mb="md">Kelola Bagian Keuangan</Text>
        <Group mb={10}>
            <Button leftSection={<IconPlus size={14} />}
                onClick={
                    open
                }>
                Tambah
            </Button>
        </Group>
        <TableAdminBau records={data} loading={loading} fetchData={fetchData} />

        <Modal
            size="md"
            opened={opened}
            onClose={close}
            closeOnClickOutside={false}
            title={<Text size="xl">Tambah Bagian Keuangan</Text>}
            centered
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <form onSubmit={form.onSubmit(async (values) => {
                try {
                    setLoadingButton(true);

                    const response = await postKabag(values);

                    notifications.show({
                        title: 'Berhasil',
                        message: 'Bagian keuangan berhasil ditambahkan',
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
                        message: 'Bagian keuangan gagal ditambahkan',
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
                                title: 'Batal Penambahan keuangan',
                                centered: true,
                                children: (
                                    <Text size="sm">
                                        Apakah Anda yakin ingin membatalkan penambahan keuangan ini?
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
                                            Apakah Anda yakin ingin menyimpan data keuangan ini?
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

export default KelolaKabag