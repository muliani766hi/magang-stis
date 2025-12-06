'use client'
import { Button, Group, Modal, Select, Stack, Switch, Text, TextInput } from '@mantine/core'
import React from 'react'
import TableUnitKerja from '@/components/Table/TableUnitKerja/TableUnitKerja'
import { RecordUnitKerja } from '@/components/Table/TableUnitKerja/TableUnitKerja'
import { IconFileImport, IconPlus } from '@tabler/icons-react'
import { getUnitKerja, postUnitKerja } from '@/utils/unit-kerja'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { getToken } from '@/utils/get-profile'
import { getProvinsi } from '@/utils/provinsi'

const UnitKerja = () => {
    const [data, setData] = React.useState([]);
    const [dataProvinsi, setDataProvinsi] = React.useState([]); // data provinsi for select
    const [loading, setLoading] = React.useState(true);
    const [opened, { open, close }] = useDisclosure(false);

    const fetchData = async () => {
        const response = await getUnitKerja();
        const response2 = await getProvinsi(); // data provinsi for select

        // add id field
        let modifiedData = response.data.map((item: { satkerId: any; }) => ({
            ...item,
            id: item.satkerId,
        }));

        // get the firts array of kapasitas
        modifiedData = modifiedData.map((item: { kapasitas: any; }) => ({
            ...item,
            kapasitas: item.kapasitas[0]
        }));

        setData(modifiedData);

        // data provinsi for select
        let modifiedDataProvinsi = response2.data.map((item: { kodeProvinsi: any; nama: any; }) => ({
            value: String(item.kodeProvinsi),
            label: item.nama
        }));
        // console.log(modifiedDataProvinsi);

        setDataProvinsi(modifiedDataProvinsi);

        setLoading(false)
    };

    React.useEffect(() => {
        fetchData();
    }, []);



    const form = useForm({
        initialValues: {
            nama: '',
            alamat: '',
            email: '',
            namaKabupatenKota: '',
            kodeKabupatenKota: '',
            kodeProvinsi: '',
            internalBPS: false
        },
        validate: {
            nama: (value) =>
                value !== "" ? null : "Nama tidak boleh kosong",
            alamat: (value) =>
                value !== "" ? null : "Alamat tidak boleh kosong",
            email: (value) => {
                value !== "" ? null : "Email tidak boleh kosong";
                if (!/^ [^\s@] + @[^\s@] +\.[^\s@] + $ /.test(value)) {
                    return 'Email tidak valid';
                }
            },
            namaKabupatenKota: (value) =>
                value !== "" ? null : "Kabupaten/Kota tidak boleh kosong",
            kodeKabupatenKota: (value) =>
                value !== "" ? null : "kodeKabupatenKota tidak boleh kosong",
            kodeProvinsi: (value) =>
                value !== "" ? null : "Kode tidak boleh kosong",
        }
    });

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        const token = await getToken();
        console.log(token);
        if (file) {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            // myHeaders.append("Content-Type", "multipart/form-data");

            const formdata = new FormData();
            formdata.append("file", file);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
                // redirect: "follow"
            };

            console.log(process.env.API_URL)

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/satker/bulk`, requestOptions);
                // console.log(await response.json());

                notifications.show(
                    {
                        title: "Berhasil",
                        message: "File berhasil diunggah",
                    }
                )
                fetchData();
            } catch (error) {
                console.error("Failed to upload file", error);
                notifications.show(
                    {
                        title: "Gagal",
                        message: "File gagal diunggah",
                        color: "red"
                    }
                )
            }
        }
    };

    return (
        <>
            <Text c="dimmed" mb="md">Unit Kerja</Text>
            <Group mb={10}>
                <Button onClick={open} leftSection={<IconPlus size={14} />}>Tambah</Button>
                <Button leftSection={<IconFileImport size={14} />}>
                    <input type="file" accept=".xlsx" onChange={handleFileUpload} style={{ display: 'none' }} id="fileUpload" />
                    <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>Impor</label></Button>
            </Group>
            <TableUnitKerja records={data} loading={loading} fetchData={fetchData} dataProvinsi={dataProvinsi} />

            <Modal
                size="md"
                opened={opened}
                onClose={close}
                closeOnClickOutside={false}
                title={<Text size="xl">Tambah Unit Kerja</Text>}
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <form onSubmit={form.onSubmit(async (values) => {
                    try {
                        const response = await postUnitKerja(values);

                        notifications.show({
                            title: 'Berhasil',
                            message: 'Satker berhasil ditambahkan',
                            color: 'blue',
                        });

                        setLoading(true);
                        await fetchData();
                        close();
                        form.reset();
                    } catch (error) {
                        console.log(error);
                        notifications.show({
                            title: 'Gagal',
                            message: 'Satker gagal ditambahkan',
                            color: 'red',
                        });
                    }
                })}>
                    <Stack>
                        <TextInput label="Nama" {...form.getInputProps('nama')} />
                        <TextInput label="Email" {...form.getInputProps('email')} />
                        <TextInput label="Alamat" {...form.getInputProps('alamat')} />
                        <Select
                            label="Provinsi"
                            data={dataProvinsi}
                            searchable
                            {...form.getInputProps('kodeProvinsi')}
                        />
                        <TextInput label="Nama Kabupaten/Kota" {...form.getInputProps('namaKabupatenKota')} />
                        <TextInput label="kode Kabupaten/Kota" {...form.getInputProps('kodeKabupatenKota')} />

                        <Switch label="Internal BPS" {...form.getInputProps('internalBPS', { type: 'checkbox' })} labelPosition='left' />
                        <Group justify='right'>
                            <Button type='submit'
                                color='blue'
                                variant='light'
                            >Simpan</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </>
    )
}

export default UnitKerja