
import { ActionIcon, Badge, Button, Grid, GridCol, Group, Stack, Text, TextInput } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import React from 'react'
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import { closeModal, openModal } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { DateInput } from '@mantine/dates'
import { deleteBimbinganSkripsi } from '@/utils/bimbingan-skripsi'
import { notifications } from '@mantine/notifications'

export interface RecordBimbinganSkripsi {
    id: number
    mahasiswaId: number
    nama: string
    nim: string
    jenis: number
    tanggal: string
    keterangan: string
    status: string
    jamMulai: string
    jamSelesai: string
}

const TableBimbinganSkripsi = ({ records, loading, fetchData }: { records: RecordBimbinganSkripsi[], loading: boolean, fetchData: () => void }) => {
    console.log(records)
    return (
        <>
            <DataTable
                style={{ minHeight: records.length > 0 ? '0' : '180px' }}  
                fetching={loading}
                withColumnBorders
                withTableBorder
                pinLastColumn
                columns={[
                    { accessor: 'id', title: 'ID', textAlign: 'center', hidden: true },
                    {
                        accessor: 'index',
                        title: 'No',
                        textAlign: 'center',
                        width: 43,
                        render: (record) => records.indexOf(record) + 1,
                    },
                    { accessor: 'nama', title: 'Nama', textAlign: 'left' },
                    { accessor: 'nim', title: 'NIM', textAlign: 'left' },
                    // { accessor: 'jenis', title: 'Jenis', textAlign: 'left' },
                    { accessor: 'tanggal', title: 'Tanggal', textAlign: 'left', render: ({ tanggal }) => new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                    { accessor: 'jamMulai', title: 'Jam Mulai', textAlign: 'right', render: ({ jamMulai }) => new Date(jamMulai).toLocaleTimeString() },
                    { accessor: 'jamSelesai', title: 'Jam Selesai', textAlign: 'right', render: ({ jamSelesai }) => new Date(jamSelesai).toLocaleTimeString() },
                    { accessor: 'keterangan', title: 'Keterangan', textAlign: 'left' },
                    // {
                    //     accessor: 'status', title: 'Status', textAlign: 'left',
                    //     render: ({ status }) => status === 'Disetujui' ? (
                    //         <Badge color='green'>{status}</Badge>
                    //     ) : status === 'Ditolak' ? (
                    //         <Badge color='red'>{status}</Badge>
                    //     ) : (
                    //         <Badge color='gray'>{status}</Badge>
                    //     )

                    // },


                    // {
                    //     accessor: 'aksi', title: 'Aksi',
                    //     textAlign: 'center',
                    //     width: '0%',
                    //     render: (record) => (
                    //         <Group gap={4} justify="right" wrap="nowrap">
                    //             {/* <ActionIcon
                    //                 size="sm"
                    //                 variant="subtle"
                    //                 color="green"
                    //                 onClick={() => {
                    //                     showModal({ record, action: 'view' ,fetchData })
                    //                 }}
                    //             >
                    //                 <IconEye size={16} />
                    //             </ActionIcon> */}
                    //             <ActionIcon
                    //                 size="sm"
                    //                 variant="subtle"
                    //                 color="blue"
                    //                 onClick={() => {
                    //                     showModal({ record, action: 'edit', fetchData })
                    //                 }}
                    //             >
                    //                 <IconEdit size={16} />
                    //             </ActionIcon>
                    //             <ActionIcon
                    //                 size="sm"
                    //                 variant="subtle"
                    //                 color="red"
                    //                 onClick={() => {
                    //                     showModal({ record, action: 'delete', fetchData })
                    //                 }}
                    //             >
                    //                 <IconTrash size={16} />
                    //             </ActionIcon>
                    //         </Group>
                    //     ),
                    // }
                ]}
                records={records}
                highlightOnHover
            />
        </>
    )
}


const showModal = ({ record, action, fetchData }: { record: RecordBimbinganSkripsi; action: 'view' | 'edit' | 'delete'; fetchData: () => void }) => {

    if (action === 'view') {
        openModal({
            modalId: action,
            title: 'Lihat Detail Bimbingan Skripsi',
            children: (
                <Stack>
                    <TextInput label='NIM' value={record.nim} readOnly />
                    <TextInput label='Nama' value={record.nama} readOnly />
                    <DateInput label='Tanggal' value={new Date(record.tanggal)} readOnly />
                    <TextInput label='keterangan' value={record.keterangan} readOnly />
                    <TextInput label='Status' value={record.status} readOnly />

                    <Button onClick={() => closeModal(action)}>Tutup</Button>
                </Stack>
            ),
        });

    } else if (action === 'edit') {
        const FormComponent = () => {
            const form = useForm({
                initialValues: {
                    id: record.id,
                    nim: record.nim,
                    nama: record.nama,
                    tanggal: new Date(record.tanggal),
                    keterangan: record.keterangan,
                    status: record.status
                }

            });

            // Rest of the code...

            return (
                <form onSubmit={form.onSubmit((values) => { console.log(values) })}>
                    <Stack>
                        <TextInput label='NIM' {...form.getInputProps('nim')} readOnly />
                        <TextInput label='Nama' {...form.getInputProps('nama')} readOnly />
                        <DateInput label='Tanggal' {...form.getInputProps('tanggal')} />
                        <TextInput label='keterangan' {...form.getInputProps('keterangan')} />

                        <Group justify='right'>
                            <Button
                                type='submit'
                                color='red'
                                variant='light'
                                onClick={() => {
                                    form.setValues({ status: 'Ditolak' });
                                    closeModal(action)
                                }}>Tolak</Button>
                            <Button
                                type='submit'
                                color='blue'
                                variant='light'
                                onClick={() => {
                                    form.setValues({ status: 'Disetujui' });
                                    closeModal(action)
                                }}>Setuju</Button>
                        </Group>
                    </Stack >
                </form >
            );
        };

        openModal({
            modalId: action,
            title: 'Konfirmasi Bimbingan Skripsi',
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
                        <GridCol span={2}>NIM</GridCol>
                        <GridCol span={10}>{record.nim}</GridCol>
                        <GridCol span={2}>Nama</GridCol>
                        <GridCol span={10}>{record.nama}</GridCol>
                    </Grid>
                    <Group justify="right">
                        <Button color='gray' variant='light' onClick={() => closeModal(action)}>Batal</Button>
                        <Button color='red' variant='light' onClick={async () => {
                            try {
                                await deleteBimbinganSkripsi(record.id)
                                fetchData()
                                closeModal(action)
                                notifications.show({
                                    title: 'Berhasil',
                                    message: 'Bimbingan Skripsi berhasil dihapus',
                                    color: 'green'
                                })
                            } catch (error) {
                                console.error(error)
                                notifications.show({
                                    title: 'Gagal',
                                    message: 'Bimbingan Skripsi gagal dihapus',
                                    color: 'red'
                                })
                            }
                        }}>Hapus</Button>
                    </Group>
                </Stack>
            ),
        });
    }
};


export default TableBimbinganSkripsi