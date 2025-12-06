'use client'

import { ActionIcon, Badge, Button, FileInput, Grid, GridCol, Group, Select, Stack, Text, TextInput } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'
import { IconDownload, IconEdit, IconEye, IconFile, IconTrash } from '@tabler/icons-react'
import { closeModal, openModal } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { DateInput } from '@mantine/dates'
import { getToken } from '@/utils/get-profile'
import { notifications } from '@mantine/notifications'
import { putPerizinan } from '@/utils/presensi'

export interface RecordPerizinan {
    izinId: number
    tanggal: string
    keterangan: string
    jenisIzin: string
    fileBukti: []
    mahasiswaId: number
    status: string
}

const getFileBukti = async (laporan: string[]) => {
    if (typeof window === 'undefined') {
        // This code is running on the server
        console.error('window is not defined');
        return;
    }

    try {
        const token = await getToken()

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/presensi/izin-presensi/download/${laporan}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        });

        if (!response.ok) throw new Error('Network response was not ok.');

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        // Open the blob URL in a new tab
        const newWindow = window.open(blobUrl, '_blank');
        if (newWindow) {
            newWindow.onload = () => window.URL.revokeObjectURL(blobUrl); // Revoke URL once loaded
        } else {
            // If the browser blocks the pop-up, inform the user
            alert('Please allow pop-ups for this website');
        }
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
}


const TablePerizinan = ({ records, loading, fetchData }: { records: RecordPerizinan[], loading: boolean, fetchData: () => void }) => {
    const PAGE_SIZES = [5, 10, 20];
    // console.log(records)

    const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    const [page, setPage] = useState(1);
    const [recordsPaged, setRecordsPaged] = useState(records.slice(0, pageSize));

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsPaged(records.slice(from, to));
    }, [page, pageSize, records]);

    return (
        <>
            <DataTable
                style={{ minHeight: recordsPaged.length > 0 ? '0' : '180px' }}  
                fetching={loading}
                columns={[
                    { accessor: 'id', title: 'ID', textAlign: 'center', hidden: true },
                    // { accessor: 'izinId', title: 'ID', textAlign: 'center', hidden: true },
                    { accessor: 'index', title: 'No', textAlign: 'center', width: 40, render: (record) => records.indexOf(record) + 1 },
                    { accessor: 'tanggal', title: 'Tanggal', textAlign: 'left', render: ({ tanggal }) => new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                    { accessor: 'jenisIzin', title: 'Jenis Izin', textAlign: 'left' },
                    { accessor: 'keterangan', title: 'Keterangan', textAlign: 'left' },
                    {
                        accessor: 'fileBukti', title: 'Bukti', textAlign: 'left',
                        render: (record) => (
                            record.fileBukti !== null ? (
                                <Button
                                    size='xs'
                                    variant="filled"
                                    color="blue"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent the click from selecting the option

                                        getFileBukti(record.fileBukti);
                                    }}
                                    leftSection={< IconDownload size={16} />}
                                    title={String(record.fileBukti)}
                                >
                                    {record.fileBukti.slice(0, 10)}...
                                </Button>
                            ) : (
                                <Text fs="italic" size='xs'>Belum ada file</Text>
                            )
                        )
                    },
                    {
                        accessor: 'status', title: 'Status', textAlign: 'left',
                        render: ({ status }) => status === 'Disetujui' ? (
                            <Badge color='green' variant='light'>{status}</Badge>
                        ) : status === 'Ditolak' ? (
                            <Badge color='red' variant='light'>{status}</Badge>
                        ) : (
                            <Badge color='gray' variant='light'>{status}</Badge>
                        )
                    },
                ]}

                onRowClick={({ record }) => showModal({ record, action: 'edit', fetchData })}

                withRowBorders={false}
                withColumnBorders={false}
                highlightOnHover

                records={recordsPaged}
                totalRecords={records.length}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={setPage}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
            />
        </>
    )
}


const showModal = ({ record, action, fetchData }: { record: RecordPerizinan; action: 'view' | 'edit' | 'delete'; fetchData: () => void }) => {
    const handleFileUpload = async (values: any) => {
        const file = values.fileBukti;
        const token = await getToken();
        // console.log(token);
        if (file) {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            // myHeaders.append("Content-Type", "multipart/form-data");

            const formdata = new FormData();
            formdata.append("file", file);

            const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: formdata,
                // redirect: "follow"
            };

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/presensi/izin-presensi/bukti/${values.izinId}`, requestOptions);

                if (!response.ok) {
                    console.log(await response.text());
                    throw new Error(`Failed to upload file: ${response.statusText}`);
                }

                notifications.show(
                    {
                        title: "Berhasil",
                        message: "File berhasil diunggah",
                    }
                )
                fetchData();
            } catch (error) {
                // console.error("Failed to upload file", error);
                notifications.show(
                    {
                        title: "Gagal",
                        message: `File gagal diunggah: ${error}`,
                        color: "red"
                    }
                )

            }
        }
    }

    if (action === 'edit') {
        const FormComponent = () => {
            const form = useForm({
                initialValues: {
                    id: record.izinId,
                    tanggal: new Date(record.tanggal),
                    jenisIzin: record.jenisIzin,
                    keterangan: record.keterangan,
                    fileBukti: record.fileBukti || [],
                    izinId: record.izinId
                }
            });


            // Rest of the code...

            return (
                <form onSubmit={form.onSubmit(async (values) => {
                    try {

                        const newValues = {
                            izinId: values.izinId,
                            tanggal: values.tanggal,
                            jenisIzin: values.jenisIzin,
                            keterangan: values.keterangan,
                        }
                        await putPerizinan(newValues);


                        await handleFileUpload(values);

                        // console.log(values);
                        closeModal(action);
                    } catch (error) {
                        console.error('Failed to update data', error);
                    } finally {
                        fetchData();
                    }

                })}>
                    <Stack>
                        <DateInput
                            label='Tanggal'
                            {...form.getInputProps('tanggal')}
                        />
                        <Select
                            label='Jenis Izin'
                            data={[
                                {
                                    value: 'izin sakit rawat inap',
                                    label: 'Sakit dengan rawat inap di rumah sakit atau sakit yang sangat menular tapi tidak rawat inap'
                                },
                                {
                                    value: 'izin dispensasi',
                                    label: 'Dispensasi dari Direktur/Wakil Direktur'
                                },
                                {
                                    value: 'izin keperluan penting',
                                    label: 'Ijin karena keperluan yang sangat penting (Orang tua/ Saudara kandung meninggal dunia, musibah kebakaran / bencana alam dan sejenisnya)'
                                },
                                {
                                    value: 'izin sakit rawat jalan',
                                    label: 'Sakit dengan rawat jalan (dengan surat keterangan dokter dan bukti pendukung)'
                                }
                            ]}
                            {...form.getInputProps('jenisIzin')}
                        />
                        <TextInput
                            label='Keterangan'
                            {...form.getInputProps('keterangan')}
                        />
                        <FileInput
                            label='Bukti'
                            {...form.getInputProps('fileBukti')}
                            accept="pdf/*"
                            placeholder="Pilih file"
                            // description="Bukti berupa pdf"
                            leftSection={<IconFile size={16} />}
                        />


                        <Group justify='right'>
                            <Button
                                // type='submit'
                                color='grey'
                                variant='light'
                                onClick={() => {
                                    // form.setValues({ status: 'Ditolak' });
                                    closeModal(action)
                                }}>Batal</Button>
                            <Button
                                type='submit'
                                color='blue'
                                variant='light'
                                onClick={() => {
                                    // form.setValues({ status: 'Disetujui' });
                                    closeModal(action)
                                }}>Kirim</Button>
                        </Group>
                    </Stack >
                </form >
            );
        };

        openModal({
            modalId: action,
            title: 'Edit Data Perizinan',
            children: (
                <FormComponent />
            ),
        });
    } else if (action === 'delete') {
        openModal({
            modalId: action,
            title: 'Hapus Data Bimbingan Skripsi',
            children: (
                <Stack>
                    <Text>Apakah anda yakin ingin menghapus jadwal bimbingan ini?</Text>
                    <Grid gutter="md">
                        {/* <GridCol span={2}>NIM</GridCol>
                        <GridCol span={10}>{record.nim_mahasiswa}</GridCol>
                        <GridCol span={2}>Nama</GridCol>
                        <GridCol span={10}>{record.nama_mahasiswa}</GridCol> */}
                    </Grid>
                    <Group justify="right">
                        <Button color='gray' variant='light' onClick={() => closeModal(action)}>Batal</Button>
                        <Button color='red' variant='light' onClick={() => closeModal(action)}>Hapus</Button>
                    </Group>
                </Stack>
            ),
        });
    }
};


export default TablePerizinan