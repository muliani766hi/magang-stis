'use client'
import {
    Alert, Button, Card, CloseButton, Group, LoadingOverlay, NumberInput, Select, SimpleGrid, Stack, Text, TextInput, rem
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import React, { useState, useRef, useEffect } from 'react'
import { IconCheck, IconDownload, IconPhoto, IconUpload, IconX } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { PDF_MIME_TYPE } from '@mantine/dropzone'
import { useForm } from '@mantine/form';
import { Dropzone } from '@mantine/dropzone';
import { modals } from '@mantine/modals'
import { getPresentasiLaporan, postPresentasiLaporan } from '@/utils/presentasi-laporan'
import { getToken } from '@/utils/get-profile'
import { getMahasiswaId } from '@/utils/kegiatan-harian'

interface FormValues {
    tanggal: Date;
    lokasiPresentasi: string;
    jumlahPenonton: number;
    metodePresentasi: string;
    komentar: string;
    presentasiId: number;
    fileLaporan: File[];
}

const LaporanMagang = () => {
    const [records, setRecords] = useState<any>(null);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const [loading, setLoading] = useState(true);

    const form = useForm<FormValues>({
        initialValues: {
            tanggal: new Date(),
            lokasiPresentasi: '',
            jumlahPenonton: 0,
            metodePresentasi: '',
            fileLaporan: [],
            komentar: '',
            presentasiId: 0,
        },

        validate: {
            fileLaporan: (fileLaporan: File[]) => {
                if (fileLaporan.length === 0) {
                    return 'File tidak boleh kosong';
                }
                if (fileLaporan.some((file) => file.size > 20 * 1024 ** 2)) {
                    return 'Ukuran file tidak boleh melebihi 20mb';
                }
            },

            tanggal: (date: Date) => {
                if (date.getDay() === 0 || date.getDay() === 6) {
                    return 'Tanggal tidak boleh hari Sabtu atau Minggu';
                }
            },

            lokasiPresentasi: (lokasiPresentasi: string) => {
                if (lokasiPresentasi === '') {
                    return 'Lokasi tidak boleh kosong';
                }
            },

            jumlahPenonton: (jumlahPenonton: number) => {
                if (jumlahPenonton < 0) {
                    return 'Jumlah peserta tidak boleh negatif';
                }
                if (jumlahPenonton === 0) {
                    return 'Jumlah peserta tidak boleh kosong';
                }
            },

            metodePresentasi: (metodePresentasi: string) => {
                if (metodePresentasi === '') {
                    return 'Metode presentasi tidak boleh kosong';
                }
            }
        },
    });

    const fetchData = async () => {
        const response = await getPresentasiLaporan();
        // console.log(response);
        setRecords(response.data[0]);

        if (response.data.length === 0) {
            setIsFormSubmitted(false);
        } else {
            setIsFormSubmitted(true);
        }
        setLoading(false);

    };

    useEffect(() => {

        fetchData();
    }, []);

    useEffect(() => {
        if (records && records.presentasiId !== form.values.presentasiId) {
            form.setValues({
                tanggal: new Date(records.tanggal),
                lokasiPresentasi: records.lokasiPresentasi,
                jumlahPenonton: records.jumlahPenonton,
                metodePresentasi: records.metodePresentasi,
                fileLaporan: Array.isArray(records.fileLaporan) ? records.fileLaporan : [],
                komentar: records.komentar,
                presentasiId: records.presentasiId,
            });
        }

    }, [records, form]);

    const selectedFiles = Array.isArray(form.values.fileLaporan) ? (
        form.values.fileLaporan.map((file, index) => (
            <Text key={file.name}
                onClick={() => {
                    window.open(URL.createObjectURL(file), '_blank');
                }}
                style={{ cursor: 'pointer' }}
            >
                <b>{file.name}</b> ({(file.size / 1024).toFixed(2)} kb)
                <CloseButton
                    size="xs"
                    onClick={(e) => {
                        e.stopPropagation()
                        form.setFieldValue(
                            'fileLaporan',
                            form.values.fileLaporan.filter((_, i) => i !== index)
                        )
                    }}
                />
            </Text>
        ))
    ) : null;

    const handleFileUpload = async (value: any) => {
        const token = await getToken();
        const mahasiswaId = await getMahasiswaId();

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const formdata = new FormData();
        formdata.append("json", JSON.stringify({
            tanggal: value.tanggal,
            jumlahPenonton: value.jumlahPenonton,
            komentar: value.komentar,
            lokasiPresentasi: value.lokasiPresentasi,
            metodePresentasi: value.metodePresentasi,
        }));

        formdata.append("file", value.fileLaporan[0]);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/presentasi-laporan-magang/${mahasiswaId}`, requestOptions);
            if (!response.ok) {
                console.log(await response.json());
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            throw new Error('Failed to fetch data');

        }
    }

    const handleUpdateFileUpload = async (value: any) => {
        const token = await getToken();
        const presentasiId = value.presentasiId;

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const formdata = new FormData();
        formdata.append("json", JSON.stringify({
            tanggal: value.tanggal,
            jumlahPenonton: value.jumlahPenonton,
            komentar: value.komentar,
            lokasiPresentasi: value.lokasiPresentasi,
            metodePresentasi: value.metodePresentasi,
        }));

        formdata.append("file", value.fileLaporan[0]);

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: formdata,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/presentasi-laporan-magang/${presentasiId}`, requestOptions);
            if (!response.ok) {
                console.log(await response.json());
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            throw new Error('Failed to fetch data');
        }
    }

    const getFileLaporan = async (laporan: string) => {
        const token = await getToken();
        console.log(laporan)
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/presentasi-laporan-magang/download/${laporan}`, requestOptions);
            if (!response.ok) {
                console.log(await response.text()); // Changed to response.text() for error debugging
                throw new Error('Failed to fetch data');
            }
            const blob = await response.blob(); // Get the PDF as a Blob
            const url = URL.createObjectURL(blob); // Create a URL for the Blob
            window.open(url, '_blank'); // Open the PDF in a new tab/window
            URL.revokeObjectURL(url); // Clean up the URL object
        } catch (error) {
            throw new Error('Failed to fetch data');
        }
    }

    return (
        <>
            <Text c="dimmed" mb="md">Presentasi Laporan Magang</Text>
            {isFormSubmitted && (
                <Alert variant='light' color='green' title='Draft Laporan Magang telah terkirim' mb="md" icon={<IconCheck />} />
            )}
            <Card shadow="xs" padding="md" radius="sm" withBorder>
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <form onSubmit={form.onSubmit(async (values) => {
                    console.log(values);
                    try {
                        if (!isFormSubmitted) {
                            await handleFileUpload(values);
                        } else {
                            await handleUpdateFileUpload(values);
                        }

                        notifications.show({
                            title: 'Berhasil dikirim',
                            message: 'Laporan magang berhasil dikirim',
                        });
                        fetchData();
                    }
                    catch (error) {
                        notifications.show({
                            title: 'Gagal dikirim',
                            message: 'Laporan magang gagal dikirim',
                            color: 'red',
                        });
                    }
                })}>
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                        <Stack>
                            <DateInput
                                label="Tanggal"
                                description="Tanggal pelaksanaan presentasi laporan magang"
                                valueFormat='DD-MM-YYYY'
                                {...form.getInputProps('tanggal')}
                            />
                            <TextInput
                                label="Lokasi"
                                description="Lokasi pelaksanaan presentasi laporan magang"
                                {...form.getInputProps('lokasiPresentasi')}
                            />
                            <NumberInput
                                label="Jumlah Peserta"
                                description="Jumlah peserta presentasi laporan magang"
                                min={0}
                                {...form.getInputProps('jumlahPenonton')}
                            />
                            <Select
                                label="Metode Presentasi"
                                description="Metode presentasi laporan magang (individu/kelompok)"
                                data={['Individu', 'Kelompok']}
                                {...form.getInputProps('metodePresentasi')}
                            />
                        </Stack>
                        <Stack>
                            <Text size='sm' fw={500}>Draft Laporan Magang</Text>
                            <Dropzone
                                maxSize={20 * 1024 ** 2}
                                accept={PDF_MIME_TYPE}
                                onDrop={(fileLaporan) => form.setFieldValue('fileLaporan', fileLaporan)}
                                onReject={() => form.setFieldError('fileLaporan', 'File size exceeds 20mb or file type is not supported')}
                            >
                                <Group justify="center" gap="xl" mih={320} style={{ pointerEvents: 'none' }}>
                                    <Dropzone.Accept>
                                        <IconUpload
                                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                        <IconX
                                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Reject>
                                    <Dropzone.Idle>
                                        <IconPhoto
                                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Idle>
                                    <div>
                                        <Text size="xl" inline>
                                            Tarik file ke sini atau klik untuk memilih file
                                        </Text>
                                        <Text size="sm" c="dimmed" inline mt={7}>
                                            File tidak boleh melebihi 20mb
                                        </Text>
                                    </div>
                                </Group>
                                {form.errors.fileLaporan && (
                                    <Text c="red" mt={5}>
                                        {form.errors.fileLaporan}
                                    </Text>
                                )}

                            </Dropzone>
                            {selectedFiles && selectedFiles.length > 0 && (
                                <>
                                    <Text>
                                        Selected files:
                                    </Text>
                                    {selectedFiles}
                                </>
                            )}
                            {isFormSubmitted && (
                                <Button
                                    color="gray"
                                    variant="light"
                                    rightSection={<IconDownload size={16} />}
                                    onClick={async () => {
                                        getFileLaporan(records.fileDraftLaporanMagang)
                                    }}
                                >
                                    Download Laporan
                                </Button>)
                            }
                        </Stack>
                    </SimpleGrid>
                    <Group justify='right' mt="md">
                        <Button
                            type="submit"
                            ref={submitButtonRef}
                            style={{ display: 'none' }}
                            color="blue"
                            variant="light">Simpan</Button>
                        {/* {isFormSubmitted && (
                            <Alert variant='light' color='green' title='Draft Laporan Magang telah terkirim' icon={<IconCheck />} />
                        )} */}
                        <Button
                            type='button'
                            color="blue"
                            variant="light"
                            leftSection={<IconUpload style={{ width: rem(16), height: rem(16) }} />}
                            onClick={() => {
                                modals.openConfirmModal({
                                    centered: true,
                                    children: (
                                        <Text size="sm">
                                            {isFormSubmitted ? 'Apakah anda yakin ingin mengirim ulang laporan magang ini?' : 'Apakah anda yakin ingin mengirim laporan magang ini?'}
                                        </Text>
                                    ),
                                    labels: { confirm: 'Ya', cancel: 'Tidak' },
                                    cancelProps: { variant: 'light', color: 'gray' },
                                    confirmProps: { variant: 'light', color: 'blue' },
                                    onCancel: () => console.log('Cancel'),
                                    onConfirm: () => {
                                        if (submitButtonRef.current) {
                                            submitButtonRef.current.click();
                                        }
                                    }
                                });
                            }}
                        >
                            {isFormSubmitted ? 'Kirim Ulang' : 'Kirim'}
                        </Button>
                    </Group>
                </form>
            </Card>
        </>
    )
}

export default LaporanMagang
