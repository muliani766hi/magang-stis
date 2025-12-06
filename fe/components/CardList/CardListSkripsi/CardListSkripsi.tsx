import { putBimbinganSkripsi } from '@/utils/bimbingan-skripsi'
import { ActionIcon, Box, Button, Card, Group, Stack, Text, TextInput, Textarea, rem } from '@mantine/core'
import { DateInput, TimeInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { closeModal, openModal } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconClock, IconDetails, IconEdit, IconEye, IconVideo } from '@tabler/icons-react'
import React, { useRef } from 'react'

export interface RecordSkripsi {
    izinBimbinganId: number
    jenis: number
    tanggal: string
    keterangan: string
    status: string
    jamMulai: string
    jamSelesai: string
}


const CardListSkripsi = ({ records, fetchData }: { records: RecordSkripsi[], fetchData: () => void }) => {
    // Check if records array is empty
    if (records.length === 0) {
        return (
            <Text size="sm" mt="xl" c="dimmed" ta="center" fs="italic">
                Belum ada data
            </Text >
        )
    }
    const cardList = records.map((item) => (
        <Card key={item.izinBimbinganId} shadow="xs" withBorder padding="lg" radius="sm" style={{ marginTop: 10 }} >
            <Group justify="space-between">
                <Box w={"80%"}>
                    <Text size="xl" >
                        Perizinan {item.jenis}
                    </Text>
                    <Text size="sm">Tanggal: {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                    <Text size="xs" c="dimmed">Mulai: {new Date(item.jamMulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</Text>
                    <Text size="xs" c="dimmed">Selesai: {new Date(item.jamSelesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</Text>
                    {/* if description reach max width turn into ... */}
                    <Text size="sm" lineClamp={1}>Keterangan: {item.keterangan}</Text>
                </Box>

                <Group>
                    {/* {item.status === 'Disetujui' ? (
                        <Button color="green" variant="light">
                            {item.status}
                        </Button>
                    ) : item.status === 'Ditolak' ? (
                        <Button color="red" variant="light">
                            {item.status}
                        </Button>
                    ) : (
                        <Button color="orange" variant="light">
                            {item.status}
                        </Button>
                    )} */}

                    {/* detail */}
                    <Button
                        color="blue"
                        variant="light"
                        onClick={() => showModal({ record: item, fetchData })}
                    >
                        <IconEdit size={20} />
                    </Button>
                </Group>
            </Group>
        </Card >
    ))

    return (
        <>
            {cardList}

        </>
    )
}

const showModal = ({ record, fetchData }: { record: any, fetchData: () => void }) => {
    const FormComponent = () => {
        const form = useForm({
            initialValues: {
                tanggal: new Date(record.tanggal),
                keterangan: record.keterangan,
                jamMulai: record.jamMulai,
                jamSelesai: record.jamSelesai,
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
            <form onSubmit={form.onSubmit(async (values) => {
                try {
                    const response = await putBimbinganSkripsi(values, record.izinBimbinganId)
                    // console.log(response)
                    closeModal(record.izinBimbinganId.toString())
                    notifications.show({
                        title: 'Berhasil',
                        message: 'Data berhasil diubah',
                        color: 'blue',
                        // icon: <IconDetails size={24} />,
                    })
                    fetchData()

                } catch (error) {
                    console.log(error)
                    notifications.show({
                        title: 'Gagal',
                        message: 'Data gagal diubah',
                        color: 'red',
                        // icon: <IconDetails size={24} />,
                    })
                }
            })}>
                <Stack>
                    <DateInput label='Tanggal' {...form.getInputProps('tanggal')}
                        valueFormat='DD-MM-YYYY'
                    />
                    <Textarea label='Keterangan' {...form.getInputProps('keterangan')} />
                    <TimeInput label="Jam Mulai"
                        ref={ref}
                        rightSection={pickerControl}
                        {...form.getInputProps('jamMulai')} />
                    <TimeInput label="Jam Selesai"
                        ref={ref2}
                        rightSection={pickerControl2}
                        {...form.getInputProps('jamSelesai')} />

                    <Group justify='right'>
                        <Button
                            type='submit'
                            color='blue'
                            variant='light'
                        >Ubah</Button>
                    </Group>
                </Stack >
            </form >
        );
    }

    openModal({
        modalId: record.izinBimbinganId.toString(),
        title: 'Detail Bimbingan Skripsi',
        centered: true,
        children: (
            <FormComponent />
        )
    })
}


export default CardListSkripsi