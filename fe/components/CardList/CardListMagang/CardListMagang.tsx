import { putBimbinganMagang } from '@/utils/bimbingan-magang'
import { Box, Button, Card, Group, Stack, Text, TextInput, Textarea } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { closeModal, openModal } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconDetails, IconEdit, IconEye, IconVideo } from '@tabler/icons-react'
import React from 'react'

export interface RecordMagang {
    id: number
    jenis: number
    tanggal: string
    deskripsi: string
    status: string
    tempat: string
}


const CardListMagang = ({ records, fetchData }: { records: RecordMagang[], fetchData: () => void }) => {

    const isArray = Array.isArray(records);

    // Check if records array is empty
    if (records.length === 0) {
        return (
            <Text size="sm" mt="xl" c="dimmed" ta="center" fs="italic">
                Belum ada data
            </Text >
        )
    }

    const cardList = records.map((item) => (
        <Card key={item.id} shadow="xs" withBorder padding="lg" radius="sm" style={{ marginTop: 10 }} >
            <Group justify="space-between">
                <Box w={"80%"}>
                    <Text size="xl" >
                        Bimbingan {item.jenis}
                    </Text>
                    <Text size="sm">Tanggal: {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                    <Text size="sm" lineClamp={1}>Deskripsi: {item.deskripsi}</Text>
                </Box>

                <Group>
                    {item.status === 'Disetujui' ? (
                        <Button color="green" variant="light" style={{ pointerEvents: 'none' }}>
                            {item.status}
                        </Button>
                    ) : item.status === 'Selesai' ? (
                        <Button color="blue" variant="light" style={{ pointerEvents: 'none' }}>
                            {item.status}
                        </Button>
                    ) : (
                        <Button color="orange" variant="light" style={{ pointerEvents: 'none' }}>
                            {item.status}
                        </Button>
                    )}

                    {/* detail */}
                    <Button
                        color="blue"
                        variant="light"
                        onClick={() => showModal({ record: item, fetchData })}
                        title='Edit'
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

const showModal = ({ record, fetchData }: { record: RecordMagang, fetchData: () => void }) => {
    const FormComponent = () => {
        const form = useForm({
            initialValues: {
                id: record.id,
                tanggal: new Date(record.tanggal),
                deskripsi: record.deskripsi || '',
                tempat: record.tempat || ''
            },
            validate: {
                tanggal: (value) => {
                    if (!value) {
                        return 'Tanggal tidak boleh kosong';
                    }
                },
                deskripsi: (value) => {
                    if (!value) {
                        return 'Deskripsi tidak boleh kosong';
                    }
                }
            }
        })

        return (
            <form onSubmit={form.onSubmit(async (values) => {
                try {
                    const response = await putBimbinganMagang(values)
                    // console.log(response)
                    closeModal(record.id.toString())
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
                    <Textarea label='Deskripsi' {...form.getInputProps('deskripsi')} />
                    {/* <TextInput label='Tempat' {...form.getInputProps('tempat')} /> */}
                    <TextInput label='Tempat' {...form.getInputProps('tempat')} />

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
        modalId: record.id.toString(),
        title: 'Detail Bimbingan Skripsi',
        centered: true,
        children: (
            <FormComponent />
        )
    })
    // openModal({
    //     modalId: record.id.toString(),
    //     title: 'Detail Bimbingan',
    //     children: (
    //         <Stack gap="md">
    //             {/* <Text size="xl">Detail Bimbingan</Text> */}
    //             <TextInput label="Tanggal" value={record.tanggal} />
    //             <Textarea label="Deskripsi" value={record.deskripsi} />
    //             <TextInput label="Status" value={record.status} readOnly />


    //             <Button
    //                 color="blue"
    //                 variant="light"
    //                 onClick={() => {
    //                     window.open(record.tempat, '_blank')
    //                 }}
    //             >
    //                 <IconVideo size={20} />


    //             </Button>
    //             <Group justify='end'>
    //                 <Button
    //                     color='blue'
    //                     variant='light'
    //                     onClick={() => {
    //                         closeModal(record.id.toString())
    //                         notifications.show({
    //                             title: 'Berhasil',
    //                             message: 'Perubahan berhasil disimpan',
    //                             color: 'green',
    //                         });
    //                     }}
    //                 >
    //                     Simpan
    //                 </Button>
    //             </Group>
    //         </Stack>
    //     )
    // })

}


export default CardListMagang