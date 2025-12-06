'use client'
import {
  Button, ActionIcon, Card, CloseButton, Group, SimpleGrid, Stack, Text, rem,
  Modal,
  Badge
} from '@mantine/core'
import { MonthPickerInput } from '@mantine/dates'
import React, { useState, useEffect } from 'react'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications'
import { PDF_MIME_TYPE } from '@mantine/dropzone'
import { useForm } from '@mantine/form';
import { Dropzone } from '@mantine/dropzone';
import { modals } from '@mantine/modals'
import { DataTable } from "mantine-datatable";
import { postDokumenTranslok, getDokumenTranslok, putDokumenTranslok } from '@/utils/dokumen-translok'
import { useDisclosure } from '@mantine/hooks'

interface FormValues {
  bulan: Date;
  fileDokumen: File[];
}

const DokumenTranslok = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opened1, { open: open1, close: close1 }] = useDisclosure(false);
  const [opened2, { open: open2, close: close2 }] = useDisclosure(false);


  const newform = useForm<FormValues>({
    initialValues: {
      bulan: new Date(),
      fileDokumen: [],
    },

    validate: {
      fileDokumen: (fileDokumenTranslok: File[]) => {
        if (fileDokumenTranslok.length === 0) {
          return 'File tidak boleh kosong';
        }
        if (fileDokumenTranslok.some((file) => file.size > 20 * 1024 ** 2)) {
          return 'Ukuran file tidak boleh melebihi 20mb';
        }
      },

    },
  });

  const updateform = useForm<FormValues>({
    initialValues: {
      bulan: new Date(),
      fileDokumen: [],
    },

    validate: {
      fileDokumen: (fileDokumenTranslok: File[]) => {
        if (fileDokumenTranslok.length === 0) {
          return 'File tidak boleh kosong';
        }
        if (fileDokumenTranslok.some((file) => file.size > 20 * 1024 ** 2)) {
          return 'Ukuran file tidak boleh melebihi 20mb';
        }
      },

    },
  });

  const fetchData = async () => {
    const response = await getDokumenTranslok();
    setRecords(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedFiles = Array.isArray(newform.values.fileDokumen) ? (
    newform.values.fileDokumen.map((file, index) => (
      <Text key={file.name}
        onClick={() => {
          window.open(URL.createObjectURL(file), '_blank');
        }}
        style={{ cursor: 'pointer' }}
      >
        <b>{file.name}</b> ({(file.size / 1024).toFixed(2)} kb)
        <CloseButton
          size="xs"
          onClick={() =>
            newform.setFieldValue(
              'fileDokumen',
              newform.values.fileDokumen.filter((_, i) => i !== index)
            )
          }
        />
      </Text>
    ))
  ) : null;

  const selectedFilesUpdate = Array.isArray(updateform.values.fileDokumen) ? (
    updateform.values.fileDokumen.map((file, index) => (
      <Text key={file.name}
        onClick={() => {
          window.open(URL.createObjectURL(file), '_blank');
        }}
        style={{ cursor: 'pointer' }}
      >
        <b>{file.name}</b> ({(file.size / 1024).toFixed(2)} kb)
        <CloseButton
          size="xs"
          onClick={() =>
            updateform.setFieldValue(
              'fileDokumen',
              updateform.values.fileDokumen.filter((_, i) => i !== index)
            )
          }
        />
      </Text>
    ))
  ) : null;

  const handleFileUpload = async (value: any) => {
    const formdata = new FormData();

    const bulanString = value.bulan instanceof Date
      ? `${String(value.bulan.getMonth() + 1).padStart(2, '0')}-${value.bulan.getFullYear()}`
      : value.bulan;

    formdata.append("bulan", bulanString);
    formdata.append("file", value.fileDokumen[0]);
    try {
      const response = await postDokumenTranslok(formdata);
      console.log('Upload berhasil', response);
    } catch (error) {
      console.error('Upload gagal', error);
    }
  };

  const handleUpdateFileUpload = async (id: any, value: any) => {
    const formdata = new FormData();

    console.log(id)
    formdata.append("file", value.fileDokumen[0]);
    try {
      const response = await putDokumenTranslok(id, formdata);
      console.log('Upload berhasil', response);
    } catch (error) {
      console.error('Upload gagal', error);
    }
  };

  const [editingRecord, setEditingRecord] = useState<any | null>(null);

  // const openEditModal = (record: any) => {
  //   setEditingRecord(record);
  //   modals.open({
  //     title: 'Upload Ulang Dokumen',
  //     size: 'lg',
  //     children: (
        
  //     ),
  //   });
  // };

  return (
    <>
      <Text c="dimmed" mb="md">Dokumen Translok</Text>
      <Button onClick={open1}>Upload Dokumen Baru</Button>

      <Modal
        size="lg"
        opened={opened1}
        onClose={close1}
        closeOnClickOutside={false}
        title={<Text size="xl">Unggah Dokumen Translok</Text>}
          centered
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
        }}
      >
          <Card shadow="xs" padding="md" radius="sm" withBorder>
            <form onSubmit={newform.onSubmit(async (values: any) => {
              // console.log(values);
              try {
                await handleFileUpload(values);
                close();
                notifications.show({
                  title: 'Berhasil dikirim',
                  message: 'Dokumen Translok berhasil dikirim',
                });
                fetchData();
              }
              catch (error) {
                notifications.show({
                  title: 'Gagal dikirim',
                  message: 'Dokumen Translok gagal dikirim',
                  color: 'red',
                });
              }
            })}>

              <Stack>
                <MonthPickerInput
                  label="Bulan"
                  description="Pilih bulan pengunggahan dokumen translok"
                  {...newform.getInputProps('bulan')}
                />
                <Dropzone
                  maxSize={20 * 1024 ** 2}
                  accept={PDF_MIME_TYPE}
                  onDrop={(fileDokumenValue) => newform.setFieldValue('fileDokumen', fileDokumenValue)}
                  onReject={() => newform.setFieldError('fileDokumen', 'File size exceeds 20mb or file type is not supported')}
                >
                  <Group justify="center" gap="xl" mih={320} style={{ pointerEvents: 'none' }}>
                    <Dropzone.Accept>
                      <IconUpload
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                        stroke={1.5}
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                        stroke={1.5}
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconPhoto
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                        stroke={1.5}
                      />
                    </Dropzone.Idle>
                    <div>
                      <Text size="xl" inline>
                        Tarik file ke sini atau klik untuk memilih file
                      </Text>

                      <Text size="sm" c="dimmed" inline mt={7}>
                        File tidak boleh melebihi 20mb
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
                {selectedFiles && selectedFiles.length > 0 && (
                  <>
                    <Text>
                      Selected files:
                    </Text>
                    {selectedFiles}
                  </>
                )}
                <Group justify='right'>
                  <Button
                    type="submit"
                    // ref={submitButtonRef}
                    color="blue"
                    variant="light">Simpan</Button>
                </Group>
              </Stack>
            </form>
          </Card>
      </Modal>  

      <Modal
        size="lg"
        opened={opened2}
        onClose={close2}
        closeOnClickOutside={false}
        title={<Text size="xl">Update Dokumen Translok</Text>}
          centered
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
        }}
      >
      <Card shadow="xs" padding="md" radius="sm" withBorder>
          <Stack>
            <form onSubmit={updateform.onSubmit(async (values: any) => {

              try {
                console.info("value update", values);
                await handleUpdateFileUpload(editingRecord.id, values);
                close2();
                notifications.show({
                  title: 'Berhasil dikirim',
                  message: 'Dokumen Translok berhasil dikirim',
                });
                fetchData();
              }
              catch (error) {
                notifications.show({
                  title: 'Gagal dikirim',
                  message: 'Dokumen Translok gagal dikirim',
                  color: 'red',
                });
              }
            })}>
              <Dropzone
                maxSize={20 * 1024 ** 2}
                accept={PDF_MIME_TYPE}
                onDrop={(fileDokumenValue) => updateform.setFieldValue('fileDokumen', fileDokumenValue)}
                onReject={() => updateform.setFieldError('fileDokumen', 'File size exceeds 20mb or file type is not supported')}
                mb = {20}
              >
                <Group justify="center" gap="xl" mih={200} style={{ pointerEvents: 'none' }}>
                  <IconUpload style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }} stroke={1.5} />
                  <div>
                    <Text size="xl" inline>
                      Tarik file ke sini atau klik untuk memilih file
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Format PDF dan maksimal 20mb
                    </Text>
                  </div>
                </Group>
              </Dropzone>
               {selectedFilesUpdate && selectedFilesUpdate.length > 0 && (
                    <>
                      <Text>
                        Selected files:
                      </Text>
                      {selectedFilesUpdate}
                    </>
                )}
              <Group justify='right'>
                <Button
                  type="submit"
                  color="blue"
                  variant="light">Simpan</Button>
              </Group>
            </form>
          </Stack>
        </Card>
        </Modal>

      <Stack style={{ marginTop: "20px" }}>
        <DataTable
          fetching={loading}
          highlightOnHover
          withTableBorder
          withColumnBorders
          records={records}
          style={{ minHeight: records.length > 0 ? '0' : '180px' }}  
          columns={[
            {
              accessor: "bulan",
              title: "Bulan",
              render: (record) => {
                // Mengonversi data bulan menjadi nama bulan
                const monthIndex = new Date(record.bulan).getMonth(); // Menangkap index bulan
                const months = [
                  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ];
                return months[monthIndex]; // Mengambil nama bulan berdasarkan index
              },              
            },
            {
              accessor: "dokumen",
              title: "Dokumen",
            },
            {
              accessor: "updateKe",
              title: "Update Ke-",
            },
            {
              accessor: "update",
              title: "Tanggal Upload/Update",
            },
            {
              accessor: "status",
              title: "Status",
              render: (record) => (
                <Badge
                  color={
                    record.status == "dikembalikan"
                      ? "red"
                    : record.status == "menunggu"
                      ? "grey"
                    : record.status == "disetujui"
                      ? "green"        
                    : "grey"
                  }
                >
                {record.status}
                </Badge>
              )                                
            },            
            {
              accessor: 'aksi', title: 'Aksi',
              textAlign: 'center',
              width: '0%',
              render: (record: any) => {
                const showEdit = ['dikembalikan'].includes(record.status);
                return (
                  <Group gap={4} justify="right" wrap="nowrap">
                    {showEdit && (
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="blue"
                        onClick={() => {
                          setEditingRecord(record);
                          open2();
                        }}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    )}
                  </Group>
                );
              },
            },
            {
              accessor: "catatan",
              title: "Catatan dari BAU",
              render: (record) => (
                <Text c={record.status === "disetujui" ? "dimmed" : undefined} size="sm" >
                  {record.catatan}
                </Text>
              ),
            }
          ]}
        />

      </Stack>
    </>
  )
}

export default DokumenTranslok
