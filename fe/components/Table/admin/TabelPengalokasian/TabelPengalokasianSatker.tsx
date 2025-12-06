'use client'

import { Badge } from '@mantine/core';
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'

const PAGE_SIZES = [10, 15, 20];

const TabelPengalokasianSatker = ({ 
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
  return (
    <>
      <DataTable
        fetching={loading}
        style={{ minHeight: records.length > 0 ? '0' : '180px' }}  
        pinLastColumn
        withTableBorder
        columns={[
          {
              accessor: 'no',
              title: 'No',
              textAlign: 'center',
              width: 40,
              render: (_, index) => (page - 1) * pageSize + (index + 1),
           },
          {
            accessor: 'nama', title: 'SatKer', textAlign: 'left',
          },
          {
            accessor: "kodeSatker",
            title: "Kode Satker",
          },
          {
            accessor: 'provinsi.nama', title: 'Provinsi', textAlign: 'left',
          },
          {
            accessor: "kapasitasSatkerTahunAjaran",
            title: "Kapasitas",
          },
          {
            accessor: "pilihan1",
            title: "Pilihan 1",
          },
          {
            accessor: "pilihan2",
            title: "Pilihan 2",
          },
          {
            accessor: "dialokasikan",
            title: "Dialokasikan",
          },
          {
            accessor: "status",
            title: "Status",
            render: (record) => (
              <Badge
                  color={
                    record.status == "Tersedia"
                      ? "green"
                    : record.status== "Melebihi"
                      ? "red"
                    : record.status == "Terpenuhi"
                      ? "grey"
                    : "gray"
                  }
              >
              {record.status}
              </Badge>
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
    </>
  )
}

export default TabelPengalokasianSatker