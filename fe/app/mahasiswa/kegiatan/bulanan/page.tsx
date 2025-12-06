'use client'

import { Text, Select, SimpleGrid } from "@mantine/core";
import TableKegiatanBulanan, {
  RecordKegiatanBulanan,
} from "@/components/Table/TableKegiatanBulanan/TableKegiatanBulanan";
import React, { useEffect, useState } from "react";
import { getKegiatanBulanan2, getPeriodeKegiatanBulanan } from "@/utils/kegiatan-bulanan";

const Bulanan = () => {
  const [dataFiltered, setDataFiltered] = useState<RecordKegiatanBulanan[]>([]);
  const [periode, setPeriode] = useState<
    { value: string; label: string; tanggalAwal: string; tanggalAkhir: string }[]
  >([]);
  const [selectedPeriode, setSelectedPeriode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchData = async (tanggalAwal: string, tanggalAkhir: string, currentPage = page) => {
    setLoading(true);

    const response = await getKegiatanBulanan2({ tanggalAwal, tanggalAkhir, 
      // page: currentPage, pageSize 
    });

    const formatted = response.data?.[0]?.RekapKegiatanBulananTipeKegiatan?.map((item: any) => ({
      ...item,
      id: item.rekapTipeId,
    })) || [];

    setDataFiltered(formatted);
    setTotal(response.total)
    setLoading(false);
  };

  useEffect(() => {
    const fetchPeriode = async () => {
      const response = await getPeriodeKegiatanBulanan();
      const list = response.data.map((item: any) => ({
        value: item.tanggalAwal,
        label: item.label,
        tanggalAwal: item.tanggalAwal,
        tanggalAkhir: item.tanggalAkhir,
      }));
      setPeriode(list);

      if (list.length > 0) {
        setSelectedPeriode(list[0].value);
        fetchData(list[0].tanggalAwal, list[0].tanggalAkhir);
      } else {
        setLoading(false);
      }
    };
    
    fetchPeriode();
  }, []);

  useEffect(() => {
    const selected = periode.find(p => p.value === selectedPeriode);
    if (selected) {
      fetchData(selected.tanggalAwal, selected.tanggalAkhir, page);
    }
  }, [selectedPeriode, page, pageSize]);

  return (
    <>
      <Text c="dimmed" mb="md">Kegiatan Bulanan</Text>
      <SimpleGrid cols={{ base: 2, md: 3, xl: 4 }} mb="md">
        <Select
          size="xs"
          placeholder="Pilih Periode"
          data={periode.map(p => ({ value: p.value, label: p.label }))}
          value={selectedPeriode}
          onChange={(value) => value && setSelectedPeriode(value)}
          allowDeselect={false}
        />
      </SimpleGrid>
      <TableKegiatanBulanan
        records={dataFiltered}
        isLoading={loading}
        fetchData={() => {
          const selected = periode.find(p => p.value === selectedPeriode);
          if (selected) {
            fetchData(selected.tanggalAwal, selected.tanggalAkhir);
          }
        }}
        // page={page}
        // pageSize={pageSize}
        // totalRecords={total}
        // setPage={setPage}
        // setPageSize={setPageSize}
      />
    </>
  );
};

export default Bulanan;
