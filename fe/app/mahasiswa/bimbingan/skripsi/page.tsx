"use client"
import CardListSkripsi, { RecordSkripsi } from '@/components/CardList/CardListSkripsi/CardListSkripsi';
import { ActionIcon, Box, Button, Card, Group, Loader, Modal, rem, Stack, Text, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { DateInput, TimeInput } from '@mantine/dates';
import { IconClock, IconPlus } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications';
import { useEffect, useRef, useState } from 'react';
import { modals } from '@mantine/modals';
import { getBimbinganSkripsi, postBimbinganSkripsi } from '@/utils/bimbingan-skripsi';

// const records: RecordSkripsi[] =
//     [
//         {
//             izinBimbinganId: 1,
//             jenis: 1, // incremental
//             tanggal: '2023-08-21',
//             deskripsi: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore sapiente eos nostrum commodi, atque modi natus, in quas, ipsam ratione repellat nam asperiores nulla incidunt! Eum ullam saepe blanditiis, itaque totam quasi amet reiciendis iusto dignissimos ex laborum voluptatem asperiores necessitatibus quia voluptates veniam tenetur magni iste ut incidunt commodi.",
//             status: 'Disetujui',
//         },
//         {
//             izinBimbinganId: 2,
//             jenis: 2,
//             tanggal: '2023-09-21',
//             deskripsi: 'Lorem ipsum dolor sit amet',
//             status: 'Menunggu',
//         }
//     ]

const BimbinganSkripsi = () => {
    const submitButtonRef = useRef(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const res = await getBimbinganSkripsi();

        res.data.forEach((item: any, index: number) => {
            item.jenis = index + 1;
        });


        // const response = await fetch('/api/bimbingan-skripsi/mahasiswa');
        // const res = await response.json();

        // Update your state with the    new data
        setData(res.data);
        setLoading(false)
    };


    useEffect(() => {
        fetchData();
    }, []);

    const form = useForm({
        initialValues: {
            tanggal: new Date(),
            keterangan: '',
            jamMulai: '',
            jamSelesai: ''
        },

        validate: {
            tanggal: (value) => {
                if (!value) {
                    return 'Tanggal tidak boleh kosong';
                }
            },
            keterangan: (value) => {
                if (!value) {
                    return 'Keterangan tidak boleh kosong';
                }
            },
            jamMulai: (value) => {
                if (!value) {
                    return 'Jam Mulai tidak boleh kosong';
                }
            },
            jamSelesai: (value) => {
                if (!value) {
                    return 'Jam Selesai tidak boleh kosong';
                }
            }
        }
    })

    const ref = useRef<HTMLInputElement>(null);
    const ref2 = useRef<HTMLInputElement>(null);

    const pickerControl = (
        <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
            <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </ActionIcon>
    );

    const pickerControl2 = (
        <ActionIcon variant="subtle" color="gray" onClick={() => ref2.current?.showPicker()}>
            <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </ActionIcon>
    );

    return (
        <>
            <Text c="dimmed" mb="md">Perizinan Bimbingan Skripsi</Text>

            {/* button ajukan bimbingan */}
            <Group mb={10}>
                <Button leftSection={<IconPlus size={14} />} onClick={open}>Ajukan Perizinan</Button>
            </Group>

            {loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Loader />
            </div> : <CardListSkripsi records={data} fetchData={fetchData} />}

            <Modal
                size="md"
                opened={opened}
                onClose={close}
                closeOnClickOutside={false}
                title={<Text size="xl">Ajukan Perizinan Bimbingan Skripsi</Text>}
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >


                <form onSubmit={form.onSubmit(async (values) => {
                    console.log(values);

                    try {
                        const response = await postBimbinganSkripsi(values);

                        notifications.show({
                            title: 'Berhasil',
                            message: 'Bimbingan skripsi berhasil diajukan',
                        });
                        close();
                        setLoading(true);

                        fetchData();
                    } catch (error) {

                        notifications.show({
                            title: 'Gagal mengajukan bimbingan',
                            message: 'Terjadi kesalahan saat mengajukan bimbingan',
                            color: 'red',
                        });

                    }
                    // fetch('/api/bimbingan-skripsi/mahasiswa', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     },
                    //     body: JSON.stringify(values),
                    // })
                    //     .then(response => response.json())
                    //     .then(data => {
                    //         console.log('Success:', data);
                    //         notifications.show({
                    //             title: 'Bimbingan diajukan',
                    //             message: 'Bimbingan skripsi berhasil diajukan',
                    //         })
                    //         close();
                    //         setLoading(true);

                    //         fetchData();
                    //     })
                    //     .catch((error) => {
                    //         console.error('Error:', error);
                    //         notifications.show({
                    //             title: 'Gagal mengajukan bimbingan',
                    //             message: 'Terjadi kesalahan saat mengajukan bimbingan',
                    //             color: 'red',
                    //         });
                    //     });
                })}>
                    <Stack gap="md">
                        <DateInput
                            minDate={new Date()}
                            valueFormat='DD-MM-YYYY'
                            label="Tanggal"
                            {...form.getInputProps('tanggal')} />

                        <Textarea label="Keterangan"
                            {...form.getInputProps('keterangan')} />

                        <TimeInput label="Jam Mulai"
                            ref={ref}
                            rightSection={pickerControl}
                            {...form.getInputProps('jamMulai')} />
                        <TimeInput label="Jam Selesai"
                            ref={ref2}
                            rightSection={pickerControl2}
                            {...form.getInputProps('jamSelesai')} />

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
                                    size: 'sm',
                                    centered: true,
                                    children: (
                                        <Text size="sm">
                                            Apakah anda yakin ingin mengajukan perizinan bimbingan skripsi?
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

export default BimbinganSkripsi