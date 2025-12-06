'use client';

import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { DataTable } from "mantine-datatable";
import { getProvinsi } from "@/utils/provinsi";
import { getUnitKerjaByProvinsi } from '@/utils/unit-kerja'
import { TextInput, Text, Group, Stack, Select, SimpleGrid, Button} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { postPilihPenempatan, getPenempatanById } from '@/utils/unit-kerja';
import { getListPemilihanPenempatan } from '@/utils/pemilihan-tempat'
import {  IconMapPin } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { modals } from "@mantine/modals";

const PAGE_SIZES = [5, 10, 15, 20];

type Satker = {
  satkerId: string;
  nama: string;
};

type FormData = {
  provinsi: string;
  pilihan: string[];
};

type SatketOption = {
  option1: { satkerId: string, nama: string }[],
  option2: { satkerId: string, nama: string }[]
}

type ProvinsiOption = {
  option1: { kodeProvinsi: string, nama: string }[],
  option2: { kodeProvinsi: string, nama: string }[]
};

const PenempatanMagang = () => {

  const [loading, setLoading] = useState(true);

  const form = useForm<FormData>({
    initialValues: {
      provinsi: '',
      pilihan: [],
    },
  });

  const [satkerOptions, setSatkerOptions] = useState<SatketOption>({
    option1: [],
    option2: []
  })

  const [selectSatkerOption, setSelectSatkerOption] = useState<{
    option1: string,
    option2: string
  }>({
    option1: '',
    option2: ''
  })

  const [optionMagang, setOptionMagang] = useState({
    option1: [
      {
        value: 'bps_daerah',
        label: 'BPS Provinsi/Kabupaten/Kota'
      },
      {
        value: 'bps_pusat',
        label: 'BPS Pusat'
      },
      {
        value: 'lembaga_lain',
        label: 'Kementrian Lembaga lain'
      },
    ],
    option2: [
      {
        value: 'bps_daerah',
        label: 'BPS Provinsi/Kabupaten/Kota'
      },
      {
        value: 'bps_pusat',
        label: 'BPS Pusat'
      },
      {
        value: 'lembaga_lain',
        label: 'Kementrian Lembaga lain'
      },
    ],
  })

  const [selectOptionMagang, setSelectOptionMagang] = useState<{
    option1: string,
    option2: string
  }>({
    option1: '',
    option2: ''
  })

  const [provinsiOptions, setProvinsiOptions] = useState<ProvinsiOption>({
    option1: [],
    option2: []
  })

  const [selectOptionProvinsi, setSelectOptionProvinsi] = useState<{
    option1: string,
    option2: string
  }>({
    option1: '',
    option2: ''
  })

  const [selectedSatker, setSelectedSatker] = useState<{
    option1: string,
    option2: string
  }>({
    option1: '',
    option2: ''
  })

  const [selectedData, setSelectedData] = useState<Satker[]>([]);
  const [searchSatker, setSearchSatker] = useState('');
  const [debouncedSearchSatker] = useDebouncedValue(searchSatker, 300); // Debounced search
  const [dataDropdownProvinsi, setDataDropdownProvinsi] = useState<{ value: string; label: string }[]>([]);
  const [dataDropdownSatker, setDataDropdownSatker] = useState([]);

  const [searchProvinsiSatker, setSearchProvinsiSatker] = useState('');
  const [debouncedSearchProvinsiSatker] = useDebouncedValue(searchProvinsiSatker, 300);
  
  const [pageSatker, setPageSatker] = useState(1)
  const [pageSizeSatker, setPageSizeSatker] = useState(5)
  const [totalSatker, setTotalSatker] = useState(0)

  const fetchDataSatker = async (args: { id?: string, internalBPS?: boolean, option?: number }) => {
    setLoading(true)
    const resultSatker = await getUnitKerjaByProvinsi(args?.id, args?.internalBPS);
    if (args.option === 1) {
      setSatkerOptions((prev) => ({
        ...prev,
        option1: resultSatker.data
      }));
    } else if (args.option === 2) {
      setSatkerOptions((prev) => ({
        ...prev,
        option2: resultSatker.data
      }));
    } else {
      setSatkerOptions((prev) => ({
        ...prev,
        option2: resultSatker.data
      }));
    }
    setLoading(false)
  }

  const handleSelectOptionMagang = (optionValue: string) => {
    switch (optionValue) {
      case "bps_daerah":
        console.log('masuk sini')
        if (selectOptionProvinsi.option1) fetchDataSatker({ id: selectOptionProvinsi.option1, internalBPS: true, option: 1 })
        if (selectOptionProvinsi.option2) fetchDataSatker({ id: selectOptionProvinsi.option2, internalBPS: true, option: 2 })
        break;
      case "bps_pusat":
        fetchDataSatker({ id: "00" })
        break;
      case "lembaga_lain":
        fetchDataSatker({ internalBPS: false });
        break;
    }
  }

  const fetchDataProvinsi = async () => {
    const provinsiData = await getProvinsi();
    setProvinsiOptions(() => ({
      option1: provinsiData.data ?? [],
      option2: provinsiData.data ?? [],
    }));
    setLoading(false)
  }

  useEffect(() => {
    fetchDataProvinsi()
  }, [])

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

  const [isSubmit, setIsSubmit] = useState(false)

  const fetchDataPenempatan = async () => {
    setLoading(true)
    const resultPenempatan = await getPenempatanById()
    // console.log(resultPenempatan?.data)
    if (resultPenempatan?.data.isSubmit) {
      setSelectedSatker((prev) => ({
        ...prev,
        option1: resultPenempatan?.data?.pilihanSatker[0]?.satker.nama ?? ''
      }));
      setSelectedSatker((prev) => ({
        ...prev,
        option2: resultPenempatan?.data?.pilihanSatker[1]?.satker.nama ?? ''
      }));
      setIsSubmit(resultPenempatan?.data?.isSubmit)
      // setSelectedData(resultPenempatan?.data.satker)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDataPenempatan()
  }, [])

  const fetchListPenempatan = async (currentPageSatker = pageSatker) => {
    setLoading(true)
    const result = await getListPemilihanPenempatan({
      searchSatker: debouncedSearchSatker,
      searchProvinsiSatker: debouncedSearchProvinsiSatker,
      pageSatker: currentPageSatker,
      pageSizeSatker,
    })
    setSelectedData(result.data?.satker)
    setTotalSatker(result.data?.totalSatker)
    setLoading(false)
  }

  useEffect(() => {
    setPageSatker(1);
      fetchListPenempatan()
  }, [debouncedSearchSatker, debouncedSearchProvinsiSatker])

  useEffect(() => {
    // setLoading(true);
    fetchListPenempatan(pageSatker);
  }, [pageSatker, pageSizeSatker]);

  useEffect(() => {
    if (selectOptionMagang.option1) handleSelectOptionMagang(selectOptionMagang.option1)
    if (selectOptionMagang.option2) handleSelectOptionMagang(selectOptionMagang.option2)
    fetchListPenempatan()
  }, [selectOptionMagang.option1, selectOptionMagang.option2, selectOptionProvinsi.option1, selectOptionProvinsi.option2])

  const handleSubmit = async () => {
    const pilihan = [];
  
    if (selectSatkerOption.option1) {
      pilihan.push(selectSatkerOption.option1);
    }
  
    if (selectSatkerOption.option2) {
      pilihan.push(selectSatkerOption.option2);
    }
  
    const payload = {
      pilihan: pilihan.map((id) => String(id))
    };
  
    const res = await postPilihPenempatan(payload);
  
    notifications.show({ title: res.status, message: res.message });
    fetchDataPenempatan();
  };  

  return (
    <>
      <Text size="xl" mb={10}>
        Pemilihan Tempat Magang
      </Text>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" pos="relative">
        <Stack>
          {
            selectedSatker.option1 &&
            <TextInput label="Tempat Magang Pilihan 1" readOnly value={selectedSatker.option2} />
          }
          {!selectOptionMagang.option1 && !selectedSatker.option1 &&
            <Select
              allowDeselect={false}
              label="Tempat Magang Pilihan 1"
              required
              placeholder="Pilih salah satu"
              data={optionMagang.option1.map(satker => ({ value: satker.value, label: satker.label }))}
              value={selectOptionMagang.option1}
              onChange={(value) => {
                setSelectOptionMagang((prev) => ({
                  ...prev,
                  option1: value ?? ''
                }));
              }}
            />
          }

          {
            selectOptionMagang.option1 === 'bps_daerah' && !selectedSatker.option1 &&
            <Stack justify="flex-start">
              <Select
                allowDeselect={false}
                label="Provinsi Pilihan 1"
                required
                placeholder="Pilih provinsi tempat magang"
                data={provinsiOptions.option1.map(prov => ({ value: prov.kodeProvinsi, label: prov.nama }))}
                value={selectOptionProvinsi.option1 || form.values.provinsi}
                onChange={(value) => {
                  setSelectOptionProvinsi((prev) => ({
                    ...prev,
                    option1: value ?? ''
                  }));
                }}
              />
              <Select
                allowDeselect={false}
                label="Satuan Kerja Pilihan 1"
                required
                placeholder="Pilih satuan kerja"
                data={satkerOptions.option1.map(satker => ({ value: String(satker.satkerId), label: satker.nama }))}
                value={selectSatkerOption.option1}
                onChange={(value) => {
                  setSelectSatkerOption((prev) => ({
                    ...prev,
                    option1: value ?? ''
                  }));
                }}
              />
            </Stack>
          }
          {
            selectOptionMagang.option1 === 'bps_pusat' && !selectedSatker.option1 &&
            <Select
              allowDeselect={false}
              label="Direktorat Pilihan 1"
              required
              placeholder="Pilih directorat tempat magang di BPS Pusat"
              data={satkerOptions.option1.map(satker => ({ value: String(satker.satkerId), label: satker.nama }))}
              value={selectSatkerOption.option1}
              onChange={(value) => {
                setSelectSatkerOption((prev) => ({
                  ...prev,
                  option1: value ?? ''
                }));
              }}
            />
          }
          {
            selectOptionMagang.option1 === 'lembaga_lain' && !selectedSatker.option1 &&
            <Select
              allowDeselect={false}
              label="Kementrian atau Lembaga lain pilihan 1"
              required
              placeholder="Pilih kementrian atau lembaga lain sebagai tempat magang"
              data={satkerOptions.option1.map(satker => ({ value: String(satker.satkerId), label: satker.nama }))}
              value={selectSatkerOption.option1}
              onChange={(value) => {
                setSelectSatkerOption((prev) => ({
                  ...prev,
                  option1: value ?? ''
                }));
              }}
            />
          }
        </Stack>
        <Stack>
          {
            selectedSatker.option2 &&
            <TextInput label="Tempat Magang Pilihan 2" readOnly value={selectedSatker.option1} />
          }
          {!selectOptionMagang.option2 && !selectedSatker.option2 &&
            <Select
              allowDeselect={false}
              label="Tempat Magang Pilihan 2"
              required
              placeholder="Pilih salah satu"
              data={optionMagang.option2.map(satker => ({ value: satker.value, label: satker.label }))}
              value={selectOptionMagang.option2}
              onChange={(value) => {
                setSelectOptionMagang((prev) => ({
                  ...prev,
                  option2: value ?? ''
                }));
              }}
            />
          }
          {
            selectOptionMagang.option2 === 'bps_daerah' && !selectedSatker.option2 &&
            <Stack justify="flex-start">
              <Select
                allowDeselect={false}
                label="Provinsi Pilihan 2"
                required
                placeholder="Pilih provinsi tempat magang"
                data={provinsiOptions.option2.map(prov => ({ value: prov.kodeProvinsi, label: prov.nama }))}
                value={selectOptionProvinsi.option2 || form.values.provinsi}
                onChange={(value) => {
                  setSelectOptionProvinsi((prev) => ({
                    ...prev,
                    option2: value ?? ''
                  }));
                }}
              />
              <Select
                allowDeselect={false}
                label="Satuan Kerja Pilihan 2"
                required
                placeholder="Pilih satuan kerja"
                data={satkerOptions.option2.map(satker => ({ value: String(satker.satkerId), label: satker.nama }))}
                value={selectSatkerOption.option2}
                onChange={(value) => {
                  setSelectSatkerOption((prev) => ({
                    ...prev,
                    option2: value ?? ''
                  }));
                }}
              />
            </Stack>
          }
          {
            selectOptionMagang.option2 === 'bps_pusat' && !selectedSatker.option2 &&
            <Select
              allowDeselect={false}
              label="Direktorat Pilihan 2"
              required
              placeholder="Pilih directorat tempat magang di BPS Pusat"
              data={satkerOptions.option2.map(satker => ({ value: String(satker.satkerId), label: satker.nama }))}
              value={selectSatkerOption.option2}
              onChange={(value) => {
                setSelectSatkerOption((prev) => ({
                  ...prev,
                  option2: value ?? ''
                }));
              }}
            />
          }
          {
            selectOptionMagang.option2 === 'lembaga_lain' && !selectedSatker.option2 &&
            <Select
              allowDeselect={false}
              label="Kementrian atau Lembaga lain pilihan 2"
              required
              placeholder="Pilih kementrian atau lembaga lain sebagai tempat magang"
              data={satkerOptions.option2.map(satker => ({ value: String(satker.satkerId), label: satker.nama }))}
              value={selectSatkerOption.option2}
              onChange={(value) => {
                setSelectSatkerOption((prev) => ({
                  ...prev,
                  option2: value ?? ''
                }));
              }}
            />
          }
          <Group justify="flex-end" style={{ marginTop: "10px" }}> 
            <Button
              variant="light"
              type="button"
              onClick={() => {
                modals.openConfirmModal({
                  title: 'Konfirmasi Penempatan',
                  centered: true,
                  children: (
                    <p>Pilihan penempatan tidak dapat diubah setelah dikirim <br></br> Apakah Anda yakin memilih penempatan ini?</p>
                  ),
                  labels: { confirm: 'Kirim', cancel: 'Batal' },
                  confirmProps: { color: 'blue' },
                  onConfirm: () => handleSubmit(),
                });
              }}
              disabled={isSubmit}
              loading={loading}
            >
              {isSubmit ? 'Anda telah memilih' : 'Submit'}
            </Button>
          </Group>
        </Stack>


      </SimpleGrid>
      <Stack style={{ marginTop: "30px", marginBottom: "10px" }}>
        <Text size="l" >
          Rekapitulasi Sementara Jumlah Pemilih Setiap Satuan Kerja
        </Text>
      </Stack>
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
      <DataTable
        fetching={loading}
        highlightOnHover
        withTableBorder
        borderRadius="sm"
        withColumnBorders
        records={selectedData}
        columns={[
          {
            accessor: "nama",
            title: "Satuan Kerja",
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
            accessor: "pilihan1",
            title: "Jumlah pilihan 1",
          },
          {
            accessor: "pilihan2",
            title: "Jumlah pilihan 2",
          },
        ]}
        key={"index"}
        totalRecords={totalSatker}
        recordsPerPage={pageSizeSatker}
        page={pageSatker}
        onPageChange={setPageSatker}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={setPageSizeSatker}
      />
    </>
  )
}

export default PenempatanMagang