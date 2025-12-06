
import { ActionIcon, Badge, Button, Grid, GridCol, Group, Stack, Text, TextInput } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import React from 'react'
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import { closeModal, openConfirmModal, openModal } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { DateInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { deleteBimbinganMagang, putConfirmBimbinganMagang, putFinalizeBimbinganMagang } from '@/utils/bimbingan-magang'

export interface RecordBimbinganMagang {
    id: number
    // id_mahasiswa: number
    // nama_mahasiswa: string
    // nim_mahasiswa: string
    // jenis: number
    // tanggal: string
    // deskripsi: string
    // status: string
    // tempat: string
    tanggal: string
    status: string
    deskripsi: string
    tempat: string
    PesertaBimbinganMahasiswa: {
        mahasiswaId: number
        mahasiswa: {
            nama: string
            nim: string
            kelas: string
        }
    }[]
}

const TableBimbinganMagang = ({ records, loading, fetchData }: { records: RecordBimbinganMagang[], loading: boolean, fetchData: () => void }) => {
    return (
        <>
            <DataTable
                style={{ minHeight: records.length > 0 ? '0' : '180px' }}  
                fetching={loading}
                pinLastColumn
                withColumnBorders
                withTableBorder
                columns={[
                    { accessor: 'id', title: 'ID', textAlign: 'center', hidden: true },
                    {
                        accessor: 'index',
                        title: 'No',
                        textAlign: 'center',
                        width: 43,
                        render: (record) => records.indexOf(record) + 1,
                    },
                    // { accessor: 'nama_mahasiswa', title: 'Nama Mahasiswa', textAlign: 'left' },
                    // { accessor: 'nim_mahasiswa', title: 'NIM', textAlign: 'left' },
                    // { accessor: 'jenis', title: 'Jenis', textAlign: 'left' },
                    { accessor: 'tanggal', title: 'Tanggal', textAlign: 'left', render: ({ tanggal }) => new Date(tanggal).toLocaleDateString("id", { year: 'numeric', month: 'long', day: 'numeric' }) },
                    { accessor: 'deskripsi', title: 'Deskripsi', textAlign: 'left' },
                    {
                        accessor: 'status', title: 'Status', textAlign: 'left',
                        render: ({ status }) => status === 'Disetujui' ? (
                            <Badge color='green'>{status}</Badge>
                        ) : status === 'Selesai' ? (
                            <Badge color='blue'>{status}</Badge>
                        ) : (
                            <Badge color='gray'>{status}</Badge>
                        )

                    },
                    {
                        accessor: 'tempat',
                        title: 'Link',
                        textAlign: 'left',
                        render: (record) => record.tempat === '' ? (
                            <Text style={{ color: 'grey' }} size='sm'>Belum ada link</Text>

                        ) : (record.tempat)
                    },
                    {
                        accessor: 'jumlah_peserta',
                        title: 'Peserta',
                        textAlign: 'left',
                        render: (record) => record.PesertaBimbinganMahasiswa.length

                    },
                    {
                        accessor: 'aksi', title: 'Aksi',
                        textAlign: 'center',
                        width: '0%',
                        render: (record) => (
                            <Group gap={4} justify="right" wrap="nowrap">
                                {/* <ActionIcon
                                    size="sm"
                                    variant="subtle"
                                    color="green"
                                    onClick={() => {
                                        showModal({ record, action: 'view', fetchData })
                                    }}
                                    title='Lihat'
                                >
                                    <IconEye size={16} />
                                </ActionIcon> */}
                                <ActionIcon
                                    size="sm"
                                    variant="subtle"
                                    color="blue"
                                    onClick={() => {
                                        showModal({ record, action: 'view', fetchData })
                                    }}
                                    title='Edit'
                                >
                                    <IconEdit size={16} />
                                </ActionIcon>
                                <ActionIcon
                                    size="sm"
                                    variant="subtle"
                                    color="red"
                                    onClick={() => {
                                        showModal({ record, action: 'delete', fetchData })
                                    }}
                                    title='Hapus'
                                >
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Group>
                        ),
                    }
                ]}
                records={records}
                highlightOnHover
            />
        </>
    )
}


const showModal = ({ record, action, fetchData }: { record: RecordBimbinganMagang; action: 'view' | 'edit' | 'delete', fetchData: () => void }) => {

    if (action === 'view') {
        openModal({
            modalId: action,
            title: 'Bimbingan Magang',
            children: (
                <>
                    <Stack>
                        <Text size='sm'>
                            <Grid>
                                <GridCol span={2}>Tanggal</GridCol>
                                <GridCol span={10}>: {new Date(record.tanggal).toLocaleDateString("id", { year: 'numeric', month: 'long', day: 'numeric' })}</GridCol>
                                <GridCol span={2}>Deskripsi</GridCol>
                                <GridCol span={10}>: {record.deskripsi}</GridCol>

                            </Grid>
                        </Text>
                        <TextInput
                            label='Link'
                            value={record.tempat}
                        />
                        <Text size='sm'>Peserta :</Text>
                        <DataTable
                            withTableBorder
                            columns={[
                                { accessor: 'id', title: 'ID', textAlign: 'center', hidden: true },
                                { accessor: 'mahasiswa.nama', title: 'Nama', textAlign: 'left' },
                                { accessor: 'mahasiswa.nim', title: 'NIM', textAlign: 'left' },
                                { accessor: 'mahasiswa.kelas', title: 'Kelas', textAlign: 'left' },
                            ]}
                            records={record.PesertaBimbinganMahasiswa}
                        />




                        <Group justify='right'>
                            <Button
                                type='submit'
                                color='grey'
                                variant='light'
                                onClick={() => {
                                    // form.setValues({ status: 'Ditolak' });
                                    closeModal(action)
                                }}>Batal</Button>
                            {
                                record.status === 'Menunggu' ? (
                                    <Button
                                        type='submit'
                                        color='green'
                                        variant='light'
                                        onClick={async () => {
                                            try {
                                                await putConfirmBimbinganMagang(record.id)
                                                notifications.show({
                                                    title: 'Berhasil',
                                                    message: 'Bimbingan Magang telah disetujui',
                                                    color: 'blue',
                                                });
                                                fetchData()
                                            } catch (error) {
                                                console.log(error)
                                                notifications.show({
                                                    title: 'Gagal',
                                                    message: 'Bimbingan Magang gagal disetujui',
                                                    color: 'red',
                                                });
                                            }

                                            closeModal(action)
                                        }}>Setuju</Button>
                                ) : (<Button
                                    type='submit'
                                    color='blue'
                                    variant='light'
                                    onClick={async () => {
                                        try {
                                            await putFinalizeBimbinganMagang(record.id)
                                            notifications.show({
                                                title: 'Berhasil',
                                                message: 'Bimbingan Magang telah selesai',
                                                color: 'blue',
                                            });
                                            fetchData()
                                        } catch (error) {
                                            console.log(error)
                                            notifications.show({
                                                title: 'Gagal',
                                                message: 'Bimbingan Magang gagal diselesaikan',
                                                color: 'red',
                                            });
                                        }

                                        closeModal(action)
                                    }}>Selesai</Button>
                                )
                            }
                        </Group>
                    </Stack>
                </>
            ),
        });

    } else if (action === 'edit') {
        const FormComponent = () => {
            const form = useForm({
                initialValues: {
                    id: record.id,
                    nim: record.PesertaBimbinganMahasiswa[0].mahasiswa.nim,
                    nama: record.PesertaBimbinganMahasiswa[0].mahasiswa.nama,
                    tanggal: new Date(record.tanggal),
                    deskripsi: record.deskripsi,
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
                        <TextInput label='Deskripsi' {...form.getInputProps('deskripsi')} />

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
            title: 'Konfirmasi Bimbingan Magang',
            children: (
                <FormComponent />
            ),
        });
    } else if (action === 'delete') {
        openModal({
            modalId: action,
            title: 'Hapus Data Bimbingan Magang',
            children: (
                <Stack>
                    <Stack>
                        <Text size='sm'>
                            <Grid>
                                <GridCol span={2}>Tanggal</GridCol>
                                <GridCol span={10}>: {new Date(record.tanggal).toLocaleDateString("id", { year: 'numeric', month: 'long', day: 'numeric' })}</GridCol>
                                <GridCol span={2}>Deskripsi</GridCol>
                                <GridCol span={10}>: {record.deskripsi}</GridCol>

                            </Grid>
                        </Text>
                        <TextInput
                            label='Link'
                            value={record.tempat}
                        />
                        <Text size='sm'>Peserta :</Text>
                        <DataTable
                            withTableBorder
                            columns={[
                                { accessor: 'id', title: 'ID', textAlign: 'center', hidden: true },
                                { accessor: 'mahasiswa.nama', title: 'Nama', textAlign: 'left' },
                                { accessor: 'mahasiswa.nim', title: 'NIM', textAlign: 'left' },
                                { accessor: 'mahasiswa.kelas', title: 'Kelas', textAlign: 'left' },
                            ]}
                            records={record.PesertaBimbinganMahasiswa}
                        />
                    </Stack>

                    <Group justify="right">
                        <Button color='gray' variant='light' onClick={() => closeModal(action)}>Batal</Button>
                        <Button color='red' variant='light'
                            onClick={async () => {
                                openConfirmModal({
                                    title: 'Hapus Bimbingan Magang',
                                    centered: true,
                                    children: (
                                        <Text size="sm">
                                            Apakah anda yakin ingin menghapus Bimbingan Magang ini?
                                        </Text>
                                    ),
                                    labels: { confirm: 'Ya', cancel: 'Tidak' },
                                    cancelProps: { variant: 'light', color: 'gray' },
                                    confirmProps: { variant: 'light', color: 'red' },
                                    onCancel: () => console.log('Cancel'),
                                    onConfirm: async () => {
                                        try {
                                            await deleteBimbinganMagang(record.id)
                                            notifications.show({
                                                title: 'Berhasil',
                                                message: 'Bimbingan Magang telah dihapus',
                                                color: 'blue',
                                            });
                                            fetchData()
                                        } catch (error) {
                                            console.log(error)
                                            notifications.show({
                                                title: 'Gagal',
                                                message: 'Bimbingan Magang gagal dihapus',
                                                color: 'red',
                                            });
                                        }

                                        closeModal(action)
                                    }
                                });
                            }}
                        >Hapus</Button>
                    </Group>
                </Stack>
            ),
        });
    }
};


export default TableBimbinganMagang