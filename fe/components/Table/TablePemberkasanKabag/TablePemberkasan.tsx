'use client'
import { getDokumenTranslok } from '@/utils/rekening';
import { confirmDokumenTranslok } from '@/utils/dokumen-translok';
import { DataTable } from 'mantine-datatable'
import React, { useState, useEffect } from 'react'
import { ActionIcon, Box, Button, Grid, GridCol, Group, Input, NumberInput, Select, Stack, Text, Textarea } from '@mantine/core';
import { IconEye, IconEdit, IconCheck, IconX, IconTrash } from '@tabler/icons-react';
import { openConfirmModal } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

const TablePemberkasan = () => {
    const [loading, setLoading] = useState(true);
    const [dokumen, setDokumen] = useState([])
    const fetchRekening = async () => {
        const res = await getDokumenTranslok()
        console.log(res.data)
        setDokumen(res.data)
        setLoading(false)
    }

    useEffect(() => {
        fetchRekening()
    }, [])
    return (
        <DataTable
            fetching={loading}
            columns={[
                { accessor: 'nim', title: 'NIM', textAlign: 'left' },
                { accessor: 'nama', title: 'Nama', textAlign: 'left' },
                { accessor: 'bank', title: 'Bank', textAlign: 'left' },
                { accessor: 'nomorRekening', title: 'Nomor Rekening', textAlign: 'left' },
                { accessor: 'namaRekening', title: 'Nama di rekening', textAlign: 'left' },
                {
                    accessor: 'action', title: 'Aksi', textAlign: 'center', width: 100,
                    render: (record) => (
                        <Group>
                            <ActionIcon
                                onClick={() => showModal({ record, action: 'setuju', fetchRekening })}
                                title='Setujui'
                                color='green'
                                variant='subtle'
                            >
                                <IconCheck />
                            </ActionIcon>
                            <ActionIcon
                                onClick={() => showModal({ record, action: 'tolak', fetchRekening })}
                                title='Tolak'
                                color='red'
                                variant='subtle'
                            >
                                <IconX />
                            </ActionIcon>
                        </Group>
                    )
                },
                { accessor: 'catatan', title: 'Catatan', textAlign: 'left' },
            ]}
            records={dokumen}
        />

    )
}

const showModal = ({ record, action, fetchRekening }: { record: any; action: 'setuju' | 'tolak'; fetchRekening: () => void }) => {

    if (action === 'setuju') {
        openConfirmModal({
            centered: true,
            children: (
                <Text size="sm">
                    Apakah anda yakin ingin menyetujui dokumen mahasiswa {record.nama}?
                </Text>
            ),
            labels: { confirm: 'Ya', cancel: 'Tidak' },
            cancelProps: { variant: 'light', color: 'gray' },
            confirmProps: { variant: 'light', color: 'green' },
            onCancel: () => console.log('Cancel'),
            onConfirm: async () => {
                confirmDokumenTranslok(record.mahasiswaId, { id: record.id, status: 'disetujui' }).then(() => {
                    notifications.show({
                        title: 'Berhasil',
                        message: 'Dokumen berhasil disetujui',
                        color: 'green',
                    });
                    fetchRekening();
                }).catch((error) => {
                    notifications.show({
                        title: 'Gagal',
                        message: error.message || 'Terjadi kesalahan saat menyetujui dokumen',
                        color: 'red',
                    });
                });
            }
        });
    }
    else if (action === 'tolak') {
        const catatanRef = { current: '' }
        openConfirmModal({
            children: (
                <Textarea
                    label="Isi atau ubah pengumuman"
                    description="Isi pengumuman mengenai kesalahan dokumen translok"
                    onChange={(e) => catatanRef.current = e.currentTarget.value}
                />
            ),
            labels: { confirm: 'Ya', cancel: 'Tidak' },
            cancelProps: { variant: 'light', color: 'gray' },
            confirmProps: { variant: 'light', color: 'green' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => {
                const catatan = catatanRef.current.trim()
                console.log(record.mahasiswaId, { status: 'dikembalikan', catatan: catatan })
                confirmDokumenTranslok(record.mahasiswaId, { id: record.id, status: 'dikembalikan', catatan: catatan }).then(() => {
                    notifications.show({
                        title: 'Berhasil',
                        message: 'Berhasil mengirim catatan untuk dokumen translok',
                        color: 'green',
                    });
                    fetchRekening();
                }).catch((error) => {
                    notifications.show({
                        title: 'Gagal',
                        message: error.message || 'Terjadi kesalahan saat mengembalikan dokumen',
                        color: 'red',
                    });
                });
            }
        });
    }
};

export default TablePemberkasan