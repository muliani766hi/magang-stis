'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ActionIcon, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core'
import TablePembimbingLapanganAdminSatker from '@/components/Table/TablePembimbingLapangan/TablePembimbingLapanganAdminSatker'
import { IconEye, IconEyeOff, IconFileImport, IconPlus, IconSearch, IconX } from '@tabler/icons-react'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import { getAllPembimbingLapangan, postPembimbingLapangan } from '@/utils/kelola-user/pembimbing-lapangan'
import { useForm } from '@mantine/form'
import { getUnitKerja } from '@/utils/unit-kerja'
import { getAllMahasiswa } from '@/utils/kelola-user/mahasiswa'

const KelolaPembimbingLapangan = () => {
    const [data, setData] = useState([]);
    const [kodeSatker, setKodeSatker] = useState('')
    const [dataMahasiswa, setDataMahasiswa] = useState<{ value: string; label: string; }[]>([]);
    const [dataMahasiswaFull, setDataMahasiswaFull] = useState<[]>([]);
    const [loading, setLoading] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);
    const submitButtonRef = useRef(null);
    const [loadingButton, setLoadingButton] = useState(false);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchNama, setSearchNama] = useState('');
    const [debouncedSearchNama] = useDebouncedValue(searchNama, 300);
    const [visible, setVisible] = useState(false);

    const fetchData = async (currentPage = page) => {
        try {
            const response = await getAllPembimbingLapangan({
                searchNama: debouncedSearchNama,
                page: currentPage,
                pageSize,
            });
            let modifiedData = response.data.map((item:  any) => ({
                ...item,
                id: item.pemlapId,  // Add the `id` field using `pemlapId`
                user: { email: item.email },
                satker: { nama: item.namaSatker },
            }));
            modifiedData = modifiedData.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
            setData(modifiedData);
            setTotalRecords(response.total);
            console.log("data sini", modifiedData)

            // modif mahasiswa
            if(!dataMahasiswa.length || !dataMahasiswaFull){
                const response3 = await getAllMahasiswa();
                let modifiedDataMahasiswa = response3.data.map((item: { mahasiswaId: any; nama: any; }) => ({
                    value: String(item.mahasiswaId),
                    label: item.nama
                }));
                setDataMahasiswa(modifiedDataMahasiswa);
                setDataMahasiswaFull(response3.data);
            }

            if(!kodeSatker.length){
                const response2 = await getUnitKerja();
                setKodeSatker(response2.data[0].kodeSatker);
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
    }, [debouncedSearchNama]);

    useEffect(() => {
        setLoading(true);
        fetchData(page);
    }, [page, pageSize]);    

    // useEffect(() => {
    //     fetchData();
    // }, []);

    const form = useForm({
        initialValues: {
            nip: '',
            nama: '',
            satker: kodeSatker,
            email: '',
            password: '',
        },
        validate: {
            nip: (value) =>
                value !== '' ? null : 'NIP tidak boleh kosong',
            nama: (value) =>
                value !== '' ? null : 'Nama tidak boleh kosong',
            // satker: (value) =>
            //     value !== '' ? null : 'Satker tidak boleh kosong',
            email: (value) => {
                if (value === '') {
                    return 'Email tidak boleh kosong';
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                // Test the value against the regex pattern
                if (!emailRegex.test(value)) {
                    return 'Alamat email tidak valid';
                }
            },
            password: (value) => {
                if (value === '') {
                    return 'Password tidak boleh kosong';
                } else if (value.length < 6) {
                    return 'Password minimal 6 karakter';
                }
            }
            ,
        },
    })

    return (
        <>
            <Text c="dimmed" mb="md">Kelola Pembimbing Lapangan</Text>
            <Group mb={10}>
                <Button leftSection={<IconPlus size={14} />}
                    onClick={() => {
                        open();
                        form.setValues({ 'satker': kodeSatker });
                    }}
                >Tambah</Button>
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
            </Group >
            <TablePembimbingLapanganAdminSatker 
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
                            label="Kode Satker"
                            placeholder="Masukkan Kode Satker"
                            required
                            style={{ display: 'none' }}
                            {...form.getInputProps('satker')}
                        /> */}
                        <TextInput
                            label="Email"
                            placeholder="Masukkan Email"
                            // required
                            {...form.getInputProps('email')}
                        />
                        {/* <TextInput
                            label="Password"
                            placeholder="Masukkan Password"
                            // required
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