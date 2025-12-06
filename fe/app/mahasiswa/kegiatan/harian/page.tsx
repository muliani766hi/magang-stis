'use client'

import { Button, Group, Text, Box, Stack, TextInput, Textarea, NumberInput, Modal, Autocomplete, ActionIcon, Select } from "@mantine/core";
import TableKegiatanHarian, {
  RecordKegiatanHarian,
} from "@/components/Table/TableKegiatanHarian/TableKegiatanHarian";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react";
import { modals } from "@mantine/modals";
import { cookies } from "next/headers";
import { deleteTipeKegiatan, getKegiatanHarian, getNamaKegiatan, postKegiatanHarian, postTipeKegiatan } from "@/utils/kegiatan-harian";
import { postKegiatanBulanan } from "@/utils/kegiatan-bulanan";

const Harian = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [dataNamaKegiatan, setDataNamaKegiatan] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const submitButtonRef = useRef(null);
  const [loadingButton, setLoadingButton] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  async function deleteKegiatan(value: string) {

    let tipeKegiatanId;
    const response = await getNamaKegiatan();
    if (response && response.data) {
      const item = (response.data as any).find((item: any) => item.nama === value);
      if (item) {
        tipeKegiatanId = item.tipeKegiatanId;
      }
    }

    await deleteTipeKegiatan(tipeKegiatanId);

    setDataNamaKegiatan((prevData: any[]) => prevData.filter(item => item.value !== value));
  }

  const fetchData = async (currentPage = page) => {
    try {
      setLoading(true)
      if(!dataNamaKegiatan.length){
        const namaKegiatan = await getNamaKegiatan();
        setDataNamaKegiatan((namaKegiatan.data as any).map((item: any) => item.nama));
      }
      
      const res = await getKegiatanHarian({
        page: currentPage,
        pageSize,
      });
      const recordsWithId = res.data.map((record: { kegiatanId: any; }, index: any) => ({
        ...record,
        id: record.kegiatanId || index,
      }));

      setData(recordsWithId);
      setTotal(res.totalRecord);
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [page, pageSize]);

  const form = useForm<RecordKegiatanHarian>({
    initialValues: {
      tanggal: "",
      nama: "",
      deskripsi: "",
      volume: null,
      satuan: "",
      durasi: null,
      pemberiTugas: "",
      tim: "",
      statusPenyelesaian: null,
      tipeKegiatanId: 0,
      isFinal: false,
    },

    validate: {
      tanggal: (value) =>
        value !== "" ? null : "Tanggal kegiatan harus diisi",
      nama: (value) =>
        value !== "" ? null : "Nama tipe kegiatan harus diisi",

      deskripsi: (value) =>
        value !== "" ? null : "Deskripsi kegiatan harus diisi",
      volume: (value) =>
        value !== null && !isNaN(value) ? null : "Volume harus diisi",
      satuan: (value) =>
        value !== "" ? null : "Satuan harus diisi",
      durasi: (value) => {
        if (value === null || isNaN(value)) {
          return "Durasi harus diisi";
        }
        if (value < 0) {
          return "Durasi tidak boleh negatif";
        }
        if (value > 14) {
          return "Durasi tidak boleh lebih dari 14 jam";
        }
      },

      pemberiTugas: (value) =>
        value !== "" ? null : "Pemberi tugas harus diisi",
      statusPenyelesaian: (value) =>
        value !== null && !isNaN(value) ? null : "Status penyelesaian harus diisi",
    }
  });

  return (
    <>
      <Text c="dimmed" mb="md">Kegiatan Harian</Text>
      <Group mb={10}>
        <Button leftSection={<IconPlus size={14} />}
          onClick={
            open
          }>
          Tambah
        </Button>
      </Group>

      <TableKegiatanHarian 
        records={data} 
        isLoading={loading} 
        fetchData={fetchData} 
        page={page}
        pageSize={pageSize}
        totalRecords={total}
        setPage={setPage}
        setPageSize={setPageSize}
      />

      <Modal
        size="xl"
        opened={opened}
        onClose={close}
        closeOnClickOutside={false}
        title={<Text size="xl">Tambah Kegiatan</Text>}
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >


        <form onSubmit={form.onSubmit(async (values) => {
          setLoadingButton(true);
          try {
            let tipeKegiatanId;
            if (!dataNamaKegiatan.includes(values.nama)) {
              const response = await postTipeKegiatan(values.nama, values.satuan);
              if (response && response.data) {
                tipeKegiatanId = response.data.tipeKegiatanId;
              }
            } else {
              const response = await getNamaKegiatan();
              if (response && response.data) {
                const item = (response.data as any).find((item: any) => item.nama === values.nama);
                if (item) {
                  tipeKegiatanId = item.tipeKegiatanId;
                }
              }
            }

            await postKegiatanHarian(values, tipeKegiatanId);
            const namaKegiatan2 = await getNamaKegiatan();
            setDataNamaKegiatan((namaKegiatan2.data as any).map((item: any) => item.nama));

            notifications.show({
              title: 'Berhasil',
              message: 'Kegiatan harian berhasil ditambahkan',
              color: 'blue',
            });

            setLoading(true);
            close();
            form.reset();
          } catch (error) {
            console.log(error);
            notifications.show({
              title: 'Gagal',
              message: 'Kegiatan harian gagal ditambahkan',
              color: 'red',
            });
          } finally {
            fetchData();
            setLoadingButton(false);
          }
        })}>
          <Stack gap="md">
            <DateInput label="Tanggal"
              description="Tanggal kegiatan"
              valueFormat='DD-MM-YYYY'
              // placeholder="Pilih tanggal kegiatan"
              {...form.getInputProps("tanggal")} />
            <Autocomplete
              label="Nama Kegiatan"
              description="Masukkan nama kegiatan atau pilih yang sudah ada"
              // placeholder="Pilih nama tipe kegiatan"
              {...form.getInputProps("nama")}
              data={dataNamaKegiatan}
              renderOption={({ option }: { option: any }) => (
                <Group justify="space-between" w={"100%"}>
                  <Text lineClamp={1} size="sm">
                    {option.label}
                  </Text>

                  {/* <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the click from selecting the option
                      deleteKegiatan(option.label);

                      // refresh  data
                      fetchData();
                    }}>
                    <IconX size={14} />
                  </ActionIcon> */}
                </Group>
              )}
            />
            <Textarea
              label="Deskripsi"
              description="Deskripsi kegiatan yang dilakukan"
              // placeholder="Masukkan deskripsi kegiatan"
              {...form.getInputProps("deskripsi")} />
            <NumberInput
              label="Volume"
              description="Volume dalam angka"
              min={0}
              allowDecimal={false}
              key="volume"
              clampBehavior="strict"
              stepHoldDelay={500}
              stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
              // placeholder="Masukkan volume"
              {...form.getInputProps("volume")} />
            <TextInput
              label="Satuan"
              description="Satuan dari volume (contoh: box, dokumen, buku)"
              // placeholder="Masukkan satuan"
              {...form.getInputProps("satuan")} />
            {/* <TextInput
              label="Durasi"
              description="Durasi kegiatan (contoh: 30 menit, 1 jam)"
              // placeholder="Masukkan durasi"
              {...form.getInputProps("durasi")} /> */}
            <NumberInput
              label="Durasi"
              description="Durasi kegiatan dalam jam"
              min={0}
              decimalSeparator=","
              clampBehavior="blur"
              stepHoldDelay={500}
              stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
              // placeholder="Masukkan durasi"
              {...form.getInputProps("durasi")} />
            <TextInput
              label="Pemberi Tugas"
              description="Pemberi tugas kegiatan"
              // placeholder="Masukkan pemberi tugas"
              {...form.getInputProps("pemberiTugas")} />
            <Select
              label="Tim Kerja"
              description="Pilih tim kerja yang terkait dengan kegiatan"
              placeholder="Pilih tim kerja"
              data={[
                { value: "Tim Kerja Sub Bagian Umum", label: "Tim Kerja Sub Bagian Umum" },
                { value: "Tim Kerja Statistik Distribusi dan Harga", label: "Tim Kerja Statistik Distribusi dan Harga" },
                { value: "Tim Kerja Keuangan Teknologi Informasi dan Pariwisata", label: "Tim Kerja Keuangan Teknologi Informasi dan Pariwisata" },
                { value: "Tim Kerja Statistik Produksi", label: "Tim Kerja Statistik Produksi" },
                { value: "Tim Kerja Statistik Sosial", label: "Tim Kerja Statistik Sosial" },
                { value: "Tim Pengolahan dan TI", label: "Tim Pengolahan dan TI" },
                { value: "Tim Diseminasi Statistik", label: "Tim Diseminasi Statistik" },
                { value: "Tim Pembinaan Statistik Sektoral", label: "Tim Pembinaan Statistik Sektoral" },
                { value: "Tim Kerja Neraca Wilayah dan Analisis Statistik", label: "Tim Kerja Neraca Wilayah dan Analisis Statistik" },
                { value: "Tim Kerja ZI/RB", label: "Tim Kerja ZI/RB" },
                { value: "Tim SAKIP", label: "Tim SAKIP" },
                { value: "Unit Pendukung PPID", label: "Unit Pendukung PPID" },
                { value: "Tim Pengendalian Gratifikasi", label: "Tim Pengendalian Gratifikasi" },
                { value: "Tim Pelaksana SPIP", label: "Tim Pelaksana SPIP" },
                { value: "Tim Penanganan Pengaduan Masyarakat dan Whistleblowingsystem (WBS)", label: "Tim Penanganan Pengaduan Masyarakat dan Whistleblowingsystem (WBS)" },
                { value: "Lainnya", label: "Lainnya" },
              ]}
              searchable
              {...form.getInputProps("tim")}
            />
            <NumberInput
              label="Status Penyelesaian"
              description="Status penyelesaian kegiatan dalam persen"
              min={0}
              max={100}
              clampBehavior="strict"
              stepHoldDelay={500}
              stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
              // placeholder="Masukkan status penyelesaian"
              {...form.getInputProps("statusPenyelesaian")} />

            <Group justify="right">
              <Button
                type="submit"
                ref={submitButtonRef}
                style={{ display: 'none' }} // Hide the button
                color="blue"
                variant="light">Simpan</Button>
              <Button
                onClick={() => {
                  modals.openConfirmModal({
                    title: 'Batal Penambahan Kegiatan',
                    centered: true,
                    children: (
                      <Text size="sm">
                        Apakah anda yakin ingin membatalkan penambahan kegiatan ini?
                      </Text>
                    ),
                    labels: { confirm: 'Ya', cancel: 'Tidak' },
                    cancelProps: { variant: 'light', color: 'gray' },
                    confirmProps: { variant: 'light', color: 'red' },
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {
                      form.reset();
                      close();
                    }
                  });
                }}
                color="red" variant="light">Batal</Button>
              <Button
                loading={loadingButton}

                type="button"
                onClick={() => {
                  modals.openConfirmModal({
                    // title: 'Simpan Kegiatan',
                    centered: true,
                    children: (
                      <Text size="sm">
                        Apakah anda yakin ingin menyimpan kegiatan ini?
                      </Text>
                    ),
                    labels: { confirm: 'Ya', cancel: 'Tidak' },
                    cancelProps: { variant: 'light', color: 'gray' },
                    confirmProps: { variant: 'light', color: 'blue' },
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {
                      if (submitButtonRef.current) {
                        (submitButtonRef.current as any).click();
                      }
                    }
                  });
                }}
                color="blue"
                variant="light">Simpan</Button>
            </Group>

          </Stack>
        </form>

      </Modal >
    </>
  );
};


export default Harian;
