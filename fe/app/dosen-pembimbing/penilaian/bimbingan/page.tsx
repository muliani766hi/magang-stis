'use client'

import React, { useEffect, useRef, useState } from 'react'
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import { Text, Accordion, Group, Button, Stack } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { notifications } from '@mantine/notifications';
import { getAllMahasiswa } from '@/utils/kelola-user/mahasiswa';
import { getPenilaianBimbingan, postPenilaianBimbingan, putPenilaianBimbingan, } from '@/utils/penilaian';

registerAllModules();

const kriteria_bimbingan = [
    {
        "id": 1,
        "kriteria": "Inisiatif",
        "kurang_memuaskan": "Tidak pernah menyampaikan ide/gagasan dalam melaksanakan bimbingan magang",
        "memuaskan": "Beberapa kali menyampaikan ide/gagasan dalam melaksanakan bimbingan magang",
        "sangat_memuaskan": "Sering menyampaikan ide/gagasan dalam melaksanakan bimbingan magang"
    },
    {
        "id": 2,
        "kriteria": "Disiplin",
        "kurang_memuaskan": "Jarang menyusun penulisan laporan tepat waktu",
        "memuaskan": "Hampir selalu menyusun penulisan laporan tepat waktu",
        "sangat_memuaskan": "Selalu menyusun laporan magang tepat waktu"
    },
    {
        "id": 3,
        "kriteria": "Ketekunan",
        "kurang_memuaskan": "Jarang melaksanakan penulisan laporan magang dengan kualitas yang baik",
        "memuaskan": "Hampir selalu melaksanakan penulisan laporan magang dengan kualitas yang baik",
        "sangat_memuaskan": "Selalu melaksanakan penulisan laporan magang dengan kualitas yang baik"
    },
    {
        "id": 4,
        "kriteria": "Berpikir kritis, kreatif, dan analitis",
        "kurang_memuaskan": "Kurang menunjukkan kemampuan berpikir kritis, kreatif dan analitis yang cukup baik",
        "memuaskan": "Kadang-kadang menunjukkan kemampuan berpikir kritis, kreatif dan analitis yang baik",
        "sangat_memuaskan": "Selalu menunjukkan kemampuan berpikir kritis, kreatif dan analitis yang sangat baik"
    },
    {
        "id": 5,
        "kriteria": "Kemampuan Komunikasi (lisan maupun tulisan)",
        "kurang_memuaskan": "Kurang mampu melakukan komunikasi lisan dan/atau tulisan dengan baik dalam bimbingan dan/atau presentasi",
        "memuaskan": "Mampu melakukan komunikasi lisan dan/atau tulisan dengan baik dalam bimbingan dan/atau presentasi",
        "sangat_memuaskan": "Mampu melakukan komunikasi lisan dan/atau tulisan dengan sangat baik dalam bimbingan dan/atau presentasi"
    }
]

const Penilaian = () => {
    const hotTableRef = useRef<any>(null);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    const nilaiValidator = (value: number, callback: any) => {
        // value beetwen 0 and 100 and numeric
        if (value < 50 || value > 100 || isNaN(value)) {
            callback(false);
            return;
        }
        callback(true);
    }

    const handleSave = async () => {
        if (hotTableRef.current) {
            const hotTableInstance = hotTableRef.current.hotInstance;
            const data = hotTableInstance.getData();

            // Assuming the last element in the array is penilaianBimbinganId
            const transformedData = data.map(([mahasiswaId, nim, nama, ...nilai]: [number, string, string, ...number[]]) => {
                const penilaianBimbinganId = nilai[5]; // or any other index where penilaianBimbinganId is stored
                const createPenilaianBimbinganDto = {
                    disiplin: nilai[0],
                    inisiatif: nilai[1],
                    kemampuanBerfikir: nilai[2],
                    ketekunan: nilai[3],
                    komunikasi: nilai[4]
                };

                // Check for null values in the data
                const isRowComplete = !Object.values(createPenilaianBimbinganDto).some(value => value === null);

                if (!isRowComplete) {
                    return null; // Filter out incomplete rows
                }

                const updatePenilaianBimbinganDto = {
                    ...createPenilaianBimbinganDto
                };

                return penilaianBimbinganId
                    ? { penilaianBimbinganId, updatePenilaianBimbinganDto }
                    : { mahasiswaId, createPenilaianBimbinganDto };
            }).filter((item: any) => item !== null); // Filter out null values

            console.log(transformedData);

            if (transformedData.length === 0) {
                notifications.show({
                    title: 'Data tidak lengkap',
                    message: 'Tidak ada data penilaian yang lengkap',
                    color: 'red',
                });
                return;
            }

            const newEntries = transformedData.filter((item: any) => item.createPenilaianBimbinganDto);
            const existingEntries = transformedData.filter((item: any) => item.updatePenilaianBimbinganDto);
            console.log(newEntries);
            console.log(existingEntries);

            // Perform save operations based on the presence of penilaianBimbinganId
            try {
                // Call API for new entries
                if (newEntries.length > 0) {
                    await postPenilaianBimbingan(newEntries);
                }

                // Call API for existing entries
                if (existingEntries.length > 0) {
                    await putPenilaianBimbingan(existingEntries);
                }

                notifications.show({
                    title: 'Data berhasil disimpan',
                    message: 'Data penilaian berhasil disimpan',
                    color: 'blue',
                });
            } catch (error) {
                notifications.show({
                    title: 'Data gagal disimpan',
                    message: 'Data penilaian gagal disimpan',
                    color: 'red',
                });
            }
        } else {
            notifications.show({
                title: 'Data tabel tidak ditemukan',
                message: 'Data penilaian gagal disimpan',
                color: 'red',
            });
        }
    };

    const fetchData = async () => {
        try {
            const response = await getAllMahasiswa()
            const dataPenilaianBimbingan = await getPenilaianBimbingan();

            let modifiedData = response.data.map((item: { mahasiswaId: any; nim: any; nama: any; }) => ({
                id: item.mahasiswaId,
                nim: item.nim,
                nama: item.nama,
            }));

            modifiedData = modifiedData.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);

            if (dataPenilaianBimbingan) {
                modifiedData = modifiedData.map((item: { id: any; nim: any; nama: any; }) => {
                    const penilaian = dataPenilaianBimbingan.data.find((value: { penilaian: any; }) => value.penilaian.mahasiswaId === item.id);
                    if (penilaian) {
                        return {
                            ...item,
                            nilai: {
                                1: penilaian.disiplin,
                                2: penilaian.inisiatif,
                                3: penilaian.kemampuanBerfikir,
                                4: penilaian.ketekunan,
                                5: penilaian.komunikasi,
                            },
                            penilaianBimbinganId: penilaian.penilaianBimbinganId
                        }
                    }
                    return item;
                });
            }

            console.log(modifiedData);
            setData(modifiedData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Text c={"dimmed"} mb={"md"} >Penilaian Bimbingan</Text>
                    {/* <Divider
                        my={"md"}
                        label={<Text size='sm' c={'black'} fw={700} >Daftar Penilaian</Text>}
                        labelPosition='left'
                        orientation='horizontal'
                        size='sm'
                    /> */}
                    <Stack my="md" gap="sm">
                        <HotTable
                            ref={hotTableRef}
                            data={data}
                            dataSchema={{
                                id: null,
                                nim: null,
                                nama: null,
                                nilai: {
                                    1: null,
                                    2: null,
                                    3: null,
                                    4: null,
                                    5: null,
                                }
                            }}
                            colHeaders={['id', 'NIM', 'Nama', '1', '2', '3', '4', '5', 'penilaianBimbinganId']}
                            height="auto"
                            stretchH="all"
                            width="100%"
                            columns={[
                                { data: 'id', type: 'numeric', readOnly: true },
                                { data: 'nim', type: 'text', readOnly: true },
                                { data: 'nama', type: 'text', readOnly: true },
                                { data: 'nilai.1', type: 'numeric', validator: nilaiValidator },
                                { data: 'nilai.2', type: 'numeric', validator: nilaiValidator },
                                { data: 'nilai.3', type: 'numeric', validator: nilaiValidator },
                                { data: 'nilai.4', type: 'numeric', validator: nilaiValidator },
                                { data: 'nilai.5', type: 'numeric', validator: nilaiValidator },
                                { data: 'penilaianBimbinganId', type: 'numeric', readOnly: true },
                            ]}
                            fixedColumnsStart={2}
                            // minSpareRows={1}
                            rowHeaders={true}
                            autoWrapRow={true}
                            autoWrapCol={true}
                            licenseKey="non-commercial-and-evaluation"
                            hiddenColumns={{ columns: [0, 8] }}
                        />

                        <Group justify='flex-end'>
                            <Button
                                variant='light'
                                color='blue'
                                onClick={handleSave}
                            >
                                Simpan
                            </Button>
                        </Group>
                    </Stack>

                    <Accordion variant="contained" defaultValue="tabel">
                        <Accordion.Item key={1} value="tabel">
                            <Accordion.Control>
                                <Text size='sm' fw={700} >Kriteria Penilaian</Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <DataTable
                                    // pinLastColumn
                                    withColumnBorders
                                    withTableBorder
                                    groups={[
                                        {
                                            id: 'id',
                                            title: '',
                                            style: { borderBottomColor: 'transparent' },
                                            columns: [
                                                {
                                                    accessor: 'id',
                                                    title: (
                                                        <Text fw={700}>
                                                            No
                                                        </Text>
                                                    ),
                                                    hidden: true,
                                                    textAlign: 'right'
                                                },
                                            ]
                                        },

                                        {
                                            id: 'no',
                                            title: '',
                                            style: { borderBottomColor: 'transparent' },
                                            columns: [
                                                {
                                                    accessor: 'index',
                                                    title: (
                                                        <Text fw={700} size='sm'>
                                                            No
                                                        </Text>
                                                    ),
                                                    textAlign: 'right',
                                                    width: 40,
                                                    render: (record) => kriteria_bimbingan.indexOf(record) + 1,
                                                },
                                            ]
                                        },

                                        {
                                            id: 'kriteria',
                                            title: '',
                                            style: { borderBottomColor: 'transparent' },
                                            columns: [
                                                {
                                                    accessor: 'kriteria',
                                                    title: (
                                                        <Text fw={700} size='sm'>
                                                            Kriteria
                                                        </Text>
                                                    ),
                                                    titleStyle: () => ({ textAlign: "center" }),
                                                    cellsStyle: () => ({
                                                        textAlign: "justify",
                                                    })
                                                },
                                            ]
                                        },

                                        {
                                            id: 'kurang_memuaskan',
                                            title: 'Kurang Memuaskan',
                                            textAlign: 'center',
                                            columns: [
                                                {
                                                    accessor: 'kurang_memuaskan',
                                                    title: (
                                                        <Text fw={700} size='sm'>
                                                            Range nilai 50 - 69
                                                        </Text>
                                                    ),
                                                    titleStyle: () => ({ textAlign: "center" }),
                                                    cellsStyle: () => ({
                                                        textAlign: "justify",
                                                    })
                                                },
                                            ]
                                        },

                                        {
                                            id: 'memuaskan',
                                            title: 'Memuaskan',
                                            textAlign: 'center',
                                            columns: [
                                                {
                                                    accessor: 'memuaskan',
                                                    title: (
                                                        <Text fw={700} size='sm'>
                                                            Range nilai 70 - 85
                                                        </Text>
                                                    ),
                                                    titleStyle: () => ({ textAlign: "center" }),
                                                    cellsStyle: () => ({
                                                        textAlign: "justify",
                                                    })
                                                },
                                            ]
                                        },

                                        {
                                            id: 'sangat_memuaskan',
                                            title: 'Sangat Memuaskan',
                                            textAlign: 'center',
                                            columns: [
                                                {
                                                    accessor: 'sangat_memuaskan',
                                                    title: (
                                                        <Text fw={700} size='sm'>
                                                            Range nilai 86 - 100
                                                        </Text>
                                                    ),
                                                    titleStyle: () => ({ textAlign: "center" }),
                                                    cellsStyle: () => ({
                                                        textAlign: "justify",
                                                    })
                                                },
                                            ]
                                        },
                                    ]}
                                    records={kriteria_bimbingan}
                                />
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
        </>
    )
}

export default Penilaian