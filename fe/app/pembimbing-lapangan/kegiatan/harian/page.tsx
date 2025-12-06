'use client'

import { Text} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import TableKegiatanHarianNested, { RecordKegiatanHarianNested } from "@/components/Table/TableKegiatanHarian/TableKegiatanHarianNested";
import { useEffect, useState } from "react";
import { getAllMahasiswa } from "@/utils/kelola-user/mahasiswa";
import { getKegiatanHarian } from "@/utils/kegiatan-harian";

const Harian = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [dataKegiatanHarian, setDataKegiatanHarian] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    // console.log("fetchData dipanggil");
    try {
      const response = await getAllMahasiswa()
      const response2 = await getKegiatanHarian()

      let modifiedData = response.data.map((item: { mahasiswaId: any; }) => ({
        ...item,
        id: item.mahasiswaId,  // Add the `id` field using `mahasiswaId`
      }))

      let modifiedData2 = response2.data.map((item: { kegiatanId: any; }) => ({
        ...item,
        id: item.kegiatanId,  // Add the `id` field using `kegiatanHarianId`
      }))

      setData(modifiedData)
      setDataKegiatanHarian(modifiedData2)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch data", error)
    }
  }

  useEffect(() => {
    // console.log("useEffect dipanggil");
    fetchData(); 
  }, []); 
  


  return (
    <>
      <Text c="dimmed" mb="md">Kegiatan Harian</Text>
      <TableKegiatanHarianNested fetchData={fetchData} records={data} dataKegiatanHarian={dataKegiatanHarian} loading={loading}  />
    </>
  );
};


export default Harian;
