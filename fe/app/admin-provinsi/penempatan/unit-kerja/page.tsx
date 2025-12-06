'use client'
import { Button, Group, Modal, Select, Stack, Switch, Text, TextInput } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import TableUnitKerja from '@/components/Table/TableUnitKerja/TableUnitKerjaAdminProvinsi'
import { IconFileImport, IconMapPin, IconPlus } from '@tabler/icons-react'
import { getUnitKerja, postUnitKerja } from '@/utils/unit-kerja'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { getToken } from '@/utils/get-profile'
import { getProvinsi } from '@/utils/provinsi'

const UnitKerja = () => {
    const [data, setData] = React.useState([]);
    const [kodeProvinsi, setkodeProvinsi] = React.useState('' as string)
    const [loading, setLoading] = React.useState(true);
    const [opened, { open, close }] = useDisclosure(false);

    const [dataDropdownSatker, setDataDropdownSatker] = useState([]);
    const [searchSatker, setSearchSatker] = useState('')
    const [debouncedSearchSatker] = useDebouncedValue(searchSatker, 300)

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)

    const fetchData = async (currentPage = page) => {
        // const response = await getUnitKerja();
        const response = await getUnitKerja({
            searchSatker: debouncedSearchSatker,
            page: currentPage,
            pageSize,
        })

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
        setTotal(response.total || 0)
        setkodeProvinsi(response.data[0].kodeProvinsi);
        if (!dataDropdownSatker?.length) {
            fetchDataDropdown();
        }
        setLoading(false)
    };

    // React.useEffect(() => {
    //     fetchData();
    // }, []);

    useEffect(() => {
        setPage(1);
        setLoading(true);
        fetchData(1); // <= fetch dengan page 1
    }, [debouncedSearchSatker]);

    useEffect(() => {
        setLoading(true);
        fetchData(page);
    }, [page, pageSize]);

   const fetchDataDropdown = async ()=>{
        getProvinsi().then((res) => {
            const semuaKabupaten = res.data.flatMap((prov: any) => prov.kabupatenKota || []);
            setDataDropdownSatker(semuaKabupaten.map((kota: any) => kota.nama));
        })
    }  

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
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
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

            // console.log(process.env.API_URL)

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

            }
        }
    };

    return (
        <>
            <Text c="dimmed" mb="md">Unit Kerja</Text>
            <Group mb={10}>
                <Button onClick={() => {
                    open();
                    form.setValues({
                        kodeProvinsi: kodeProvinsi
                    })
                }} leftSection={<IconPlus size={14} />}>Tambah</Button>
                {/* <Button leftSection={<IconFileImport size={14} />}>
                    <input type="file" accept=".xlsx" onChange={handleFileUpload} style={{ display: 'none' }} id="fileUpload" />
                    <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>Impor</label></Button> */}
                <Select
                  placeholder="Cari Satuan Kerja"
                  searchable
                  clearable
                  value={searchSatker}
                  onChange={(val) => setSearchSatker(val || '')}
                  data={dataDropdownSatker}
                  leftSection={<IconMapPin size={16} />}
                />        
            </Group>
            {/* <TableUnitKerja records={data} loading={loading} fetchData={fetchData} /> */}
            <TableUnitKerja
                records={data}
                loading={loading}
                fetchData={fetchData}
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                total={total}
                // dataProvinsi={dataProvinsi} 
            />

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
                        <TextInput
                            label="Nama Kabupaten/Kota"
                            description="Nama Kabupaten/Kota tempat berdirinya unit kerja"
                            {...form.getInputProps('namaKabupatenKota')} />
                        <TextInput
                            label="Kode Kabupaten/Kota"
                            description="Kode Kabupaten/Kota baru"
                            {...form.getInputProps('kodeKabupatenKota')} />
                        <TextInput label="Kode Provinsi" {...form.getInputProps('kodeProvinsi')} style={{ display: 'none' }} />

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