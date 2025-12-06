'use client'

import { getJarakPenempatan, confirmPenempatan, confirmBulkPenempatan } from '@/utils/pemilihan-tempat';
import { ActionIcon, Button, Grid, GridCol, Group, Select, Checkbox, Stack, Text, TextInput, Badge } from '@mantine/core';
import { closeModal, openModal } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconEye, IconEdit, IconTrash, IconSearch, IconX } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'
import { modals } from '@mantine/modals'
import { useDebouncedValue } from '@mantine/hooks';

const PAGE_SIZES = [10, 15, 20];

// const TabelPengalokasianMahasiswa = ({ records, loading, fetchData }: { records: any, loading: boolean, fetchData: () => void }) => {
const TabelPengalokasianMahasiswa = ({ 
  records, 
  loading, 
  fetchData,
  page,
  pageSize,
  totalRecords,
  setPage,
  setPageSize,
 }: { 
  records: any, 
  loading: boolean, 
  fetchData: () => void,
  page: number;
  pageSize: number;
  totalRecords: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
}) => {

    // du
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [selectedData, setSelectedData] = useState<any[]>([]);

    const toggleRowSelection = (rowIndex: number) => {
        const updatedSelection = new Set(selectedRows);
        if (updatedSelection.has(rowIndex)) {
            updatedSelection.delete(rowIndex);
        } else {
            updatedSelection.add(rowIndex);
        }
        setSelectedRows(updatedSelection);
    };

    const toggleSelectAll = () => {
        if (selectedRows.size === records.length) {
            setSelectedRows(new Set());
        } else {
            const allRowIndexes: any = new Set(records.map((_: any, index: any) => index));
            setSelectedRows(allRowIndexes);
        }
    };

    const isAllSelected = selectedRows.size === records.length;
    const isIndeterminate = selectedRows.size > 0 && selectedRows.size < records.length;

    const handleConfirm = async () => {
        const mahasiswa: string[] = [];
        const satkerId: string[] = [];

        const selectedDataArray = Array.from(selectedRows).map((index) => records[index]);

        selectedDataArray.map((value) => {
            mahasiswa.push(value.mahasiswaId);
            if (value.pilihan1 && value.pilihan1.satkerId) {
                satkerId.push(value.pilihan1.satkerId);
            }
        });

        await confirmBulkPenempatan({ mahasiswa, satkerId });
        notifications.show(
            {
                title: 'Berhasil',
                message: 'Berhasil menempatkan mahasiswa',
            }
        ),
        setSelectedRows(new Set());
        fetchData()
    };

    return (
        <>
            <DataTable
                fetching={loading}
                style={{ minHeight: records.length > 0 ? '0' : '180px' }}  
                pinLastColumn
                withTableBorder
                columns={[
                    {
                        accessor: "checkbox",
                        title: (
                            <Checkbox
                                checked={isAllSelected}
                                indeterminate={isIndeterminate}
                                onChange={toggleSelectAll}
                                size="sm"
                            />
                        ),
                        render: (_, index) => (
                            <Checkbox
                                checked={selectedRows.has(index)}
                                onChange={() => toggleRowSelection(index)}
                                size="sm"
                            />
                        ),
                        width: 50,
                        textAlign: "center",
                    },
                    {
                        accessor: "nama",
                        title: "Nama",
                    },
                    {
                        accessor: "alamatWali",
                        title: "Alamat",
                    },
                    {
                        accessor: "prodi",
                        title: "Prodi",
                    },
                    {
                        accessor: 'pilihan1', title: 'Pilihan 1', textAlign: 'left',
                        render: (value) => value.pilihan1.satker.nama
                    },
                    {
                        accessor: 'pilihan1', title: 'Prov pil 1', textAlign: 'left',
                        render: (value) => value.pilihan1.satker.provinsi.nama
                    },
                    {
                        accessor: 'pilihan2', title: 'Pilihan 2', textAlign: 'left',
                        render: (value) => value?.pilihan2?.satker.nama                    
                    },
                    {
                        accessor: 'pilihan2', title: 'Prov pil 2', textAlign: 'left',
                        render: (value) => value.pilihan2.satker.provinsi.nama
                    },
                    {
                        accessor: "statusPenempatan",
                        title: "Status",
                        render: (records) => (
                        <Badge
                            color={
                                records.statusPenempatan == "disetujui"
                                    ? "blue"
                                : records.statusPenempatan == "dialihkan"
                                    ? "yellow"
                                : records.statusPenempatan == "ditolak"
                                    ? "red"    
                                : records.statusPenempatan == "menunggu"
                                    ? "grey"
                                : records.statusPenempatan == "dikonfirmasi"
                                    ? "green"        
                                : "gray"
                            }
                        >
                        {records.statusPenempatan}
                        </Badge>
                        ),    
                    },
                    {
                        accessor: "penempatan",
                        title: "Penempatan",
                        render: (value) => value?.penempatan?.satker.nama,
                    },
                    {
                        accessor: "aksi",
                        title: "Aksi",
                        textAlign: "center",
                        width: "0%",
                        render: (record) => (
                            <Group gap={4} justify="right" wrap="nowrap">
                                <ActionIcon
                                    size="sm"
                                    variant="subtle"
                                    color="green"
                                    onClick={() => {
                                        showModal({ record, action: "view", fetchData });
                                    }}
                                >
                                    <IconEye size={16} />
                                </ActionIcon>
                                <ActionIcon
                                    size="sm"
                                    variant="subtle"
                                    color="blue"
                                    onClick={async () => {
                                        showModal({ record, action: "edit", fetchData });
                                    }}
                                >
                                    <IconEdit size={16} />
                                </ActionIcon>
                            </Group>
                        ),
                    },
                ]}
                records={records}
                key={"index"}
                totalRecords={totalRecords}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={setPage}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
            />
            {selectedRows.size > 0 && (
                <Button
                    variant="filled"
                    color="blue"
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        zIndex: 999,
                    }}
                    onClick={handleConfirm}
                >
                    Setujui pilihan 1 untuk {selectedRows.size} mahasiswa
                </Button>
            )}

            {/* Display the selected data when the confirm button is clicked */}
            {/* {selectedData.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Data yang Dipilih:</h3>
                    <ul>
                        {selectedData.map((item, index) => (
                            <li key={index}>
                                <strong>Nama:</strong> {item.nama} <br />
                                <strong>Alamat:</strong> {item.alamat} <br />
                                <strong>Prodi:</strong> {item.prodi} <br />
                                <strong>Pilihan 1:</strong> {item.pilihan1.satker.nama} <br />
                                <strong>Pilihan 2:</strong> {item.pilihan2?.satker.nama} <br />
                                <hr />
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}
        </>
    )
}

const showModal = ({ record, action, fetchData }: { record: any, action: string, fetchData: () => void }) => {

    if (action === 'view') {
        openModal({
            modalId: action,
            title: 'Lihat tempat magang',
            children: (
                <Stack>
                    <TextInput label="Nama" value={record.nama} readOnly />
                    <TextInput label="NIM" value={record.nim} readOnly />
                    <TextInput label="Alamat" value={record.alamat} readOnly />
                    <TextInput label="Status" value={record.statusPenempatan} readOnly />
                    <TextInput label="Pilihan 1" value={record.pilihan1?.satker.nama} readOnly />
                    <TextInput label="Pilihan 2" value={record.pilihan2?.satker.nama} readOnly />
                    <TextInput label="Penempatan" value={record.penempatan?.satker.nama ? record.penempatan?.satker.nama : '-'} readOnly />
                    <Button onClick={() => closeModal(action)}>Tutup</Button>
                </Stack>
            ),
        });

    } else if (action === 'edit') {
        const FormComponent = () => {
            const [loading, setLoading] = useState(true)
            const [listJarakPenempatan, setListJarakPenempatan] = useState([])
            const [listPenempatan, setListPenempatan] = useState([])
            const [selectedSatker, setSelectedSatker] = useState('')
            const fetch = async () => {
                const result = await getJarakPenempatan(record.mahasiswaId)
                setListJarakPenempatan(result.data.listJarakTerdekat)
                setListPenempatan(result.data.listPilihanSatker)
                setLoading(false)
            }


            useEffect(() => {
                fetch()
            }, [])

            return (
                <Stack>
                    <TextInput variant="filled" label="Provinsi Pilihan 1" value={record.pilihan1?.satker.provinsi.nama} readOnly />
                    <TextInput variant="filled" label="Satuan Kerja Pilihan 1" value={record.pilihan1?.satker.nama} readOnly />
                    <TextInput variant="filled" label="Provinsi Pilihan 2" value={record.pilihan1?.satker.provinsi.nama} readOnly />
                    <TextInput variant="filled" label="Satuan Kerja Pilihan 2" value={record.pilihan2?.satker.nama} readOnly />

                    <Text mt="md" style={{ fontSize: "13px", fontWeight: "bold" }} >Tabel jarak rumah mahasiswa dengan satuan kerja terdekat.</Text>
                    <DataTable
                        fetching={loading}
                        withColumnBorders
                        withTableBorder
                        records={listJarakPenempatan}
                        key={"index"}
                        style={{ minHeight: listJarakPenempatan.length > 0 ? '0' : '180px' }}  
                        pinLastColumn
                        columns={[
                            {
                                accessor: "kodeSatker",
                                title: "Kode Satker",
                            },
                            {
                                accessor: "nama",
                                title: "SatKer",
                            },
                            {
                                accessor: "provinsi",
                                title: "Provinsi",
                                render: (value: any) => value.provinsi.nama
                            },
                            {
                                accessor: "distance",
                                title: "Jarak",
                                render: (value: any) => `${value.distance} Km`
                            },

                        ]}
                    />
                    <Select
                        allowDeselect={false}
                        label="Pilih Penempatan Mahasiswa"
                        required
                        placeholder="Bisa melihat berdasarkan jarak atau pilihan mahasiswa"
                        data={listPenempatan?.map((satker: any) => ({ value: String(satker.satkerId), label: satker.nama }))}
                        value={selectedSatker}
                        onChange={(value: any) => {
                            setSelectedSatker(value);
                        }}
                    />

                    <Group justify="right">
                        <Button
                            type='submit'
                            color='green'
                            variant='light'
                            onClick={() => {
                                closeModal(action)
                                modals.openConfirmModal({
                                    centered: true,
                                    children: <Text size="sm">Apakah pilihan anda telah sesuai ?</Text>,
                                    labels: { confirm: 'Ya', cancel: 'Tidak' },
                                    cancelProps: { variant: 'light', color: 'gray' },
                                    confirmProps: { variant: 'light', color: 'red' },
                                    onCancel: () => {
                                        fetchData()
                                        showModal({ record, action: 'edit', fetchData })
                                    },
                                    onConfirm: async () => {
                                        await confirmPenempatan(record.mahasiswaId, Number(selectedSatker))
                                        notifications.show(
                                            {
                                                title: 'Berhasil',
                                                message: 'Data penempatan berhasil diubah',
                                            }
                                        ),
                                        fetchData()
                                    }
                                });
                            }}>Konfirmasi</Button>
                    </Group>
                </Stack>
            );
        };

        openModal({
            modalId: action,
            title: 'Konfirmasi Penempatan',
            children: (
                <FormComponent />
            ),
        });
    } 
    
};

export default TabelPengalokasianMahasiswa


// const confirmModal = ({ title, message, form, action }: {
//     title?: string,
//     message: string,
//     form: any,
//     action: () => void
// }) => {
//     openModal({
//         modalId: "confirm",
//         title: title,
//         children: (
//             <Stack>
//                 <Text>
//                     {message}
//                 </Text>
//             </Stack>
//         ),
//     });

    // <Button onClick={() => {
    //     modals.openConfirmModal({
    //         title: title,
    //         centered: true,
    //         children: <Text size="sm">{message}</Text>,
    //         labels: { confirm: 'Ya', cancel: 'Tidak' },
    //         cancelProps: { variant: 'light', color: 'gray' },
    //         confirmProps: { variant: 'light', color: 'red' },
    //         onCancel: () => form.reset(),
    //         onConfirm: () => {
    //             action();
    //             form.reset();
    //         }
    //     });
    // }} />
// }


// du