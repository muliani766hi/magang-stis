'use client'

import { Button, Group, Text, Box, Stack, TextInput, Textarea, NumberInput, Modal } from "@mantine/core";
import TableKegiatanHarian, {
  RecordKegiatanHarian,
} from "@/components/Table/TableKegiatanHarian/TableKegiatanHarian";
import { IconPlus } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import TableKegiatanHarianNested, { RecordKegiatanHarianNested } from "@/components/Table/TableKegiatanHarian/TableKegiatanHarianNestedForDosen";
import { useEffect, useState } from "react";
import { getAllMahasiswa } from "@/utils/kelola-user/mahasiswa";
import { getKegiatanHarian } from "@/utils/kegiatan-harian";

const Harian = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [dataKegiatanHarian, setDataKegiatanHarian] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
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
    fetchData()
  }, [])


  return (
    <>
      <Text c="dimmed" mb="md">Kegiatan Harian</Text>
      {/* <Group justify="flex-end" mb={10}>
        <Button leftSection={<IconPlus size={14} />}
          onClick={
            open
          }>
          Tambah
        </Button>
      </Group> */}

      <TableKegiatanHarianNested records={data} dataKegiatanHarian={dataKegiatanHarian} loading={loading} />


    </>
  );
};


export default Harian;
