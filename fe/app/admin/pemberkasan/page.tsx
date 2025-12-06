'use client'
import { Text, Button, Tabs, Select } from '@mantine/core'
import React, { useState, useEffect } from 'react'
import { IconDownload, IconChevronRight,  IconUser,
  IconMapPin,
  IconCalendar,
  IconBook2,
  IconClipboardList,
  IconStar } from "@tabler/icons-react";
import { getPemberkasan } from '@/utils/pemberkasan';
import { DataTable } from "mantine-datatable";
import * as XLSX from 'xlsx';
import TablePresensiNew from '@/components/Table/TablePresensi/TablePresensiNew';
import clsx from 'clsx'
import classes from '../../../components/Table/TablePresensi/NestedTables.module.css'

const Pengumuman = () => {
  const [loading, setLoading] = useState(true);
  const [mahasiswa, setMahasiswa] = useState([])
  const [penempatan, setPenempatan] = useState([])
  const [penempatanSatker, setPenempatanSatker] = useState([])
  const [kartuBimbingan, setKartuBimbingan] = useState([])
  const [logbookBulanan, setLogbookBulanan] = useState([])
  const [penilaian, setPenilaian] = useState([])
  const [presensi, setPresensi] = useState([])
  const [expandedLogbookIds, setExpandedLogbookIds] = useState<number[]>([]);
  const [selectCategoryPenempatan, setSelectedCategoryPenempatan] = useState<string>("seluruh_mahasiswa");
  const [fetchedTabs, setFetchedTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('biodata_mahasiswa');
  const biodataPagination = usePaginationData(mahasiswa);
  const penempatanPagination = usePaginationData(penempatan);
  const penempatanSatkerPagination = usePaginationData(penempatanSatker);
  const penilaianPagination = usePaginationData(penilaian);

  function usePaginationData<T>(data: T[], initialPageSize = 10) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [records, setRecords] = useState<T[]>([]);

    useEffect(() => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      setRecords(data.slice(from, to));
    }, [data, page, pageSize]);

    return {
      page,
      setPage,
      pageSize,
      setPageSize,
      records,
      total: data.length,
    };
  }

  const handleSelectChange = (value: string | null, option: { label: string; value: string }) => {
    setSelectedCategoryPenempatan(value || "");
  };

  const fetchPemberkasan = async () => {
    setLoading(true)
    const result = await getPemberkasan();

    switch (activeTab) {
      case 'biodata_mahasiswa':
        setMahasiswa(result.data.biodata_mahasiswa);
        break;
      case 'penempatan':
        setPenempatan(result.data.penempatan.seluruhMahasiswa);
        setPenempatanSatker(result.data.penempatan.seluruhSatker);
        break;
      case 'logbook_bulanan':
        const logbook = result.data.logbookBulanan.map((r: any, i: number) => ({ ...r, id: i }));
        setLogbookBulanan(logbook);
        break;
      case 'kartu_bimbingan':
        setKartuBimbingan(result.data.kartu_bimbingan);
        break;
      case 'penilian_mahasiswa':
        setPenilaian(result.data.penilaian);
        break;
      case 'presensi':
        let presensi = result.data.presensi.map((r: any) => ({ ...r, id: r.mahasiswaId }));
        presensi = presensi.sort((a: any, b: any) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
        setPresensi(presensi);
        break;
    }

    setLoading(false);
  };

  useEffect(() => {
    const safeTab = activeTab ?? 'biodata_mahasiswa';
    if (!fetchedTabs.includes(safeTab)) {
      fetchPemberkasan().then(() => {
        setFetchedTabs((prev) => [...prev, safeTab]);
      });
    }
  }, [activeTab, selectCategoryPenempatan]);

  useEffect(() => {
    setFetchedTabs([]);
    // fetchPemberkasan()
  }, [selectCategoryPenempatan])

  const [expandedKartuBimbinganIndex, setExpandedKartuBimbinganIndex] = useState(null);

  const handleExpandedKartuBimbingan = (index: any) => {
    setExpandedKartuBimbinganIndex(expandedKartuBimbinganIndex === index ? null : index);
  };

  const handleExportLogbook = (payload: any) => {
    const prodiHeader = ["Nama Prodi", "Bulan"];
    const prodiValue = [payload.prodi, payload.bulan];

    const emptyRow: any = [];

    const columnHeaders = [
      "Nama",
      "Nim",
      "Prodi",
      "Satker",
      "Bulan",
      "Kegiatan",
      "Kualitas"
    ];

    const mahasiswaData = payload.listMahasiswa.map((student: any) => [
      student.nama,
      student.nim,
      student.prodi,
      student.satker || '-',
      student.bulan || '-',
      student.kegiatan || '-',
      `${student.kualitas}%` || '-'
    ]);

    const data = [
      prodiHeader,
      prodiValue,
      emptyRow,
      columnHeaders,
      ...mahasiswaData
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Logbook Bulanan');

    XLSX.writeFile(wb, `log_book_${payload.bulan}.xlsx`);
  };

  const handleExportBiodataMhs = (payload: any) => {

    const emptyRow: any = [];

    const columnHeaders = [
      "Nama",
      "Nim",
      "Prodi",
      "Kelas",
      "Email selain stis",
      "No Wa",
      "No Orang Tua",
      "Alamat Jakarta",
      "Alamat Rumah",
    ];

    const mahasiswaData = payload.map((student: any) => [
      student.nama,
      student.nim,
      student.prodi,
      student.kelas || '-',
      student.email || '-',
      student.noHp || '-',
      student.noHpWali || '-',
      student.alamat || '-',
      student.alamatWali || '-',
    ]);

    const data = [
      emptyRow,
      columnHeaders,
      ...mahasiswaData
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Biodata Mahasiswa');

    XLSX.writeFile(wb, 'biodata_mahasiswa.xlsx');
  };

  const handleExportPenempatan1 = (payload: any) => {

    const emptyRow: any = [];

    const columnHeaders = [
      "Nim",
      "Nama",
      "Alamat Rumah",
      "Prodi",
      "Kelas",
      "Satker Magang",
      "Provinsi",
    ];

    const mahasiswaData = payload.map((student: any) => [
      student.nim,
      student.nama,
      student.alamatWali || '-',
      student.prodi,
      student.kelas || '-',
      student.penempatan[0]?.satker.nama || '-',
      student.penempatan[0]?.satker.provinsi.nama || '-',
    ]);

    const data = [
      emptyRow,
      columnHeaders,
      ...mahasiswaData
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    const wb = XLSX.utils.book_new();

    // Truncate sheet name to 31 characters
    const sheetName = 'Rekapitulasi Penempatan Seluruh Masiswa'.slice(0, 31);

    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    XLSX.writeFile(wb, 'rekapitulasi_penempatan_seluruh_mahasiswa.xlsx');
  };

  const handleExportPenempatan2 = (payload: any) => {

    const emptyRow: any = [];

    const columnHeaders = [
      "Kode Satker",
      "Nama Satuan Kerja",
      "Provinsi",
      "Jumlah DIV ST",
      "Jumlah DIV KS",
      "Jumlah DIII ST",
      "Jumlah Total",
    ];

    const satkerData = payload.map((satker: any) => [
      satker.kodeSatker,
      satker.satkerName,
      satker.provinsi,
      satker.count1,
      satker.count2,
      satker.count3,
      satker.jumlahTotal,
    ]);

    const data = [
      emptyRow,
      columnHeaders,
      ...satkerData
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    const wb = XLSX.utils.book_new();

    // Truncate sheet name to 31 characters
    const sheetName = 'Rekapitulasi Penempatan Seluruh Satker'.slice(0, 31);

    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    XLSX.writeFile(wb, 'rekapitulasi_penempatan_seluruh_satker.xlsx');
  };

  const handleExportPresensi = (payload: any) => {

    const emptyRow: any = [];

    const columnHeaders = [
      "Nama Mahasiswa",
      "Nim",
      // "Presentase",
      "Jmlh Hadir",
      "Terlambat A",
      "Terlambat B",
      "Terlambat C",
      "Rawat Inap",
      "Dispensasi",
      "Izin",
      "Rawat Jalan",
      "Dinas Luar",
      "Web Error"
    ];

    const mahasiswaData = payload.map((student: any) => [
      student.nama,
      student.nim,
      // `${student.persentaseKehadiran}` || '-',
      student.totalPresensi,
      student.totalTerlambatA || '-',
      student.totalTerlambatB || '-',
      student.totalTerlambatC || '-',
      student.izinRawatInap,
      student.dispensasi || '-',
      student.izin || '-',
      student.izinRawatJalan || '-',
      student.dinasLuar || '-',
      student.webError || '-',
    ]);

    const data = [
      emptyRow,
      columnHeaders,
      ...mahasiswaData
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    const wb = XLSX.utils.book_new();

    // Truncate sheet name to 31 characters
    const sheetName = 'Rekapitulasi Penempatan Seluruh Masiswa'.slice(0, 31);

    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    XLSX.writeFile(wb, 'rekapitulasi_penempatan_seluruh_mahasiswa.xlsx');
  };

  const handleExportKartuBimbingan = (payload: any) => {
    const prodiHeader = ["Nama Prodi"];
    const prodiValue = [payload.prodi];

    const emptyRow: any = [];

    const columnHeaders = [
      "Nama",
      "Nim",
      "Prodi",
      "Dosen Pembimbing",
      "Tanggal Bimbingan",
      "Pokok Bahasan"
    ];

    const mahasiswaData = payload.listMahasiswa.map((student: any) => [
      student.nama,
      student.nim,
      student.prodi,
      student.dosen || 'TBD',
      student.tanggal || 'TBD',
      student.pokokBahasan || 'TBD'
    ]);

    const data = [
      prodiHeader,
      prodiValue,
      emptyRow,
      columnHeaders,
      ...mahasiswaData
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Bimbingan');

    XLSX.writeFile(wb, 'kartu_bimbingan.xlsx');
  };

  const handleExportPenilian = (payload: any) => {

    const emptyRow: any = [];

    const columnHeaders = [
      "Nim",
      "Nama",
      "Prodi",
      "Kelas",
      "Nilai Lap Pemlab",
      "Nilai Lap Dosen",
      "Nilai Kinerja",
      "Nilai Bimbingan",
      "Nilai Akhir"
    ];

    const mahasiswaData = payload.map((student: any) => [
      student.nama,
      student.nim,
      student.prodi,
      student.kelas,
      student.nilaiPemlap,
      student.nilaiDosen,
      student.nilaiKinerja,
      student.nilaiBimbingan,
      student.nilaiAkhir,
    ]);

    const data = [
      emptyRow,
      columnHeaders,
      ...mahasiswaData
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Penilaian');

    XLSX.writeFile(wb, 'penilaian_mahasiswa.xlsx');
  };

  return (
    <>
      <Text c="dimmed" mb="md">Pemberkasan</Text>
      <Tabs variant='outline' defaultValue="biodata_mahasiswa" value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="biodata_mahasiswa" leftSection={<IconUser size={16} />}>
          Biodata Mahasiswa
        </Tabs.Tab>
        <Tabs.Tab value="penempatan" leftSection={<IconMapPin size={16} />}>
          Penempatan
        </Tabs.Tab>
        <Tabs.Tab value="presensi" leftSection={<IconCalendar size={16} />}>
          Presensi
        </Tabs.Tab>
        <Tabs.Tab value="logbook_bulanan" leftSection={<IconBook2 size={16} />}>
          Logbook Bulanan
        </Tabs.Tab>
        <Tabs.Tab value="kartu_bimbingan" leftSection={<IconClipboardList size={16} />}>
          Kartu Bimbingan
        </Tabs.Tab>
        <Tabs.Tab value="penilian_mahasiswa" leftSection={<IconStar size={16} />}>
          Penilaian Mahasiswa
        </Tabs.Tab>
      </Tabs.List>

        <Tabs.Panel value="biodata_mahasiswa">
          <Button type="button" color="blue" variant="light" style={{ marginBottom: "10px", marginTop: "10px" }} onClick={() => handleExportBiodataMhs(mahasiswa)}>
            <IconDownload size={18} style={{ fontWeight: "bold" }} />
            Download
          </Button>
          <DataTable
            fetching={loading}
            highlightOnHover
            withTableBorder
            // withColumnBorders
            // records={mahasiswa}
            records={biodataPagination.records}
            totalRecords={biodataPagination.total}
            page={biodataPagination.page}
            onPageChange={biodataPagination.setPage}
            recordsPerPage={biodataPagination.pageSize}
            onRecordsPerPageChange={biodataPagination.setPageSize}
            recordsPerPageOptions={[10, 15, 20]}
            key={"index"}
            style={{ minHeight: mahasiswa.length > 0 ? '0' : '180px' }}  
            pinLastColumn
            columns={[
              {
                accessor: "nama",
                title: "Nama",
              },
              {
                accessor: "nim",
                title: "Nim",
              },
              {
                accessor: "prodi",
                title: "Prodi",
              },
              {
                accessor: "kelas",
                title: "Kelas",
              },
              {
                accessor: "email",
                title: "Email selain stis",
              },
              {
                accessor: "noHp",
                title: "No Wa",
              },
              {
                accessor: "noHpWali",
                title: "No Orang Tua",
              },
              {
                accessor: "alamat",
                title: "Alamat Jakarta",
              },
              {
                accessor: "alamatWali",
                title: "Alamat Rumah",
                render: (value: any) => value?.alamatWali
              },
            ]}
          />
        </Tabs.Panel>
        <Tabs.Panel value="penempatan">
          <Select
            w={400}
            style={{ marginTop: "10px", marginBottom: "0px" }}
            allowDeselect={false}
            value={selectCategoryPenempatan}
            onChange={handleSelectChange}
            data={[
              {
                label: 'Rekapitulasi Penempatan Seluruh Mahasiswa',
                value: "seluruh_mahasiswa"
              },
              {
                label: 'Rekapitulasi Jumlah Mahasiswa Setiap Satuan Kerja',
                value: "satker"
              }
            ]}
          />
          {
            selectCategoryPenempatan !== "satker" ? (
          <>
          <Button type="button" color="blue" variant="light" style={{ marginBottom: "10px", marginTop: "10px" }} onClick={() => handleExportPenempatan1(penempatan)}>
                  <IconDownload size={18} style={{ fontWeight: "bold" }} />
                  Download
          </Button>
                <DataTable
                  fetching={loading}
                  highlightOnHover
                  withTableBorder
                  // withColumnBorders
                  // records={penempatan}
                  records={penempatanPagination.records}
                  totalRecords={penempatanPagination.total}
                  page={penempatanPagination.page}
                  onPageChange={penempatanPagination.setPage}
                  recordsPerPage={penempatanPagination.pageSize}
                  onRecordsPerPageChange={penempatanPagination.setPageSize}
                  recordsPerPageOptions={[10, 15, 20]}
                  key={"index"}
                  style={{ minHeight: penempatan.length > 0 ? '0' : '180px' }}  
                  pinLastColumn
                  columns={[
                    {
                      accessor: "nim",
                      title: "Nim",
                    },
                    {
                      accessor: "nama",
                      title: "Nama",
                    },
                    {
                      accessor: "alamatWali",
                      title: "Alamat Rumah",
                    },
                    {
                      accessor: "prodi",
                      title: "Prodi",
                    },
                    {
                      accessor: "kelas",
                      title: "Kelas",
                    },
                    {
                      accessor: "satker",
                      title: "Satker Magang",
                      render: (value: any) => value?.penempatan[0]?.satker.nama
                    },
                    {
                      accessor: "provinsi",
                      title: "Provinsi",
                      render: (value: any) => value?.penempatan[0]?.satker.provinsi.nama
                    }
                  ]}
                />
              </>
            ) : (
              <>
                <Button type="button" color="blue" variant="light" style={{ marginBottom: "10px", marginTop: "10px" }} onClick={() => handleExportPenempatan2(penempatanSatker)}>
                  <IconDownload size={18} style={{ fontWeight: "bold" }} />
                  Download
                </Button>
                <DataTable
                  fetching={loading}
                  highlightOnHover
                  withTableBorder
                  // withColumnBorders
                  // records={penempatanSatker}
                  records={penempatanSatkerPagination.records}
                  totalRecords={penempatanSatkerPagination.total}
                  page={penempatanSatkerPagination.page}
                  onPageChange={penempatanSatkerPagination.setPage}
                  recordsPerPage={penempatanSatkerPagination.pageSize}
                  onRecordsPerPageChange={penempatanSatkerPagination.setPageSize}
                  recordsPerPageOptions={[10, 15, 20]}
                  key={"index"}
                  style={{ minHeight: penempatanSatker.length > 0 ? '0' : '180px' }}  
                  pinLastColumn
                  columns={[
                    {
                      accessor: "kodeSatker",
                      title: "Kode Satker",
                    },
                    {
                      accessor: "satkerName",
                      title: "Satuan Kerja",
                    },
                    {
                      accessor: "provinsi",
                      title: "Provinsi",
                    },
                    {
                      accessor: "count1",
                      title: "Jumlah DIV ST",
                    },
                    {
                      accessor: "count2",
                      title: "Jumlah DIV KS",
                    },
                    {
                      accessor: "count3",
                      title: "Jumlah DIII ST",
                    },
                    {
                      accessor: "jumlahTotal",
                      title: "Jumlah Total",
                    }
                  ]}
                />
              </>
            )
          }

        </Tabs.Panel>
        <Tabs.Panel value="presensi">
          <Button type="button" color="blue" variant="light" style={{ marginBottom: "10px", marginTop: "10px" }} onClick={() => handleExportPresensi(presensi)}>
            <IconDownload size={18} style={{ fontWeight: "bold" }} />
            Download
          </Button>
          <TablePresensiNew records={presensi} loading={loading} />
        </Tabs.Panel>
        <Tabs.Panel value="logbook_bulanan">
          <DataTable
            fetching={loading}
            highlightOnHover
            withTableBorder
            // withColumnBorders
            records={logbookBulanan}
            key={"index"}
            style={{ minHeight: logbookBulanan.length > 0 ? '0' : '180px', marginTop:"15px" }}  
            pinLastColumn
            columns={[
              {
                accessor: 'id',
                title: 'ID Mahasiswa',
                hidden: true,
              },
              {
                accessor: 'prodi',
                title: 'Prodi',
                textAlign: 'left',
                render: ({ id, prodi }) => (
                  <>
                    <IconChevronRight
                      className={clsx(classes.icon, classes.expandIcon, {
                        [classes.expandIconRotated]: expandedLogbookIds.includes(id),
                      })}
                    />
                    <span>{prodi}</span>
                  </>
                ),

              },
              {
                accessor: "bulan",
                title: "Bulan",
              },
              {
                accessor: "download",
                title: "Download",
                render: (value: any) => (
                  <IconDownload size={18} style={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => handleExportLogbook(value)} />
                )
              },
            ]}
            rowExpansion={{
              allowMultiple: false,
              expanded: { recordIds: expandedLogbookIds, onRecordIdsChange: setExpandedLogbookIds },
              content: ({ record }) =>
              (
                <DataTable
                  fetching={loading}
                  highlightOnHover
                  withTableBorder
                  // withColumnBorders
                  records={record.listMahasiswa}
                  style={{ minHeight: record.listMahasiswa.length > 0 ? '0' : '180px' }}  
                  pinLastColumn
                  columns={[
                    {
                      accessor: "nama",
                      title: "Nama",
                    },
                    {
                      accessor: "nim",
                      title: "Nim",
                    },
                    {
                      accessor: "prodi",
                      title: "Prodi",
                    },
                    {
                      accessor: "satker",
                      title: "Satker",
                    },
                    {
                      accessor: "bulan",
                      title: "Bulan",
                    },
                    {
                      accessor: "kegiatan",
                      title: "Kegiatan",
                    },
                    {
                      accessor: "tim",
                      title: "Tim Kerja",
                    },
                    {
                      accessor: "kualitas",
                      title: "Kualitas",
                      render: (value) => `${value.kualitas}%`
                    },
                  ]}
                />
              )
            }}
          />
        </Tabs.Panel>
        <Tabs.Panel value="kartu_bimbingan">
          <DataTable
            fetching={loading}
            highlightOnHover
            withTableBorder
            // withColumnBorders
            records={kartuBimbingan}
            key={"index"}
            style={{ minHeight: kartuBimbingan.length > 0 ? '0' : '180px', marginTop:"15px" }}  
            pinLastColumn
            columns={[

              {
                accessor: "prodi",
                title: "Prodi",
              },
              {
                accessor: "download",
                title: "Download",
                render: (value: any) => (
                  <IconDownload size={18} style={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => handleExportKartuBimbingan(value)} />
                )
              },
            ]}
            onRowClick={(row) => handleExpandedKartuBimbingan(row.index)}
            rowExpansion={{
              allowMultiple: false,
              content: ({ record }: any) => {
                return expandedKartuBimbinganIndex !== null && expandedKartuBimbinganIndex === record.index ? (
                  <DataTable
                    fetching={loading}
                    highlightOnHover
                    withTableBorder
                    // withColumnBorders
                    records={record.listMahasiswa}
                    style={{ minHeight: record.listMahasiswa.length > 0 ? '0' : '180px' }}  
                    pinLastColumn
                    columns={[
                      {
                        accessor: "nama",
                        title: "Nama",
                      },
                      {
                        accessor: "nim",
                        title: "Nim",
                      },
                      {
                        accessor: "prodi",
                        title: "Prodi",
                      },
                      {
                        accessor: "dosen",
                        title: "Dosen Pembimbing",
                      },
                      {
                        accessor: "tanggal",
                        title: "Tanggal Bimbingan",
                      },
                      {
                        accessor: "pokokBahasan",
                        title: "Pokok Bahasan",
                      },
                    ]}
                  />
                ) : null;
              },
            }}
          />
        </Tabs.Panel>
        <Tabs.Panel value="penilian_mahasiswa">
          <Button type="button" color="blue" variant="light" style={{ marginBottom: "10px", marginTop: "10px" }} onClick={() => handleExportPenilian(penilaian)}>
            <IconDownload size={18} style={{ fontWeight: "bold" }} />
            Download
          </Button>
          <DataTable
            fetching={loading}
            highlightOnHover
            withTableBorder
            // withColumnBorders
            // records={penilaian}
            records={penilaianPagination.records}
            totalRecords={penilaianPagination.total}
            page={penilaianPagination.page}
            onPageChange={penilaianPagination.setPage}
            recordsPerPage={penilaianPagination.pageSize}
            onRecordsPerPageChange={penilaianPagination.setPageSize}
            recordsPerPageOptions={[10, 15, 20]}
            key={"index"}
            style={{ minHeight: penilaian.length > 0 ? '0' : '180px' }}  
            pinLastColumn
            columns={[
              {
                accessor: "nim",
                title: "Nim",
              },
              {
                accessor: "nama",
                title: "Nama",
              },
              {
                accessor: "prodi",
                title: "Prodi",
              },
              {
                accessor: "kelas",
                title: "Kelas",
              },
              {
                accessor: "nilaiPemlap",
                title: "Nilai Lap Pemlab",
              },
              {
                accessor: "nilaiDosen",
                title: "Nilai Lap Dosen",
              },
              {
                accessor: "nilaiKinerja",
                title: "Nilai Kinerja",
              },
              {
                accessor: "nilaiBimbingan",
                title: "Nilai Bimbingan",
              },
              {
                accessor: "nilaiAkhir",
                title: "Nilai Akhir",
              },
            ]}
          />
        </Tabs.Panel>
      </Tabs>
    </>
  )
}


export default Pengumuman