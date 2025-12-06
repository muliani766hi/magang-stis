
'use client';

import { getUnitKerja, postPemilihanPenempatan } from '@/utils/unit-kerja';
import { Alert, Button, Fieldset, Group, Select, SimpleGrid, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { get } from 'http';
import React, { useEffect, useRef } from 'react'

interface ListUnitKerja {
    value: string
    label: string
}

const Alokasi = () => {
    const submitButtonRef = useRef(null);
    const [isFormSubmitted, setIsFormSubmitted] = React.useState(false);
    const [data, setData] = React.useState([]);

    const fetchData = async () => {
        const response = await getUnitKerja();

        // remodel data to value and label
        const listUnitKerja = response.data.map((item: { satkerId: number; nama: string; }) => ({
            value: item.satkerId.toString(),
            label: item.nama,
        }));

        setData(listUnitKerja);
        console.log(listUnitKerja);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const form = useForm({
        initialValues: {
            pilihan1: '',
            pilihan2: '',
            pilihan3: '',
        },

        validate: {
            pilihan1: (value) => {
                if (!value) {
                    return 'Pilihan 1 tidak boleh kosong';
                }
            },
            pilihan2: (value) => {
                if (!value) {
                    return 'Pilihan 2 tidak boleh kosong';
                }
            },
            pilihan3: (value) => {
                if (!value) {
                    return 'Pilihan 3 tidak boleh kosong';
                }
            }
        }
    });

    return (
        <>
            <Text c="dimmed" mb="md">Pemilihan Penempatan Magang</Text>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                <Fieldset legend="">
                    <form onSubmit={form.onSubmit(async (values) => {
                        try {
                            await postPemilihanPenempatan(values)
                            notifications.show({
                                title: 'Berhasil',
                                message: 'Pemilihan penempatan berhasil dikirim',
                                color: 'blue'
                            });
                            setIsFormSubmitted(true);
                        } catch (error) {
                            console.error(error);
                            notifications.show({
                                title: 'Gagal',
                                message: 'Pemilihan penempatan gagal dikirim',
                                color: 'red'
                            });
                        }
                        // fetch('/api/penempatan-magang/alokasi', {
                        //     method: 'PUT',
                        //     body: JSON.stringify(values),
                        //     headers: {
                        //         'Content-Type': 'application/json'
                        //     }
                        // }).then((res) => res.json())
                        //     .then((res) => {
                        //         console.log(res)
                        //         notifications.show({
                        //             title: 'Berhasil',
                        //             message: 'Pemilihan penempatan berhasil dikirim',
                        //             color: 'blue'
                        //         });
                        //         setIsFormSubmitted(true);
                        //     }
                        //     ).catch((res) => {
                        //         console.log(res)
                        //         notifications.show({
                        //             title: 'Gagal',
                        //             message: 'Pemilihan penempatan gagal dikirim',
                        //             color: 'red'
                        //         });
                        //     });

                    })}>
                        <Stack gap="md">
                            <Select
                                label="Pilihan 1"
                                placeholder="Pilih instansi"
                                data={data}
                                searchable
                                {...form.getInputProps('pilihan1')}
                            />

                            <Select
                                label="Pilihan 2"
                                placeholder="Pilih instansi"
                                data={data}
                                searchable
                                {...form.getInputProps('pilihan2')}
                            />

                            <Select
                                label="Pilihan 3"
                                placeholder="Pilih instansi"
                                data={data}
                                searchable
                                {...form.getInputProps('pilihan3')}
                            />

                            <Group justify='flex-end'><Button
                                type="submit"
                                ref={submitButtonRef}
                                style={{ display: 'none' }} // Hide the button
                                color="blue"
                                variant="light">Simpan</Button>
                                {isFormSubmitted ? <Alert variant='light' color='green' title='Pilihan instansi telah terkirim' icon={<IconCheck />} /> :
                                    <Button
                                        type="button"
                                        variant="light"
                                        onClick={() => {
                                            modals.openConfirmModal({
                                                // title: 'Simpan Kegiatan',
                                                centered: true,
                                                children: (
                                                    <Text size="sm">
                                                        Apakah anda yakin ingin mengirim pilihan instansi ini?
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
                                    >
                                        Kirim
                                    </Button>
                                }
                            </Group>
                        </Stack>
                    </form>
                </Fieldset >
            </SimpleGrid>
        </>
    )
}

export default Alokasi