'use client'

import TableMahasiswa from '@/components/Table/TableMahasiswa/TableMahasiswa'
import { getAllDosenPembimbing } from '@/utils/kelola-user/dosen-pembimbing';
import { getAllMahasiswa, getToken } from '@/utils/kelola-user/mahasiswa';
import { getAllPembimbingLapangan } from '@/utils/kelola-user/pembimbing-lapangan';
import { getUnitKerja } from '@/utils/unit-kerja';
import { ActionIcon, Button, Group, Select, SimpleGrid, Text, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconFileImport, IconMapPin, IconSearch, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';

interface TahunAjaran {
  tahunAjaranId: string;
  tahun: string;
  isActive: boolean;
}

const KelolaMahasiswa = () => {
  const [data, setData] = useState([]);
  const [dataDosen, setDataDosen] = useState([]);
  const [dataPemlap, setDataPemlap] = useState([]);
  const [dataSatker, setDataSatker] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataTahunAjaran, setDataTahunAjaran] = useState<TahunAjaran[]>([]);
  const [selectedTahun, setSelectedTahun] = useState("");

  const [searchNama, setSearchNama] = useState('');
  const [searchNIM, setSearchNIM] = useState('');
  const [searchKelas, setSearchKelas] = useState('');
  const [searchAlamat, setSearchAlamat] = useState('');
  const [filterSatker, setFilterSatker] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [debouncedSearchNama] = useDebouncedValue(searchNama, 400);
  const [debouncedSearchNIM] = useDebouncedValue(searchNIM, 400);
  const [debouncedSearchKelas] = useDebouncedValue(searchKelas, 400);
  const [debouncedSearchAlamat] = useDebouncedValue(searchAlamat, 400);
  const [debouncedFilterSatker] = useDebouncedValue(filterSatker, 400);

  const fetchData = async (currentPage = page) => {
    try {
      const response = await getAllMahasiswa({
        tahunAjaran: selectedTahun,
        searchNama: debouncedSearchNama,
        searchNIM: debouncedSearchNIM,
        searchKelas: debouncedSearchKelas,
        searchAlamat: debouncedSearchAlamat,
        searchSatker: debouncedFilterSatker,
        page: currentPage,
        pageSize,
      });
      const modifiedData = response.data.map((item: { mahasiswaId: any }) => ({
        ...item,
        id: item.mahasiswaId,
      }));
      setData(modifiedData);
      setTotal(response.total);

      if (!dataSatker?.length){
        const response4 = await getUnitKerja();
        let modifiedDataSatker = response4.data.map((item: { satkerId: any; nama: any; }) => ({
          value: item.nama, // ← Kirim nama, bukan ID
          label: item.nama,
        }));
        setDataSatker(modifiedDataSatker);
      }

      if (!dataDosen?.length){
        const response2 = await getAllDosenPembimbing();
        setDataDosen(response2.data.map((item: any) => ({ value: String(item.dosenId), label: item.nama })));
      }
      
      if(!dataPemlap?.length){
        const response3 = await getAllPembimbingLapangan();
        setDataPemlap(response3.data.map((item: any) => ({ value: String(item.pemlapId), label: item.nama })));   
      }   
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTahunAjaran();
  }, []);

  // Filter berubah: reset page & fetch data langsung
    useEffect(() => {
        if (!selectedTahun) return;
        setPage(1);
        setLoading(true);
        fetchData(1); // <= fetch dengan page 1
    }, [selectedTahun, debouncedSearchNama, debouncedSearchNIM, debouncedSearchKelas, debouncedSearchAlamat, debouncedFilterSatker]);

    // Page atau pageSize berubah: fetch data ulang
    useEffect(() => {
        if (!selectedTahun) return;
        setLoading(true);
        fetchData(page);
    }, [page, pageSize]);


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const token = await getToken();

    if (file) {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const formdata = new FormData();
      formdata.append("file", file);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mahasiswa/excel`, {
          method: "POST",
          headers: myHeaders,
          body: formdata,
        });

        if (!response.ok) throw new Error("Failed to upload file");

        notifications.show({ title: "Berhasil", message: "File berhasil diunggah" });
        fetchData();
      } catch (error) {
        console.error("Failed to upload file", error);
        notifications.show({ title: "Gagal", message: "File gagal diunggah", color: "red" });
      }
    }
  };

  const fetchTahunAjaran = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tahun-ajaran`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setDataTahunAjaran(data.data);
      setSelectedTahun(data.data.find((value: any) => value.isActive).tahun);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Text c="dimmed" mb="md">Kelola Mahasiswa</Text>
      <Group mb={10}>
        <label htmlFor="fileUpload">
          <input type="file" accept=".xlsx" onChange={handleFileUpload} style={{ display: "none" }} id="fileUpload" />
          <Button component="span" leftSection={<IconFileImport size={14} />}>Import</Button>
        </label>
      </Group>

    <SimpleGrid cols={{ md: 2, xl: 4 }} mb="md">
    {/* Tahun Ajaran */}
    <Select
        allowDeselect={false}
        data={dataTahunAjaran
        .sort((a, b) => parseInt(b.tahun) - parseInt(a.tahun))
        .map((item) => ({
            value: item.tahun,
            label: item.tahun,
        }))}
        placeholder="Pilih Tahun Ajaran"
        value={selectedTahun}
        onChange={(value) => setSelectedTahun(value as string)}
    />

    {/* Nama */}
    <TextInput
        placeholder="Cari Nama"
        value={searchNama}
        onChange={(e) => setSearchNama(e.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
        rightSection={
        searchNama && (
            <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchNama('')}>
            <IconX size={14} />
            </ActionIcon>
        )
        }
    />

    {/* NIM */}
    <TextInput
        placeholder="Cari NIM"
        value={searchNIM}
        onChange={(e) => setSearchNIM(e.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
        rightSection={
        searchNIM && (
            <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchNIM('')}>
            <IconX size={14} />
            </ActionIcon>
        )
        }
    />

    {/* Kelas */}
    <TextInput
        placeholder="Cari Kelas"
        value={searchKelas}
        onChange={(e) => setSearchKelas(e.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
        rightSection={
        searchKelas && (
            <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchKelas('')}>
            <IconX size={14} />
            </ActionIcon>
        )
        }
    />

    {/* Alamat Wali */}
    <TextInput
        placeholder="Cari Alamat Wali"
        value={searchAlamat}
        onChange={(e) => setSearchAlamat(e.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
        rightSection={
        searchAlamat && (
            <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchAlamat('')}>
            <IconX size={14} />
            </ActionIcon>
        )
        }
    />

    {/* Satker */}
    <Select
        placeholder="Cari Satker"
        searchable
        clearable
        value={filterSatker}
        onChange={(val) => setFilterSatker(val || '')}
        data={dataSatker}
        leftSection={<IconMapPin size={16} />}
    />

    </SimpleGrid>


      <TableMahasiswa
        records={data}
        loading={loading}
        fetchData={fetchData}
        dataDosen={dataDosen}
        dataPemlap={dataPemlap}
        dataSatker={dataSatker}
        page={page}
        pageSize={pageSize}
        totalRecords={total}
        setPage={setPage}
        setPageSize={setPageSize}
      />
    </>
  );
};

export default KelolaMahasiswa;
