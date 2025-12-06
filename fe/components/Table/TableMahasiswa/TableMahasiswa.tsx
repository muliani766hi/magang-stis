'use client'

import { ActionIcon, Button, Grid, GridCol, Group, Input, Select, Stack, Text, TextInput } from '@mantine/core';
import { IconEdit, IconEye, IconSearch, IconTrash, IconX } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { openModal, closeModal } from '@mantine/modals';
import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import { putMahasiswa } from '@/utils/kelola-user/mahasiswa';
import { notifications } from '@mantine/notifications';

export interface Record {
  mahasiswaId: number;
  id: number;
  nama: string;
  nim: string;
  kelas: string;
  prodi: string;
  pemlapId: string;
  dosenId: string;
  satkerId: string;
  alamat: string;
  alamatWali: string;
  namaSatker: string;
  namaDosenPembimbingMagang: string;
  namaPembimbingLapangan: string;
}

const PAGE_SIZES = [10, 15, 20];

const TableMahasiswa = ({
  records,
  loading,
  fetchData,
  dataDosen,
  dataPemlap,
  dataSatker,
  page,
  pageSize,
  totalRecords,
  setPage,
  setPageSize
}: {
  records: Record[],
  loading: boolean,
  fetchData: () => void,
  dataDosen: any,
  dataPemlap: any,
  dataSatker: any,
  page: number,
  pageSize: number,
  totalRecords: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  setPageSize: React.Dispatch<React.SetStateAction<number>>,
}) => {
  return (
    <DataTable
      fetching={loading}
      pinLastColumn
      withTableBorder
    //   withColumnBorders
      style={{ minHeight: records.length > 0 ? '0' : '180px' }}  
      columns={[
        { accessor: 'id', title: 'No', textAlign: 'right', hidden: true },
        { accessor: 'no', title: 'No', textAlign: 'center', width: 40, render: (_, index) => (page - 1) * pageSize + (index + 1) },
        { accessor: 'nama', title: 'Nama', textAlign: 'left' },
        { accessor: 'nim', title: 'NIM', textAlign: 'left' },
        { accessor: 'kelas', title: 'Kelas', textAlign: 'left' },
        { accessor: 'prodi', title: 'Prodi', textAlign: 'left' },
        { accessor: 'namaPembimbingLapangan', title: 'Pembimbing Lapangan', textAlign: 'left' },
        { accessor: 'namaDosenPembimbingMagang', title: 'Dosen Pembimbing', textAlign: 'left' },
        { accessor: 'namaSatker', title: 'Tempat Magang', textAlign: 'left' },
        { accessor: 'alamatWali', title: 'Alamat', textAlign: 'left' },
        {
          accessor: 'aksi',
          title: 'Aksi',
          width: '0%',
          textAlign: 'center',
          render: (record) => (
            <Group gap={4} justify="right" wrap="nowrap">
              <ActionIcon size="sm" variant="subtle" color="green" onClick={() => showModal({ record, action: 'view', fetchData, dataDosen, dataPemlap, dataSatker })} title="Lihat">
                <IconEye size={16} />
              </ActionIcon>
              <ActionIcon size="sm" variant="subtle" color="blue" onClick={() => showModal({ record, action: 'edit', fetchData, dataDosen, dataPemlap, dataSatker })} title='Ubah'>
                <IconEdit size={16} />
              </ActionIcon>
            </Group>
          )
        }
      ]}
      records={records}
      totalRecords={totalRecords}
      recordsPerPage={pageSize}
      page={page}
      onPageChange={setPage}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      key="index"
    />
  );
};

const showModal = ({ record, action, fetchData, dataDosen, dataPemlap, dataSatker }: { record: Record; action: 'view' | 'edit'; fetchData: () => void, dataDosen: any, dataPemlap: any, dataSatker: any }) => {
  if (action === 'view') {
    openModal({
      modalId: action,
      title: 'Lihat Data Mahasiswa',
      children: (
        <Stack>
          <Input.Wrapper label="NIM"><Input value={record.nim} readOnly /></Input.Wrapper>
          <Input.Wrapper label="Nama"><Input value={record.nama} readOnly /></Input.Wrapper>
          <Input.Wrapper label="Kelas"><Input value={record.kelas} readOnly /></Input.Wrapper>
          <Input.Wrapper label="Prodi"><Input value={record.prodi} readOnly /></Input.Wrapper>
          <Input.Wrapper label="Pembimbing Lapangan"><Input value={record.namaPembimbingLapangan} readOnly /></Input.Wrapper>
          <Input.Wrapper label="Dosen Pembimbing"><Input value={record.namaDosenPembimbingMagang} readOnly /></Input.Wrapper>
          <Input.Wrapper label="Tempat Magang"><Input value={record.namaSatker} readOnly /></Input.Wrapper>
          <Input.Wrapper label="Alamat"><Input value={record.alamatWali} readOnly /></Input.Wrapper>
          <Button onClick={() => closeModal(action)}>Tutup</Button>
        </Stack>
      ),
    });
  } else if (action === 'edit') {
    const FormComponent = () => {
      const form = useForm({
        initialValues: {
          mahasiswaId: record.mahasiswaId || '',
          nim: record.nim || '',
          nama: record.nama || '',
          kelas: record.kelas || '',
          prodi: record.prodi || '',
          pemlapId: String(record.pemlapId) || '',
          dosenId: String(record.dosenId) || '',
          satkerId: String(record.satkerId) || '',
          alamat: record.alamat || '',
          alamatWali: record.alamatWali || '',
        }
      });

      return (
        <form onSubmit={form.onSubmit(async (values) => {
          try {
            await putMahasiswa(values.mahasiswaId as number, values);
            notifications.show({ title: 'Berhasil', message: 'Data mahasiswa berhasil diubah' });
            fetchData();
            closeModal(action);
          } catch (error) {
            console.error('Error updating mahasiswa:', error);
          }
        })}>
          <Stack>
            <TextInput label="NIM" {...form.getInputProps('nim')} />
            <TextInput label="Nama" {...form.getInputProps('nama')} />
            <TextInput label="Kelas" {...form.getInputProps('kelas')} />
            <TextInput label="Prodi" {...form.getInputProps('prodi')} />
            <Select label="Pembimbing Lapangan" searchable data={dataPemlap} {...form.getInputProps('pemlapId')} placeholder="Pilih Pembimbing Lapangan" />
            <Select label="Dosen Pembimbing" searchable data={dataDosen} {...form.getInputProps('dosenId')} placeholder="Pilih Dosen Pembimbing" />
            <Select label="Tempat Magang" searchable data={dataSatker} {...form.getInputProps('satkerId')} placeholder="Pilih Tempat Magang" />
            <TextInput label="Alamat" {...form.getInputProps('alamatWali')} />
            <Button type='submit' color='orange' variant='light'>Ubah</Button>
          </Stack>
        </form>
      );
    };

    openModal({
      modalId: action,
      title: 'Edit Data Mahasiswa',
      children: <FormComponent />,
    });
  }
};

export default TableMahasiswa;
