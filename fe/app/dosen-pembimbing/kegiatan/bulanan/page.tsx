'use client';

import {
  Text,
  SimpleGrid,
  Select,
} from "@mantine/core";
import TableKegiatanBulananNested from "@/components/Table/TableKegiatanBulanan/TableKegiatanBulananNestedForDosen";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getAllMahasiswa } from "@/utils/kelola-user/mahasiswa";
import { getKegiatanBulanan2, getPeriodeKegiatanBulanan } from "@/utils/kegiatan-bulanan";

type PeriodeType = {
  value: string;
  label: string;
  tanggalAwal: string;
  tanggalAkhir: string;
};

const Bulanan = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState<any[]>([]);
  const [dataKegiatanBulanan, setDataKegiatanBulanan] = useState<any[]>([]);
  const [dataFiltered, setDataFiltered] = useState<any[]>([]);
  const [periode, setPeriode] = useState<PeriodeType[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<PeriodeType | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch awal: Mahasiswa + Periode
  useEffect(() => {
    const fetchInitial = async () => {
      const responseMahasiswa = await getAllMahasiswa();
      const responsePeriode = await getPeriodeKegiatanBulanan();

      const modifiedData = responseMahasiswa.data.map((item: { mahasiswaId: any }) => ({
        ...item,
        id: item.mahasiswaId,
      }));

      const listPeriode: PeriodeType[] = responsePeriode?.data.map((item: any) => ({
        value: item.tanggalAwal,
        label: new Date(item.tanggalAwal).toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        }),
        tanggalAwal: item.tanggalAwal,
        tanggalAkhir: item.tanggalAkhir,
      }));

      setData(modifiedData);
      setPeriode(listPeriode);

      if (listPeriode.length > 0) {
        setSelectedPeriode(listPeriode[0]);
      }
    };

    fetchInitial();
  }, []);

  // Fetch Kegiatan berdasarkan Periode
  useEffect(() => {
    const fetchKegiatan = async () => {
      if (!selectedPeriode) return;

      setLoading(true);
      const response = await getKegiatanBulanan2({
        tanggalAwal: selectedPeriode.tanggalAwal,
        tanggalAkhir: selectedPeriode.tanggalAkhir,
      });

      const modifiedData2 = response.data.map((item: { rekapId: any }) => ({
        ...item,
        id: item.rekapId,
      }));

      setDataKegiatanBulanan(modifiedData2);
      setDataFiltered(modifiedData2);
      setLoading(false);
    };

    fetchKegiatan();
  }, [selectedPeriode]);

  return (
    <>
      <Text c="dimmed" mb="md">Kegiatan Bulanan</Text>

      <SimpleGrid cols={{ base: 2, md: 3, xl: 4 }} mb="md">
        <Select
          size="xs"
          placeholder="Pilih Periode"
          description="Periode"
          data={periode}
          value={selectedPeriode?.value || ""}
          onChange={(value) => {
            const selected = periode.find((item) => item.value === value);
            if (selected) {
              setSelectedPeriode(selected);
            }
          }}
          allowDeselect={false}
        />
      </SimpleGrid>

      <TableKegiatanBulananNested
        records={data}
        dataKegiatanBulanan={dataFiltered}
        loading={loading}
        fetchData={() => {}}
        periode={selectedPeriode?.label || ""}
      />
    </>
  );
};

export default Bulanan;
