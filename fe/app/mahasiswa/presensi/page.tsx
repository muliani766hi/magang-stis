'use client'
import React, { useEffect, useRef, useState } from "react";
import Location from "./Location";
import { Button, Card, Divider, Group, Select, FileInput, Stack, Tabs, Text, TextInput } from "@mantine/core";
import TablePresensi, { RecordPresensi } from "@/components/Table/TablePresensi/TablePresensi";
import { getPerizinan, getPresensi, getPresensiManual, postPerizinan } from "@/utils/presensi";
import { getAllMahasiswa } from "@/utils/kelola-user/mahasiswa";
import { getUnitKerjaById } from "@/utils/unit-kerja";
import { IconClockCheck, IconMailCheck, IconFile } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import TablePerizinan from "@/components/Table/TablePresensi/TablePerizinan";
import { getProfile, getToken } from "@/utils/get-profile";
import TablePresensiManual from "@/components/Table/TablePresensi/TablePresensiManual";
import TablePresensiNew from '@/components/Table/TablePresensi/TablePresensiNew'
import { PresensiTable } from '@/components/Table/TablePresensi/TablePresensiNew'

export interface PresensiProps {
  nama?: string | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
}

// const records: RecordPresensi[] = [
//   {
//     presensiId: 1,
//     tanggal: '2022-12-12',
//     waktuDatang: '07:30',
//     waktuPulang: '17:00',
//     status: 'Tepat'
//   },
//   {
//     presensiId: 2,
//     tanggal: '2022-12-13',
//     waktuDatang: '07:30',
//     waktuPulang: '17:00',
//     status: 'Tepat'
//   },
//   {
//     presensiId: 3,
//     tanggal: '2022-12-14',
//     waktuDatang: '07:30',
//     waktuPulang: '17:00',
//     status: 'Tepat'
//   },
//   {
//     presensiId: 4,
//     tanggal: '2022-12-15',
//     waktuDatang: '07:31',
//     waktuPulang: '17:00',
//     status: 'Terlambat'
//   },
// ]

// const data1: PresensiProps =
// {
//   nama: "BPS Kabupaten Bogor",
//   latitude: -6.231176,
//   longitude: 106.867125,
// }

// kos
// latitude: -6.232848,
// longitude: 106.869789


// kampus
// latitude: -6.231176,
// longitude: 106.867125



const Presensi = () => {

  const [records, setRecords] = useState<RecordPresensi[]>([]);
  const [mahasiswaId, setMahasiswaId] = useState()
  const [data, setData] = useState<PresensiProps>({})
  const [dataPerizinan, setDataPerizinan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataPresensiManual, setDataPresensiManual] = useState<any[]>([]);
  const [dataPresensiManualToday, setDataPresensiManualToday] = useState<any[]>([]);

  const [distance, setDistance] = useState<number | null>(null);

  // perizinan form
  const submitButtonRef = useRef(null);
  const formIzin = useForm({
    initialValues: {
      keterangan: '',
      jenisIzin: '',
      tanggal: new Date(),
    },
    validate: {
      keterangan: (value: any) => {
        if (!value) {
          return 'Keterangan tidak boleh kosong';
        }
      },
      jenisIzin: (value: any) => {
        if (!value) {
          return 'Jenis izin tidak boleh kosong';
        }
      },
      tanggal: (value: any) => {
        if (!value) {
          return 'Tanggal tidak boleh kosong';
        }
      }
    }
  });

  const formPresensiManual = useForm({
    initialValues: {
      keterangan: '',
      filePresensi: null,
      tanggal: new Date(),
    },
    validate: {
      keterangan: (value: any) => {
        if (!value) {
          return 'Keterangan tidak boleh kosong';
        }
      },
      tanggal: (value: any) => {
        if (!value) {
          return 'Tanggal tidak boleh kosong';
        }
      }
    }
  });

  const [file, setFile] = useState<File | null>(null);


  // fetch data from server
  const fetchData = async () => {
    // const response = await getPresensi();
    // const profile = await getProfile()
    
    // console.log(profile.data?.mahasiswa?.mahasiswaId)
    // const response2 = await getAllMahasiswa();
    // const response3 = await getUnitKerjaById(response2.data[0].satkerId);
    // const response4 = await getPerizinan();

    const [response, profile, response2, response4] = await Promise.all([
      getPresensi(),
      getProfile(),
      getAllMahasiswa(),
      getPerizinan()
    ]);
    setMahasiswaId(profile.data?.mahasiswa?.mahasiswaId)

    const response3 = await getUnitKerjaById(response2.data[0].satkerId);

    let recordsWithId = response.data.map((record: { presensiId: any; }, index: any) => ({
      ...record,
      id: record.presensiId || index, // use presensiId if available, otherwise use index
    }));

    // sort records by date
    recordsWithId = recordsWithId.sort((a: { tanggal: string; }, b: { tanggal: string; }) => {
      return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
    });

    // console.log(recordsWithId);
    setRecords(recordsWithId);

    const modifiedData = {
      nama: response3.data[0].nama,
      latitude: response3.data[0].latitude,
      longitude: response3.data[0].longitude,
    }

    // console.log(modifiedData);

    setData(modifiedData);

    const modifiedDataPerizinan = response4.data.map((item: { izinId: any; }) => ({
      ...item,
      id: item.izinId,  // Add the `id` field using `perizinanId`
    }));

    setDataPerizinan(modifiedDataPerizinan);
    setLoading(false);
  }

  const fetchDataPresensiManual = async () => {
    try {
      const response = await getPresensiManual();
      let modifiedDataPresensiManual = response.data.map((item: { presensiManualId: any; }) => ({
        ...item,
        id: item.presensiManualId,  // Add the `id` field using `presensiManualId`
      }));

      // sort by date
      modifiedDataPresensiManual.sort((a: { tanggal: string; }, b: { tanggal: string; }) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

      const filteredData = response.data.filter((item: { tanggal: string; }) => new Date(item.tanggal).toLocaleDateString() === new Date().toLocaleDateString());

      console.log(modifiedDataPresensiManual)
      setDataPresensiManual(modifiedDataPresensiManual);
      setDataPresensiManualToday(filteredData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  }


  useEffect(() => {
    fetchData();
    fetchDataPresensiManual();
  }, []);


  return (
    <>
      <Text c="dimmed" mb="md">Presensi</Text>

      <Tabs variant='outline' defaultValue="presensi">
        <Tabs.List>
          <Tabs.Tab value="presensi" leftSection={<IconClockCheck width={15} />}>
            Presensi
          </Tabs.Tab>
          <Tabs.Tab value="presensi_manual" leftSection={<IconClockCheck width={15} />}>
            Presensi Manual
          </Tabs.Tab>
          <Tabs.Tab value="perizinan" leftSection={<IconMailCheck width={15} />}>
            Perizinan
          </Tabs.Tab>

        </Tabs.List>

        <Tabs.Panel value="presensi">
          <Location targetLocation={data} fetchData={fetchData} records={records} loading={loading} />

          <Divider my="md" label={
            <Text size='xs' c={"grey"} fw={700} >
              Daftar Hadir
            </Text>
          } labelPosition='left' size='sm' />
          {mahasiswaId ? (
            <PresensiTable mahasiswaId={mahasiswaId} />
          ) : (
            <Text>Memuat data...</Text>
          )}
          {/* <TablePresensiNew records={records} loading={loading} /> */}
        </Tabs.Panel>
        <Tabs.Panel value="presensi_manual">
          <Card shadow="xs" padding="md" radius="sm" withBorder my="lg">
            <form onSubmit={formPresensiManual.onSubmit(async (values) => {
              console.log('test')
              const token = await getToken();
              // const mahasiswaId = await getMahasiswaId();

              const myHeaders = new Headers();
              myHeaders.append("Authorization", `Bearer ${token}`);

              const formdata = new FormData();
              formdata.append("json", JSON.stringify({
                keterangan: values.keterangan,
                tanggal: values.tanggal.setHours(9)
              }));

              if (file) {
                formdata.append("file", file);
              }

              const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
              };

              console.log(requestOptions)
              try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/presensi-manual`, requestOptions);
                if (!response.ok) {
                  throw new Error(await response.text());
                }
                notifications.show(
                  {
                    title: 'Berhasil',
                    message: 'Presensi Manual berhasil dikirim'
                  }
                )
              } catch (error) {
                notifications.show(
                  {
                    title: 'Berhasil',
                    message: 'Presensi Manual gagal dikirim',
                    color: 'red',
                  }
                )

              } finally {
                fetchData();
              }

            })}>
              <Stack gap="md">
                <Text size='md'>Presensi Manual</Text>

                <DateInput
                  label="Tanggal"
                  valueFormat="DD-MM-YYYY"
                  placeholder="Pilih tanggal"
                  {...formPresensiManual.getInputProps('tanggal')}
                />

                <Select
                  label="Keterangan"
                  placeholder="Pilih jenis keterangan"
                  data={[
                    {
                      value: 'website error',
                      label: 'Website Error'
                    },
                    {
                      value: 'dinas luar',
                      label: 'Dinas Luar'
                    }
                  ]}
                  {...formPresensiManual.getInputProps('keterangan')}
                />
                <FileInput
                  label="Bukti"
                  size='xs'
                  placeholder="Pilih file"
                  value={file}
                  onChange={setFile}
                  // {...formPresensiManual.getInputProps('filePresensi')}
                  description="Bukti dapat berupa jpg, jpeg, png, atau pdf (max 2MB)"
                  leftSection={<IconFile size={16} />}
                />
                <Group justify='right'>
                  <Button
                    type="submit"
                    // ref={submitButtonRef}
                    //style={{ display: 'none' }} // Hide the button
                    variant="light">Simpan</Button>
                  {/* <Button
                    color='blue'
                    variant='light'
                    onClick={() => {
                      modals.openConfirmModal({
                        // title: 'Simpan Kegiatan',
                        centered: true,
                        children: (
                          <Text size="sm">
                            Apakah anda yakin ingin mengirim perizinan ini?
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
                  >Kirim</Button> */}
                </Group>
              </Stack>
            </form>
          </Card>

          <Divider my="md" label={
            <Text size='xs' c={"grey"} fw={700} >
              Daftar Presensi Manual
            </Text>
          } labelPosition='left' size='sm' />

          <TablePresensiManual records={dataPresensiManual} fetchData={fetchDataPresensiManual} />
          {/* <TablePerizinan records={dataPerizinan} loading={loading} fetchData={fetchData} /> */}
        </Tabs.Panel>
        <Tabs.Panel value="perizinan">
          <Card shadow="xs" padding="md" radius="sm" withBorder my="lg">
            <form onSubmit={formIzin.onSubmit(async (values) => {
              try {
                const response = await postPerizinan(values)

                notifications.show(
                  {
                    title: 'Berhasil',
                    message: 'Perizinan berhasil dikirim'
                  }
                )
              } catch (error) {
                notifications.show({
                  title: 'Gagal',
                  message: 'Perizinan gagal dikirim',
                  color: 'red',
                });
              } finally {
                fetchData();
              }
            })}>
              <Stack gap="md">
                <Text size='md'>Perizinan</Text>

                <DateInput
                  label="Tanggal"
                  valueFormat="DD-MM-YYYY"
                  placeholder="Pilih tanggal"
                  {...formIzin.getInputProps('tanggal')}
                />

                <Select
                  label="Jenis Perizinan"
                  placeholder="Pilih jenis perizinan"
                  data={[
                    {
                      value: 'izin sakit rawat inap',
                      label: 'Sakit dengan rawat inap di rumahsakit atau sakit yang sangat menular tapi tidak rawat inap'
                    },
                    {
                      value: 'izin dispensasi',
                      label: 'Dispensasi dari Direktur/Wakil Direktur'
                    },
                    {
                      value: 'izin keperluan penting',
                      label: 'Ijin karena keperluan yang sangat penting (Orang tua/ Saudara kandung meninggal dunia, musibah kebakaran / bencana alam dan sejenisnya)'
                    },
                    {
                      value: 'izin sakit rawat jalan',
                      label: 'Sakit dengan rawat jalan (dengan surat keterangan dokter dan bukti pendukung)'
                    }
                  ]}
                  {...formIzin.getInputProps('jenisIzin')}
                />
                <TextInput
                  label="Keterangan"
                  placeholder="Masukkan keterangan perizinan"
                  {...formIzin.getInputProps('keterangan')}
                />
                <Group justify='right'>
                  <Button
                    type="submit"
                    ref={submitButtonRef}
                    style={{ display: 'none' }} // Hide the button
                    variant="light">Simpan</Button>
                  <Button
                    color='blue'
                    variant='light'
                    onClick={() => {
                      modals.openConfirmModal({
                        // title: 'Simpan Kegiatan',
                        centered: true,
                        children: (
                          <Text size="sm">
                            Apakah anda yakin ingin mengirim perizinan ini?
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
                  >Kirim</Button>
                </Group>
              </Stack>
            </form>
          </Card>

          <Divider my="md" label={
            <Text size='xs' c={"grey"} fw={700} >
              Daftar Perizinan
            </Text>
          } labelPosition='left' size='sm' />

          <TablePerizinan records={dataPerizinan} loading={loading} fetchData={fetchData} />
        </Tabs.Panel>
      </Tabs >


    </>);
};



export default Presensi;
