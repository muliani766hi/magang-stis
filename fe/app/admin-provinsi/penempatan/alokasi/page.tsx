'use client'
import { Text, Tabs, Stack, Button, Badge, TextInput, ActionIcon, Alert, Group, Select } from '@mantine/core'
import React, { useState, useEffect } from 'react'
import { getListPemilihanPenempatan } from '@/utils/pemilihan-tempat'
import TabelPengalokasianMahasiswa from '@/components/Table/admin-provinsi/TabelPengalokasian/TabelPengalokasian';
import { useDebouncedValue } from '@mantine/hooks';
import { IconBuildingBank, IconInfoCircle, IconMapPin, IconSearch, IconUser, IconX } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { getAccessAlocation } from '@/utils/access-alocation';
import { getProvinsi } from '@/utils/provinsi';
// import { closeModal, openModal } from '@mantine/modals';

const Alokasi = () => {
    interface Satker {
        dialokasikan: number;
        index: number;
        kapasitasSatkerTahunAjaran: number;
        kodeSatker: string;
        nama: string;
        penempatan: any[];  
        pilihanSatker: any[]; 
        provinsi: {
            nama: string;
        };
        status: string;
    }
    
    const [loading, setLoading] = useState(true);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [aksesEdit, setAksesEdit] = useState(true);
    const [dataDropdownSatker, setDataDropdownSatker] = useState([]);  
    const PAGE_SIZES = [10, 15, 20];  

    // SATKER
    const [satkerData, setSatkerData] = useState<Satker[]>([]);
    const [searchSatker, setSearchSatker] = useState('');
    const [debouncedSearchSatker] = useDebouncedValue(searchSatker, 300);

    const [searchStatusSatker, setSearchStatusSatker] = useState('');
    const [debouncedSearchStatusSatker] = useDebouncedValue(searchStatusSatker, 300);

    const [pageSatker, setPageSatker] = useState(1)
    const [pageSizeSatker, setPageSizeSatker] = useState(10)
    const [totalSatker, setTotalSatker] = useState(0)

    // MAHASISWA
    const [mahasiswaData, setMahasiswaData] = useState([]);
    const [searchNamaMahasiswa, setSearchNamaMahasiswa] = useState('');
    const [debouncedSearchNamaMahasiswa] = useDebouncedValue(searchNamaMahasiswa, 300);

    const [searchProdi, setSearchProdi] = useState('');
    const [debouncedSearchProdi] = useDebouncedValue(searchProdi, 300);

    const [searchPenempatan, setSearchPenempatan] = useState('');
    const [debouncedSearchPenempatan] = useDebouncedValue(searchPenempatan, 300);    
    const [searchStatusMahasiswa, setSearchStatusMahasiswa] = useState('');
    const [debouncedSearchStatusMahasiswa] = useDebouncedValue(searchStatusMahasiswa, 300);

    const [pageMahasiswa, setPageMahasiswa] = useState(1)
    const [pageSizeMahasiswa, setPageSizeMahasiswa] = useState(10)
    const [totalMahasiswa, setTotalMahasiswa] = useState(0) 

    const fetchListPenempatan = async (currentPageSatker = pageSatker, currentPageMahasiswa = pageMahasiswa) => {
        setLoading(true)
        const [result, akses] = await Promise.all([
          getListPemilihanPenempatan({
            searchSatker: debouncedSearchSatker,
            searchStatusSatker: debouncedSearchStatusSatker,

            searchNamaMahasiswa: debouncedSearchNamaMahasiswa,
            searchProdi: debouncedSearchProdi,
            searchPenempatan: debouncedSearchPenempatan,
            searchStatusMahasiswa: debouncedSearchStatusMahasiswa,

            pageSatker: currentPageSatker,
            pageSizeSatker,
            pageMahasiswa: currentPageMahasiswa,
            pageSizeMahasiswa,            
          }),
          getAccessAlocation()
        ])
        setSatkerData(result.data.satker)
        setMahasiswaData(result.data.mahasiswa)
        setTotalMahasiswa(result.data?.totalMahasiswa)
        setTotalSatker(result.data?.totalSatker)
        setAksesEdit(akses?.data?.status === true);
        setLoading(false)
    }

    const fetchDataDropdown = async ()=>{
        const result = await getProvinsi()
        const semuaKabupaten = result.data.flatMap((prov: any) => prov.kabupatenKota || []);
        setDataDropdownSatker(semuaKabupaten.map((kota: any) => kota.nama));
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

    useEffect(() => {
        setPageSatker(1);
        setPageMahasiswa(1);
        // setLoading(true);
      if (dataDropdownSatker?.length) { 
        fetchListPenempatan(1, 1)
      }
    }, [debouncedSearchSatker,debouncedSearchStatusSatker, debouncedSearchNamaMahasiswa, debouncedSearchProdi, debouncedSearchPenempatan, debouncedSearchStatusMahasiswa])

    useEffect(() => {
        // setLoading(true);
      if (dataDropdownSatker?.length) { 
        fetchListPenempatan(pageSatker, pageMahasiswa);
      }
    }, [pageMahasiswa, pageSizeMahasiswa, pageSatker, pageSizeSatker]);    

    return (
        <>
            <Text c="dimmed" mb="md">Penempatan Magang Mahasiswa</Text>

            {!aksesEdit && (
                <Alert icon={<IconInfoCircle size={16} />} color="blue" title="Info Akses">
                    Saat ini admin provinsi hanya dapat melihat penempatan sementara mahasiswa, admin provinsi dapat mengedit penempatan saat admin memberikan akses.
                </Alert>
            )}

            <Stack style={{ marginTop: "15px", marginBottom: "10px" }}>
                <Tabs defaultValue="satker" variant='outline'>
                    <Tabs.List>
                      <Tabs.Tab value="satker" >
                        <IconBuildingBank size={12} style={{ marginRight: 8 }} /> Satuan Kerja
                      </Tabs.Tab>
                      <Tabs.Tab value="mahasiswa" >
                        <IconUser size={12} style={{ marginRight: 8 }} /> Mahasiswa
                      </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="satker">
                        <Group grow style={{ marginTop: "10px", marginBottom: "10px", width:"300px"  }}>
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
                        <DataTable
                            fetching={loading}
                            highlightOnHover
                            withTableBorder
                            // withColumnBorders
                            records={satkerData}
                            key={"index"}
                            style={{ minHeight: satkerData.length > 0 ? '0' : '180px' }}  
                            pinLastColumn
                            totalRecords={totalSatker}
                            recordsPerPage={pageSizeSatker}
                            page={pageSatker}
                            onPageChange={setPageSatker}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSizeSatker}
                            columns={[
                                {
                                    accessor: 'no',
                                    title: 'No',
                                    textAlign: 'center',
                                    width: 45,
                                    render: (_, index) => (pageSatker - 1) * pageSizeSatker + (index + 1),
                                },
                                {
                                    accessor: "nama",
                                    title: "SatKer",
                                },
                                {
                                    accessor: "kodeSatker",
                                    title: "Kode Satker",
                                },
                                {
                                    accessor: "provinsi.nama",
                                    title: "Provinsi",
                                },
                                {
                                    accessor: "kapasitasSatkerTahunAjaran",
                                    title: "Kapasitas",
                                },
                                {
                                    accessor: "dialokasikan",
                                    title: "Dialokasikan",
                                },
                                {
                                    accessor: "status",
                                    title: "Status",
                                    // textAlign : "center",
                                    render: (record : Satker) => (
                                        <Badge
                                            color={
                                                record.status == "Tersedia"
                                                    ? "green"
                                                : record.status== "Melebihi"
                                                    ? "red"
                                                : record.status == "Terpenuhi"
                                                    ? "grey"
                                                : "gray"
                                            }
                                        >
                                            {record.status}
                                        </Badge>
                                    ),  
                                },
                            ]}
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
                            placeholder="Cari Prodi"
                            data={[
                                { value: 'DIII ST', label: 'DIII ST' },
                                { value: 'DIV ST', label: 'DIV ST' },
                                { value: 'DIV KS', label: 'DIV KS' },
                            ]}
                            value={searchProdi}
                            onChange={(value) => setSearchProdi(value || '')}
                            clearable
                            searchable
                            leftSection={<IconSearch size={16} />}
                        />   
                        <Select
                            placeholder="Cari Penempatan"
                            searchable
                            clearable
                            value={searchPenempatan}
                            onChange={(val) => setSearchPenempatan(val || '')}
                            data={dataDropdownSatker}
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
                            aksesEdit={aksesEdit}
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