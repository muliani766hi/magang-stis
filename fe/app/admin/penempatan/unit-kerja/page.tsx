'use client'

import {
    ActionIcon,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import TableUnitKerja from '@/components/Table/TableUnitKerja/TableUnitKerja'
import { IconFileImport, IconMapPin, IconPlus, IconSearch, IconX } from '@tabler/icons-react'
import { getUnitKerja, postUnitKerja } from '@/utils/unit-kerja'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { getToken } from '@/utils/get-profile'
import { getProvinsi } from '@/utils/provinsi'

const UnitKerja = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [opened, { open, close }] = useDisclosure(false)

  const [dataProvinsi, setDataProvinsi] = useState([])
  const [dataDropdownSatker, setDataDropdownSatker] = useState([]);
  const [dataDropdownProvinsi, setDataDropdownProvinsi] = useState([]);
  const [searchSatker, setSearchSatker] = useState('')
  const [searchProvinsi, setSearchProvinsi] = useState('')
  const [debouncedSearchSatker] = useDebouncedValue(searchSatker, 300)
  const [debouncedSearchProvinsi] = useDebouncedValue(searchProvinsi, 300)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  const fetchData = async (currentPage = page) => {
    setLoading(true)
    try {
      if (dataDropdownSatker?.length === 0) { 
        fetchDataDropdown()
      }

      const response = await getUnitKerja({
        searchSatker: debouncedSearchSatker,
        searchProvinsi: debouncedSearchProvinsi,
        page: currentPage,
        pageSize,
      })

      const updated = response.data.map((item: any) => ({
        ...item,
        id: item.satkerId,
        kapasitas: item.kapasitas?.[0] || null,
      }))

      setRecords(updated)
      setTotal(response.total || 0)
    } catch (err) {
      console.error(err)
      notifications.show({
        title: 'Gagal',
        message: 'Gagal mengambil data',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

    useEffect(() => {
        setPage(1);
        setLoading(true);
        fetchData(1); // <= fetch dengan page 1
    }, [debouncedSearchSatker, debouncedSearchProvinsi]);

    useEffect(() => {
        setLoading(true);
        fetchData(page);
    }, [page, pageSize]);

    useEffect(() => {
      const init = async () => {
        if (!dataDropdownSatker?.length) {
          await fetchDataDropdown(); // TUNGGU SELESAI DULU
        }
        await fetchData();
      };
      init();
    }, []);    

  const fetchDataDropdown = async ()=> {
    getProvinsi().then((res) => {
      const formatted = res.data.map((item: any) => ({
        value: String(item.kodeProvinsi),
        label: item.nama,
      }))
      setDataProvinsi(formatted)
      setDataDropdownProvinsi(
        res.data.map((prov: any) => ({
            value: prov.nama,
            label: prov.nama,
        }))
        );
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
      internalBPS: false,
    },
    validate: {
      nama: (value) => (value !== '' ? null : 'Nama tidak boleh kosong'),
      alamat: (value) => (value !== '' ? null : 'Alamat tidak boleh kosong'),
      email: (value) => {
        if (value === '') return 'Email tidak boleh kosong'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email tidak valid'
        return null
      },
      namaKabupatenKota: (value) =>
        value !== '' ? null : 'Kabupaten/Kota tidak boleh kosong',
      kodeKabupatenKota: (value) =>
        value !== '' ? null : 'kodeKabupatenKota tidak boleh kosong',
      kodeProvinsi: (value) => (value !== '' ? null : 'Kode tidak boleh kosong'),
    },
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const token = await getToken()
    if (file) {
      const formdata = new FormData()
      formdata.append('file', file)

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/satker/bulk`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token
          },
          body: formdata,
        })
        if (!response.ok) throw new Error("Failed to upload file");
        notifications.show({
          title: 'Berhasil',
          message: 'File berhasil diunggah',
        })
        fetchData()
      } catch (error) {
        notifications.show({
          title: 'Gagal',
          message: 'File gagal diunggah',
          color: 'red',
        })
      }
    }
  }

  return (
    <>
      <Text c="dimmed" mb="md">
        Unit Kerja
      </Text>
      <Group mb={10}>
        <Button onClick={open} leftSection={<IconPlus size={14} />}>
          Tambah
        </Button>
        <label htmlFor="fileUpload">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="fileUpload"
          />
          <Button component="span" leftSection={<IconFileImport size={14} />}>
            Impor
          </Button>
        </label>
      </Group>

      {/* External filters */}
      <Group grow mb="sm">
        <Select
          placeholder="Cari Satuan Kerja"
          searchable
          clearable
          value={searchSatker}
          onChange={(val) => setSearchSatker(val || '')}
          data={dataDropdownSatker}
          leftSection={<IconMapPin size={16} />}
        />
        <Select
          placeholder="Cari Provinsi"
          searchable
          clearable
          value={searchProvinsi}
          onChange={(val) => setSearchProvinsi(val || '')}
          data={dataDropdownProvinsi}
          leftSection={<IconMapPin size={16} />}
        />        
      </Group>

      {/* Table */}
      <TableUnitKerja
        records={records}
        loading={loading}
        fetchData={fetchData}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        total={total}
        dataProvinsi={dataProvinsi} 
      />

      {/* Modal */}
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
        <form
          onSubmit={form.onSubmit(async (values) => {
            try {
              await postUnitKerja(values)
              notifications.show({
                title: 'Berhasil',
                message: 'Satker berhasil ditambahkan',
                color: 'blue',
              })
              fetchData()
              close()
              form.reset()
            } catch (error) {
              notifications.show({
                title: 'Gagal',
                message: 'Satker gagal ditambahkan',
                color: 'red',
              })
            }
          })}
        >
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
            <TextInput
              label="Nama Kabupaten/Kota"
              {...form.getInputProps('namaKabupatenKota')}
            />
            <TextInput
              label="kode Kabupaten/Kota"
              {...form.getInputProps('kodeKabupatenKota')}
            />
            <Switch
              label="Internal BPS"
              {...form.getInputProps('internalBPS', { type: 'checkbox' })}
              labelPosition="left"
            />
            <Group justify="right">
              <Button type="submit" color="blue" variant="light">
                Simpan
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  )
}

export default UnitKerja