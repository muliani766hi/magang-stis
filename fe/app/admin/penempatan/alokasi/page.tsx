'use client'
import { Switch, Text, Tabs, Stack, ActionIcon, Group, Select, TextInput } from '@mantine/core'
import React, { useState, useEffect } from 'react'
import { getAccessAlocation, putAccessAlocation } from '@/utils/access-alocation';
import { getListPemilihanPenempatan } from '@/utils/pemilihan-tempat'
import { notifications } from "@mantine/notifications";
import TabelPengalokasianMahasiswa from '@/components/Table/admin/TabelPengalokasian/TabelPengalokasian';
import TabelPengalokasianSatker from '@/components/Table/admin/TabelPengalokasian/TabelPengalokasianSatker';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconX, IconMapPin, IconBuildingBank, IconUser } from '@tabler/icons-react';
import { getProvinsi } from '@/utils/provinsi';

const Alokasi = () => {
    const [loading, setLoading] = useState(true);
    const [dataDropdownProvinsi, setDataDropdownProvinsi] = useState<{ value: string; label: string }[]>([]);
    const [dataDropdownSatker, setDataDropdownSatker] = useState([]);
    const [isAccessAlocation, setIsAccessAlocation] = useState(false);
    const [idAccessAlocation, setIdAccessAlocation] = useState(0)
    
    // State untuk Satuan Kerja
    const [satkerData, setSatkerData] = useState([])
    const [searchSatker, setSearchSatker] = useState('');
    const [debouncedSearchSatker] = useDebouncedValue(searchSatker, 300); // Debounced search

    const [searchProvinsiSatker, setSearchProvinsiSatker] = useState('');
    const [debouncedSearchProvinsiSatker] = useDebouncedValue(searchProvinsiSatker, 300);

    const [searchStatusSatker, setSearchStatusSatker] = useState('');
    const [debouncedSearchStatusSatker] = useDebouncedValue(searchStatusSatker, 300);

    const [pageSatker, setPageSatker] = useState(1)
    const [pageSizeSatker, setPageSizeSatker] = useState(10)
    const [totalSatker, setTotalSatker] = useState(0)

    // State untuk Mahasiswa
    const [mahasiswaData, setMahasiswaData] = useState([])
    const [searchNamaMahasiswa, setSearchNamaMahasiswa] = useState('');
    const [debouncedSearchNamaMahasiswa] = useDebouncedValue(searchNamaMahasiswa, 300);

    const [searchProdi, setSearchProdi] = useState('');
    const [debouncedSearchProdi] = useDebouncedValue(searchProdi, 300);

    const [searchPenempatan, setSearchPenempatan] = useState('');
    const [debouncedSearchPenempatan] = useDebouncedValue(searchPenempatan, 300);

    const [searchPilihan1, setSearchPilihan1] = useState('');
    const [debouncedSearchPilihan1] = useDebouncedValue(searchPilihan1, 300);

    const [searchProvPilihan1, setSearchProvPilihan1] = useState('');
    const [debouncedSearchProvPilihan1] = useDebouncedValue(searchProvPilihan1, 300);

    const [searchPilihan2, setSearchPilihan2] = useState('');
    const [debouncedSearchPilihan2] = useDebouncedValue(searchPilihan2, 300);

    const [searchProvPilihan2, setSearchProvPilihan2] = useState('');
    const [debouncedSearchProvPilihan2] = useDebouncedValue(searchProvPilihan2, 300);

    const [searchStatusMahasiswa, setSearchStatusMahasiswa] = useState('');
    const [debouncedSearchStatusMahasiswa] = useDebouncedValue(searchStatusMahasiswa, 300);

    const [pageMahasiswa, setPageMahasiswa] = useState(1)
    const [pageSizeMahasiswa, setPageSizeMahasiswa] = useState(10)
    const [totalMahasiswa, setTotalMahasiswa] = useState(0) 

    

    const fetchAccessAlocation = async () => {
        const result = await getAccessAlocation()
        setIsAccessAlocation(result?.data?.status)
        setIdAccessAlocation(result?.data?.id)
        setLoading(false)
    }

    const fetchListPenempatan = async (currentPageSatker = pageSatker, currentPageMahasiswa = pageMahasiswa) => {
        const result = await getListPemilihanPenempatan({
            searchSatker: debouncedSearchSatker,
            searchProvinsiSatker: debouncedSearchProvinsiSatker,
            searchStatusSatker: debouncedSearchStatusSatker,

            searchNamaMahasiswa: debouncedSearchNamaMahasiswa,
            searchProdi: debouncedSearchProdi,
            searchPenempatan: debouncedSearchPenempatan,
            searchPilihan1: debouncedSearchPilihan1,
            searchProvPilihan1: debouncedSearchProvPilihan1,
            searchPilihan2: debouncedSearchPilihan2,
            searchProvPilihan2: debouncedSearchProvPilihan2,
            searchStatusMahasiswa: debouncedSearchStatusMahasiswa,

            pageSatker: currentPageSatker,
            pageSizeSatker,
            pageMahasiswa: currentPageMahasiswa,
            pageSizeMahasiswa,
        })
        setSatkerData(result.data?.satker)
        setMahasiswaData(result.data?.mahasiswa)
        setTotalMahasiswa(result.data?.totalMahasiswa)
        setTotalSatker(result.data?.totalSatker)
        // fetchDataDropdown()
        setLoading(false)
    }

    const fetchDataDropdown = async ()=>{
        const result = await getProvinsi()
        const semuaKabupaten = result.data.flatMap((prov: any) => prov.kabupatenKota || []);
        setDataDropdownSatker(semuaKabupaten.map((kota: any) => kota.nama));
        setDataDropdownProvinsi(
        result.data.map((prov: any) => ({
            value: prov.nama,
            label: prov.nama,
        }))
        );
    }

    useEffect(() => {
      const init = async () => {
        if (!dataDropdownSatker?.length) {
          await fetchDataDropdown(); // TUNGGU SELESAI DULU
        }
        await fetchListPenempatan();
      };
      init();
    }, []);    

    // useEffect(()=>{
    //     fetchListPenempatan()
    // },[])

    useEffect(() => {
        if (!isAccessAlocation) {
            fetchAccessAlocation()
        }
    }, [isAccessAlocation])

    useEffect(() => {
        setPageSatker(1);
        setPageMahasiswa(1);
        // setLoading(true);
        fetchListPenempatan()
    }, [debouncedSearchSatker, debouncedSearchProvinsiSatker, debouncedSearchStatusSatker, debouncedSearchNamaMahasiswa, debouncedSearchProdi, debouncedSearchPenempatan, debouncedSearchPilihan1, debouncedSearchProvPilihan1, debouncedSearchPilihan2, debouncedSearchProvPilihan2, debouncedSearchStatusMahasiswa])

    useEffect(() => {
        setLoading(true);
        fetchListPenempatan(pageSatker, pageMahasiswa);
    }, [pageMahasiswa, pageSizeMahasiswa, pageSatker, pageSizeSatker]);

    return (
        <>
            <Text c="dimmed" mb="md">Penempatan Magang Mahasiswa</Text>
            <Switch
                checked={isAccessAlocation}
                onChange={async (event) => {
                    setIsAccessAlocation(event.currentTarget.checked)
                    const res = await putAccessAlocation(idAccessAlocation, event.currentTarget.checked)
                    notifications.show({ title: res.status, message: res.message });
                }}
                label="Akses pengalokasian BPS Provinsi"
            />
            <Stack style={{ marginTop: "20px", marginBottom: "10px" }}>
                <Tabs defaultValue="satker" variant="outline">
                    <Tabs.List>
                        <Tabs.Tab value="satker" >
                           <IconBuildingBank size={12} style={{ marginRight: 8 }} /> Satuan Kerja
                        </Tabs.Tab>
                        <Tabs.Tab value="mahasiswa" >
                           <IconUser size={12} style={{ marginRight: 8 }} /> Mahasiswa
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="satker">
                        <Group grow style={{ marginTop: "10px", marginBottom: "10px"  }}>
                        <Select
                            placeholder="Cari Provinsi"
                            searchable
                            clearable
                            value={searchProvinsiSatker}
                            onChange={(val) => setSearchProvinsiSatker(val || '')}
                            data={dataDropdownProvinsi}
                            leftSection={<IconMapPin size={16} />}
                        />
                        <Select
                            placeholder="Cari Satker"
                            searchable
                            clearable
                            value={searchSatker}
                            onChange={(val) => setSearchSatker(val || '')}
                            data={dataDropdownSatker}
                            leftSection={<IconMapPin size={16} />}
                        />
                        </Group>
                        <TabelPengalokasianSatker
                            fetchData={fetchListPenempatan}
                            loading={loading}
                            records={satkerData} 
                            page={pageSatker}
                            pageSize={pageSizeSatker}
                            totalRecords={totalSatker}
                            setPage={setPageSatker}
                            setPageSize={setPageSizeSatker}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="mahasiswa">
                        <Group grow style={{ marginTop: "10px", marginBottom: "10px"  }}>
                        <TextInput
                            placeholder="Cari Nama"
                            value={searchNamaMahasiswa}
                            onChange={(e) => setSearchNamaMahasiswa(e.currentTarget.value)}
                            leftSection={<IconSearch size={16} />}
                            rightSection={
                            searchNamaMahasiswa && (
                                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchNamaMahasiswa('')}>
                                <IconX size={14} />
                                </ActionIcon>
                            )
                            }
                        />
                        <Select
                            placeholder="Cari Pilihan 1"
                            searchable
                            clearable
                            value={searchPilihan1}
                            onChange={(val) => setSearchPilihan1(val || '')}
                            data={dataDropdownSatker}
                            leftSection={<IconMapPin size={16} />}
                        />
                        <Select
                            placeholder="Cari Prov Pil 1"
                            searchable
                            clearable
                            value={searchProvPilihan1}
                            onChange={(val) => setSearchProvPilihan1(val || '')}
                            data={dataDropdownProvinsi}
                            leftSection={<IconMapPin size={16} />}
                        />
                        <Select
                            placeholder="Cari Pilihan 2"
                            searchable
                            clearable
                            value={searchPilihan2}
                            onChange={(val) => setSearchPilihan2(val || '')}
                            data={dataDropdownSatker}
                            leftSection={<IconMapPin size={16} />}
                        />
                        <Select
                            placeholder="Cari Prov Pil 2"
                            searchable
                            clearable
                            value={searchProvPilihan2}
                            onChange={(val) => setSearchProvPilihan2(val || '')}
                            data={dataDropdownProvinsi}
                            leftSection={<IconMapPin size={16} />}
                        />
                        <Select
                            placeholder="Cari Status"
                            data={[
                                { value: 'menunggu', label: 'Menunggu' },
                                { value: 'dialihkan', label: 'Dialihkan' },
                                { value: 'disetujui', label: 'Disetujui' },
                                { value: 'dikonfirmasi', label: 'Dikonfirmasi' },
                            ]}
                            value={searchStatusMahasiswa}
                            onChange={(value) => setSearchStatusMahasiswa(value || '')}
                            clearable
                            searchable
                            leftSection={<IconSearch size={16} />}
                        />
                        </Group>
                        <TabelPengalokasianMahasiswa
                            fetchData={fetchListPenempatan}
                            loading={loading}
                            records={mahasiswaData}
                            page={pageMahasiswa}
                            pageSize={pageSizeMahasiswa}
                            totalRecords={totalMahasiswa}
                            setPage={setPageMahasiswa}
                            setPageSize={setPageSizeMahasiswa}
                        />

                    </Tabs.Panel>
                </Tabs>
            </Stack>
        </>
    )
}

export default Alokasi