"use client"
import CardListMagang, { RecordMagang } from '@/components/CardList/CardListMagang/CardListMagang';
import { Box, Button, Card, Group, Loader, Modal, Stack, Text, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { DateInput } from '@mantine/dates';
import { IconPlus } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications';
import { useEffect, useRef, useState } from 'react';
import { modals } from '@mantine/modals';
import { getBimbinganMagang, postBimbinganMagang } from '@/utils/bimbingan-magang';

const records: RecordMagang[] =
    [
        {
            id: 1,
            jenis: 1, // incremental
            tanggal: '2023-08-21',
            deskripsi: 'Lorem ipsum dolor sit amet',
            status: 'Disetujui',
            tempat: 'https://meet.google.com/abc-123'
        },
        {
            id: 2,
            jenis: 2,
            tanggal: '2023-09-21',
            deskripsi: 'Lorem ipsum dolor sit amet',
            status: 'Menunggu',
            tempat: 'https://meet.google.com/abc-123'
        }
    ]

// fetch data from api


const BimbinganMagang = () => {
    const submitButtonRef = useRef(null);

    const [opened, { open, close }] = useDisclosure(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        // const response = await fetch('/api/bimbingan-magang/mahasiswa');
        // const res = await response.json();
        // // Update your state with the new data
        const response = await getBimbinganMagang();

        response.data.forEach((item: any, index: number) => {
            item.jenis = index + 1;
        });

        let modifiedData = response.data.map((item: { bimbinganId: any; }) => ({
            ...item,
            id: item.bimbinganId,  // Add the `id` field using `bimbinganId`
        }));

        setData(modifiedData);
        setLoading(false)
    };


    useEffect(() => {
        fetchData();
    }, []);

    const form = useForm({
        initialValues: {
            tanggal: new Date(),
            tempat: '',
            deskripsi: '',
        },

        validate: {
            deskripsi: (value) => {
                if (!value) {
                    return 'Deskripsi tidak boleh kosong';
                }
            }
        }
    })

    return (
        <>
            <Text c="dimmed" mb="md">Bimbingan Magang</Text>

            {/* button ajukan bimbingan */}
            <Group mb={10}>
                <Button leftSection={<IconPlus size={14} />} onClick={open}>Ajukan Bimbingan</Button>
            </Group>

            {loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Loader />
            </div> : <CardListMagang records={data} fetchData={fetchData} />}

            <Modal
                size="md"
                opened={opened}
                onClose={close}
                closeOnClickOutside={false}
                title={<Text size="xl">Ajukan Bimbingan Magang</Text>}
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >


                <form onSubmit={form.onSubmit(async (values) => {
                    // console.log(values);
                    try {
                        const response = await postBimbinganMagang(values);
                        notifications.show({
                            title: 'Bimbingan diajukan',
                            message: 'Bimbingan magang berhasil diajukan',
                        })
                        close();
                        fetchData();
                    } catch (error) {
                        console.error('Error:', error);
                        notifications.show({
                            title: 'Gagal mengajukan bimbingan',
                            message: 'Terjadi kesalahan saat mengajukan bimbingan',
                            color: 'red',
                        });
                    }
                   
                })}>
                    <Stack gap="md">
                        <DateInput
                            // minDate={new Date()}
                            description="Tanggal bimbingan yang diajukan"
                            valueFormat='DD-MM-YYYY'
                            label="Tanggal"
                            {...form.getInputProps('tanggal')} />

                        <Textarea
                            label="Deskripsi"
                            description="Deskripsi yang menjelaskan kegiatan bimbingan"
                            {...form.getInputProps('deskripsi')} />

                        <TextInput
                            label="Tempat"
                            description="Dapat berupa link online meeting (Google Meet, Zoom, dll)"
                            {...form.getInputProps('tempat')} />

                        <Button
                            type="submit"
                            ref={submitButtonRef}
                            style={{ display: 'none' }} // Hide the button
                            color="blue"
                            variant="light">Simpan</Button>

                        <Button type="button"
                            onClick={() => {
                                modals.openConfirmModal({
                                    // title: 'Simpan Kegiatan',
                                    centered: true,
                                    children: (
                                        <Text size="sm">
                                            Apakah anda yakin ingin mengajukan bimbingan magang?
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
                            variant='light'
                        >Simpan</Button>
                    </Stack>
                </form>

            </Modal>

        </>
    );
}

export default BimbinganMagang