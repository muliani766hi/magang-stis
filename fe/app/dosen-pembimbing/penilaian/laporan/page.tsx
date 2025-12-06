'use client'

import React, { useEffect, useRef, useState } from 'react'
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import { Text, Accordion, Group, Button, Tabs, Stack } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { notifications } from '@mantine/notifications';
import { getAllMahasiswa } from '@/utils/kelola-user/mahasiswa';
import { getPenilaianLaporanByDosen, postPenilaianLaporanByDosen, putPenilaianLaporanByDosen } from '@/utils/penilaian';

registerAllModules();

const kriteria_laporan = [
    {
        "id": 1,
        "kriteria": "Gambaran umum instansi tempat magang (15%)",
        "kurang_memuaskan": "Tidak ada kejelasan jenis instansi tempat magang",
        "memuaskan": "Ada kejelasan jenis instansi tempat magang",
        "sangat_memuaskan": "Sangat jelas memberikan gambaran instansi tempat magang",
        "Skor": "50 - 100"
    },
    {
        "id": 2,
        "kriteria": "Tugas mahasiswa yang dilaksanakan di tempat magang (15%)",
        "kurang_memuaskan": "Tugas mahasiswa tidak dijelaskan dengan baik",
        "memuaskan": "Tugas mahasiswa dijelaskan dengan baik namun masih ada yang kurang jelas",
        "sangat_memuaskan": "Tugas mahasiswa dijelaskan dengan jelas dan baik",
        "Skor": "50 - 100"
    },
    {
        "id": 3,
        "kriteria": "Pendahuluan/Latar belakang magang ditulis secara jelas (10%)",
        "kurang_memuaskan": "Latar belakang magang kurang menjelaskan tujuan magang dan alasan mengapa suatu topik dipilih untuk dibahas",
        "memuaskan": "Latar belakang magang menjelaskan tujuan magang dan alasan mengapa suatu topik dipilih untuk dibahas dengan cukup baik",
        "sangat_memuaskan": "Latar belakang magang menjelaskan tujuan magang dan alasan mengapa suatu topik dipilih untuk dibahas dengan sangat baik",
        "Skor": "50 - 100"
    },
    {
        "id": 4,
        "kriteria": "Keterkaitan antara kegiatan magang dengan mata kuliah yang telah diambil (15%)",
        "kurang_memuaskan": "Keterkaitan kegiatan magang dengan mata kuliah tidak dijelaskan",
        "memuaskan": "Keterkaitan kegiatan magang dengan mata kuliah dijelaskan dengan cukup jelas",
        "sangat_memuaskan": "Keterkaitan kegiatan magang dengan mata kuliah dijelaskan dengan sangat jelas",
        "Skor": "50 - 100"
    },
    {
        "id": 5,
        "kriteria": "Refleksi diri mencerminkan proses pembelajaran selama magang secara pribadi, meliputi aspek technical skill dan social-emotional skill (25%)",
        "kurang_memuaskan": "Refleksi diri mahasiswa dijelaskan tidak meliputi kedua aspek tersebut (tidak lengkap)",
        "memuaskan": "Refleksi diri mahasiswa dijelaskan lengkap (2 aspek) belum lengkap",
        "sangat_memuaskan": "Refleksi diri mahasiswa dijelaskan lengkap (2 aspek) dengan lengkap dan baik",
        "Skor": "50 - 100"
    },
    {
        "id": 6,
        "kriteria": "Kesimpulan dan saran disusun sesuai dengan pembahasan (10%)",
        "kurang_memuaskan": "Kesimpulan dan saran tidak sesuai dengan pembahasan",
        "memuaskan": "Kesimpulan dan saran cukup sesuai dengan pembahasan",
        "sangat_memuaskan": "Kesimpulan dan saran sesuai dengan pembahasan",
        "Skor": "50 - 100"
    },
    {
        "id": 7,
        "kriteria": "Saran untuk institusi yang terkait dengan pembahasan Bab 3 (10%)",
        "kurang_memuaskan": "Saran tidak sesuai dengan pembahasan",
        "memuaskan": "Saran cukup sesuai dengan pembahasan",
        "sangat_memuaskan": "Saran sesuai dengan pembahasan",
        "Skor": "50 - 100"
    },
    {
        "id": 8,
        "kriteria": "Mengikuti panduan laporan yang berlaku di Politeknik Statistika STIS (5%)",
        "kurang_memuaskan": "Laporan tidak mengikuti panduan yang berlaku",
        "memuaskan": "Laporan cukup sesuai dengan panduan",
        "sangat_memuaskan": "Laporan sesuai dengan panduan",
        "Skor": "50 - 100"
    },
    {
        "id": 9,
        "kriteria": "Logika penyajian yang runtut (5%)",
        "kurang_memuaskan": "Susunan bab, paragraf dan kalimat tidak sesuai dengan kaidah yang berlaku",
        "memuaskan": "Susunan bab, paragraf dan kalimat cukup sesuai dengan kaidah yang berlaku",
        "sangat_memuaskan": "Susunan bab, paragraf dan kalimat sesuai dengan kaidah yang berlaku",
        "Skor": "50 - 100"
    },
    {
        "id": 10,
        "kriteria": "Bahasa yang baku serta ilmiah (5%)",
        "kurang_memuaskan": "Menggunakan bahasa yang kurang tepat, tidak sesuai dengan aturan yang benar",
        "memuaskan": "Menggunakan bahasa yang cukup tepat, cukup sesuai dengan aturan yang benar",
        "sangat_memuaskan": "Menggunakan bahasa yang tepat, sesuai dengan aturan yang benar",
        "Skor": "50 - 100"
    }
]

const Penilaian = () => {
    const hotTableRef2 = useRef<any>(null);
    const [data2, setData2] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    const nilaiValidator = (value: number, callback: any) => {
        // value beetwen 0 and 100 and numeric
        if (value < 50 || value > 100 || isNaN(value)) {
            callback(false);
            return;
        }
        callback(true);
    }

    const handleSave2 = async () => {
        if (hotTableRef2.current) {
            const hotTableInstance = hotTableRef2.current.hotInstance;
            const data = hotTableInstance.getData();

            // Assuming the last element in the array is penilaianLaporanDosenId
            const transformedData = data.map(([mahasiswaId, nim, nama, ...nilai]: [number, string, string, ...number[]]) => {
                const penilaianLaporanDosenId = nilai[10]; // or any other index where penilaianLaporanDosenId is stored
                const createPenilaianLaporanDosenDto = {
                    var1: nilai[0],
                    var2: nilai[1],
                    var3: nilai[2],
                    var4: nilai[3],
                    var5: nilai[4],
                    var6: nilai[5],
                    var7: nilai[6],
                    var8: nilai[7],
                    var9: nilai[8],
                    var10: nilai[9]
                };

                // Check for null values in the data
                const isRowComplete = !Object.values(createPenilaianLaporanDosenDto).some(value => value === null);

                if (!isRowComplete) {
                    return null; // Filter out incomplete rows
                }

                const updatePenilaianLaporanDosenDto = {
                    ...createPenilaianLaporanDosenDto
                };

                return penilaianLaporanDosenId
                    ? { penilaianLaporanDosenId, updatePenilaianLaporanDosenDto }
                    : { mahasiswaId, createPenilaianLaporanDosenDto };
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

            const newEntries = transformedData.filter((item: any) => item.createPenilaianLaporanDosenDto);
            const existingEntries = transformedData.filter((item: any) => item.updatePenilaianLaporanDosenDto);
            console.log(newEntries);
            console.log(existingEntries);

            // Perform save operations based on the presence of penilaianLaporanDosenId
            try {
                // Call API for new entries
                if (newEntries.length > 0) {
                    await postPenilaianLaporanByDosen(newEntries);
                }

                // Call API for existing entries
                if (existingEntries.length > 0) {
                    await putPenilaianLaporanByDosen(existingEntries);
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
            const dataPenilaianLaporan = await getPenilaianLaporanByDosen();

            let modifiedData2 = response.data.map((item: { mahasiswaId: any; nim: any; nama: any; }) => ({
                id: item.mahasiswaId,
                nim: item.nim,
                nama: item.nama,
            }));

            modifiedData2 = modifiedData2.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);

            if (dataPenilaianLaporan) {
                modifiedData2 = modifiedData2.map((item: { id: any; nim: any; nama: any; }) => {
                    const penilaian = dataPenilaianLaporan.data.find((value: { penilaian: any; }) => value.penilaian.mahasiswaId === item.id);
                    if (penilaian) {
                        return {
                            ...item,
                            nilai: {
                                1: penilaian.var1,
                                2: penilaian.var2,
                                3: penilaian.var3,
                                4: penilaian.var4,
                                5: penilaian.var5,
                                6: penilaian.var6,
                                7: penilaian.var7,
                                8: penilaian.var8,
                                9: penilaian.var9,
                                10: penilaian.var10
                            },
                            penilaianLaporanDosenId: penilaian.penilaianLaporanDosenId
                        }
                    }
                    return item;
                });
            }

            console.log(modifiedData2);
            setData2(modifiedData2);
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
            <Text c={"dimmed"} mb={"md"} >Penilaian Laporan</Text>
                    <Stack my="md" gap="sm">
                        <HotTable
                            ref={hotTableRef2}
                            data={data2}
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
                                    6: null,
                                    7: null,
                                    8: null,
                                    9: null,
                                    10: null
                                },
                                penilaianLaporanDosenId: null
                            }}
                            colHeaders={['id', 'NIM', 'Nama', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'penilaianLaporanDosenId']}
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
                                { data: 'nilai.6', type: 'numeric', validator: nilaiValidator },
                                { data: 'nilai.7', type: 'numeric', validator: nilaiValidator },
                                { data: 'nilai.8', type: 'numeric', validator: nilaiValidator },
                                { data: 'nilai.9', type: 'numeric', validator: nilaiValidator },
                                { data: 'nilai.10', type: 'numeric', validator: nilaiValidator },
                                { data: 'penilaianLaporanDosenId', type: 'numeric', readOnly: true },
                            ]}
                            fixedColumnsStart={2}
                            // minSpareRows={1}
                            rowHeaders={true}
                            autoWrapRow={true}
                            autoWrapCol={true}
                            licenseKey="non-commercial-and-evaluation"
                            hiddenColumns={{ columns: [0, 13] }}
                        />

                        <Group justify='flex-end'>
                            <Button
                                variant='light'
                                color='blue'
                                onClick={handleSave2}
                            >
                                Simpan
                            </Button>
                        </Group>
                    </Stack>

                    <Accordion variant="contained" defaultValue="tabel">
                        <Accordion.Item key={2} value="tabel">
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
                                                    render: (record) => kriteria_laporan.indexOf(record) + 1,
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
                                    records={kriteria_laporan}
                                />
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
        </>
    )
}

export default Penilaian