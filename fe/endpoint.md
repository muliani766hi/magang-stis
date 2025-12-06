## User Mahasiswa Endpoints

### Get All Mahasiswa

- Method: `GET`
- URL: `/api/mahasiswa`
- Request:

  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:

    - No Body

- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Data Mahasiswa Berhasil Diambil",
      "data": [
        {
          "id": 1,
          "nim": "123",
          "nama": "Joe Biden",
          "kelas": "4SI3",
          "pembimbing_lapangan": "John Doe",
          "dosen_pembimbing": "John Doe",
          "tempat_magang": "PT. Indofood",
          "alamat": "Jl. Raya Bogor, Bogor, Jawa Barat, Indonesia"
        },
        {
          "id": 2,
          "nim": "123",
          "nama": "Joe Biden",
          "kelas": "4SI3",
          "pembimbing_lapangan": "John Doe",
          "dosen_pembimbing": "John Doe",
          "tempat_magang": "PT. Indofood",
          "alamat": "Jl. Raya Bogor, Bogor, Jawa Barat, Indonesia"
        }
        ...
      ]
    }
    ```

### Edit Mahasiswa

- Method: `PUT`
- URL: `/api/mahasiswa/{id}`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "nim": "123",
      "nama": "Joe Biden",
      "kelas": "4SI3",
      "pembimbing_lapangan": "John Doe",
      "dosen_pembimbing": "John Doe",
      "tempat_magang": "PT. Indofood",
      "alamat": "Jl. Raya Bogor, Bogor, Jawa Barat, Indonesia"
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Data Mahasiswa Berhasil Diubah",
      "data": {
        "id": 1,
        "nim": "123",
        "nama": "Joe Biden",
        "kelas": "4SI3",
        "pembimbing_lapangan": "John Doe",
        "dosen_pembimbing": "John Doe",
        "tempat_magang": "PT. Indofood",
        "alamat": "Jl. Raya Bogor, Bogor, Jawa Barat, Indonesia"
      }
    }
    ```

### Delete Mahasiswa

- Method: `DELETE`
- URL: `/api/mahasiswa/{id}`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Data Mahasiswa Berhasil Dihapus",
      "data": {
        "id": 1,
        "nim": "123",
        "nama": "Joe Biden",
        "kelas": "4SI3",
        "pembimbing_lapangan": "John Doe",
        "dosen_pembimbing": "John Doe",
        "tempat_magang": "PT. Indofood",
        "alamat": "Jl. Raya Bogor, Bogor, Jawa Barat, Indonesia"
      }
    }
    ```

### Add Mahasiswa menggunakan file excel

- Method: `POST`
- URL: `/api/mahasiswa/excel`
- Request:
  - Header:
    - Content-Type: multipart/form-data
    - Accept: application/json
  - Body:
    - file: file excel
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
    "status": "success",
    "message": "Data Mahasiswa Berhasil Ditambahkan",
    "data": [
        {
        "id": 1,
        "nim": "123",
        "nama": "Joe Biden",
        "kelas": "4SI3",
        "pembimbing_lapangan": "John Doe",
        "dosen_pembimbing": "John Doe",
        "tempat_magang": "PT. Indofood",
        "alamat": "Jl. Raya Bogor, Bogor, Jawa Barat, Indonesia"
        },
        {
        "id": 2,
        "nim": "123",
        "nama": "Joe Biden",
        "kelas": "4SI3",
        "pembimbing_lapangan": "John Doe",
        "dosen_pembimbing": "John Doe",
        "tempat_magang": "PT. Indofood",
        "alamat": "Jl. Raya Bogor, Bogor, Jawa Barat, Indonesia"
        }
        ...
    ]
    }
    ```

## User Dosen Pembimbing Endpoints

### Get All Dosen Pembimbing

- Method: `GET`
- URL: `/api/dosen-pembimbing`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
    "status": "success",
    "message": "Data Dosen Pembimbing Berhasil Diambil",
    "data": [
        {
        "id": 1,
        "nip": "123",
        "nama": "John Doe",
        "email": "johndoe@ac.com",
        },
        {
        "id": 2,
        "nip": "123",
        "nama": "John Doe",
        "email": "johndoe@ac.com",
        }
        ...
    ]
    }
    ```

### Edit Dosen Pembimbing

- Method: `PUT`
- URL: `/api/dosen-pembimbing/{id}`
- Request:

  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "nip": "123",
      "nama": "John Doe",
      "email": "johndoe@ac.id"
    }
    ```

- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Data Dosen Pembimbing Berhasil Diubah",
      "data": {
        "id": 1,
        "nip": "123",
        "nama": "John Doe",
        "email": "johndoe@ac.id"
      }
    }
    ```

### Delete Dosen Pembimbing

- Method: `DELETE`
- URL: `/api/dosen-pembimbing/{id}`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Data Dosen Pembimbing Berhasil Dihapus",
      "data": {
        "id": 1,
        "nip": "123",
        "nama": "John Doe",
        "email": "johndoe@ac.id"
      }
    }
    ```

### Add Dosen Pembimbing

- Method: `POST`
- URL: `/api/dosen-pembimbing`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "nip": "123",
      "nama": "John Doe",
      "email": "johndoe@ac.id"
    }
    ```
- Response:

  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "status": "success",
      "message": "Data Dosen Pembimbing Berhasil Ditambahkan",
      "data": {
        "id": 1,
        "nip": "123",
        "nama": "John Doe",
        "email": "johndoe@ac.id"
      }
    }
    ```

### Get All Mahasiswa by Dosen Pembimbing

- Method: `GET`
- URL: `/api/dosen-pembimbing/{id}/mahasiswa` // ini ngikut
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
    "status": "success",
    "message": "Data Mahasiswa Berhasil Diambil",
    "data": [
        {
        "id": 1,
        "nim": "123",
        "nama": "Joe Biden",
        "kelas": "4SI3",
        "pembimbing_lapangan": "John Doe",
        "dosen_pembimbing": "John Doe",
        "tempat_magang": "PT. Indofood",
        "alamat": "Jl. Raya Bogor, Bogor, Jawa Barat, Indonesia"
        },
        {
        "id": 2,
        "nim": "123",
        "nama": "Joe Biden",
        "kelas": "4SI3",
        "pembimbing_lapangan": "John Doe",
        "dosen_pembimbing": "John Doe",
        "tempat_magang": "PT. Indofood",
        "alamat": "Jl. Raya Bogor, Bogor, Jawa Barat, Indonesia"
        }
        ...
    ]
    }
    ```

## User Pembimbing Lapangan Endpoints

### Get All Pembimbing Lapangan

- Method: `GET`
- URL: `/api/pembimbing-lapangan`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
    "status": "success",
    "message": "Data Pembimbing Lapangan Berhasil Diambil",
    "data": [
        {
        "id": 1,
        "nip": "123",
        "nama": "John Doe",
        "email": "johndoe@ac.id",
        "satker": "BPS Kabupaten Bogor"
        },
        {
        "id": 2,
        "nip": "123",
        "nama": "John Doe",
        "email": "johndoe@ac.id",
        "satker": "BPS Kabupaten Bogor"
        }
        ...
    ]
    }
    ```

### Edit Pembimbing Lapangan

- Method: `PUT`
- URL: `/api/pembimbing-lapangan/{id}`
- Request:

  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:

    ```json
    {
      "nip": "123",
      "nama": "John Doe",
      "email": "johndoe@ac.id",
      "satker": "BPS Kabupaten Bogor"
    }
    ```

- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Data Pembimbing Lapangan Berhasil Diubah",
      "data": {
        "id": 1,
        "nip": "123",
        "nama": "John Doe",
        "email": "johndoe@ac.id",
        "satker": "BPS Kabupaten Bogor"
      }
    }
    ```

### Delete Pembimbing Lapangan

- Method: `DELETE`
- URL: `/api/pembimbing-lapangan/{id}`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:

  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "status": "success",
      "message": "Data Pembimbing Lapangan Berhasil Dihapus",
      "data": {
        "id": 1,
        "nip": "123",
        "nama": "John Doe",
        "email": "johndoe@ac.id",
        "satker": "BPS Kabupaten Bogor"
      }
    }
    ```

### Add Pembimbing Lapangan

- Method: `POST`
- URL: `/api/pembimbing-lapangan`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "nip": "123",
      "nama": "John Doe",
      "email": "johndoe@ac.id",
      "satker": "BPS Kabupaten Bogor"
    }
    ```
- Response: - Status: `200` - Header:
  - Content-Type: application/json
  - Body:
  ```json
  {
    "status": "success",
    "message": "Data Pembimbing Lapangan Berhasil Ditambahkan",
    "data": {
      "id": 1,
      "nip": "123",
      "nama": "John Doe",
      "email": "johndoe@ac.id",
      "satker": "BPS Kabupaten Bogor"
    }
  }
  ```

### Get All Mahasiswa by Pembimbing Lapangan

- Method: `GET`
- URL: `/api/pembimbing-lapangan/{id}/mahasiswa` // ini ngikut
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
    "status": "success",
    "message": "Data Mahasiswa Berhasil Diambil",
    "data": [
        {
        "id": 1,
        "nim": "123",
        "nama": "Joe Biden",
        "kelas": "4SI3",
        "pembimbing_lapangan": "John Doe",
        "dosen_pembimbing": "John Doe",
        "tempat_magang": "PT. Indofood",
        "alamat": "Jl. Raya Bogor, Bogor, Jawa Barat, Indonesia"
        },
        {
        "id": 2,
        "nim": "123",
        "nama": "Joe Biden",
        "kelas": "4SI3",
        "pembimbing_lapangan": "John Doe",
        "dosen_pembimbing": "John Doe",
        "tempat_magang": "PT. Indofood",
        "alamat": "Jl. Raya Bogor, Bogor, Jawa Barat, Indonesia"
        }
        ...
    ]
    }
    ```

### Ganti User Pembimbing Lapangan

- Method: `PUT` ////////////////

## Unit Kerja Endpoints

### Get All Unit Kerja

- Method: `GET`
- URL: `/api/unit-kerja`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:

  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:

    ```json
    {
    "status": "success",
    "message": "Data Unit Kerja Berhasil Diambil",
    "data": [
        {
        "id": 1,
        "nama": "BPS Kabupaten Kediri",
        "alamat": "Jl. Raya Kediri, Kediri, Jawa Timur, Indonesia",
        "email": "bps5604@bps.go.id",
        "kabupaten_kota": "Kediri",
        "provinsi": "Jawa Timur",
        "kode": 5604,
        "kapasitas": 5
        },
        {
        "id": 2,
        "nama": "BPS Kabupaten Kediri",
        "alamat": "Jl. Raya Kediri, Kediri, Jawa Timur, Indonesia",
       "email": "bps5604@bps.go.id",
        "kabupaten_kota": "Kediri",
        "provinsi": "Jawa Timur",
        "kode": 5604,
        "kapasitas": 5
        }
        ...
    ]
    }
    ```

### Edit Unit Kerja

- Method: `PUT`
- URL: `/api/unit-kerja/{id}`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "nama": "BPS Kabupaten Kediri",
      "alamat": "Jl. Raya Kediri, Kediri, Jawa Timur, Indonesia",
      "email": "bps5604@bps.go.id",
      "kabupaten_kota": "Kediri",
      "provinsi": "Jawa Timur",
      "kode": 5604,
      "kapasitas": 5
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Data Unit Kerja Berhasil Diubah",
      "data": {
        "id": 1,
        "nama": "BPS Kabupaten Kediri",
        "alamat": "Jl. Raya Kediri, Kediri, Jawa Timur, Indonesia",
        "email": "bps5604@bps.go.id",
        "kabupaten_kota": "Kediri",
        "provinsi": "Jawa Timur",
        "kode": 5604,
        "kapasitas": 5
      }
    }
    ```

### Delete Unit Kerja

- Method: `DELETE`
- URL: `/api/unit-kerja/{id}`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Data Unit Kerja Berhasil Dihapus",
      "data": {
        "id": 1,
        "nama": "BPS Kabupaten Kediri",
        "alamat": "Jl. Raya Kediri, Kediri, Jawa Timur, Indonesia",
        "email": "bps5604@bps.go.id",
        "kabupaten_kota": "Kediri",
        "provinsi": "Jawa Timur",
        "kode": 5604,
        "kapasitas": 5
      }
    }
    ```

### Add Unit Kerja

- Method: `POST`
- URL: `/api/unit-kerja`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "nama": "BPS Kabupaten Kediri",
      "alamat": "Jl. Raya Kediri, Kediri, Jawa Timur, Indonesia",
      "email": "bps5604@bps.go.id",
      "kabupaten_kota": "Kediri",
      "provinsi": "Jawa Timur",
      "kode": 5604,
      "kapasitas": 5
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Data Unit Kerja Berhasil Ditambahkan",
      "data": {
        "id": 1,
        "nama": "BPS Kabupaten Kediri",
        "alamat": "Jl. Raya Kediri, Kediri, Jawa Timur, Indonesia",
        "email": "bps5604@bps.go.id",
        "kabupaten_kota": "Kediri",
        "provinsi": "Jawa Timur",
        "kode": 5604,
        "kapasitas": 5
      }
    }
    ```

### Get Unit Kerja by Provinsi

- Method: `GET`
- URL: `/api/unit-kerja/{provinsi}`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
    "status": "success",
    "message": "Data Unit Kerja Berhasil Diambil",
    "data": [
        {
        "id": 1,
        "nama": "BPS Kabupaten Kediri",
        "alamat": "Jl. Raya Kediri, Kediri, Jawa Timur, Indonesia",
        "email": "bps5604@bps.go.id",
        "kabupaten_kota": "Kediri",
        "provinsi": "Jawa Timur",
        "kode": 5604,
        "kapasitas": 5
        },
        {
        "id": 2,
        "nama": "BPS Kabupaten Kediri",
        "alamat": "Jl. Raya Kediri, Kediri, Jawa Timur, Indonesia",
        "email": "bps5604@bps.go.id",
        "kabupaten_kota": "Kediri",
        "provinsi": "Jawa Timur",
         "kode": 5604,
        "kapasitas": 5
        }
        ...
    ]
    }
    ```

## Pemilihan Penempatan Endpoints

### Get All Pemilihan Penempatan

- Method: `GET`
- URL: `/api/pemilihan-penempatan`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
    "status": "success",
    "message": "Data Pemilihan Penempatan Berhasil Diambil",
    "data": [
        {
            "id": 1, // id pemilihan penempatan
            "nama_mahasiswa": "John Doe",
            "nim_mahasiswa": 123,
            "alamat_mahasiswa": "Jl. Raya Pajajaran No. 1, Bogor",
            "nama_unit_kerja": "BPS Kabupaten Bogor",
            "status": "Disetujui"
        }, {
            "id": 2,
            "nama_mahasiswa": "Jane Doe",
            "nim_mahasiswa": 124,
            "alamat_mahasiswa": "Jl. Raya Pajajaran No. 1, Bogor",
            "nama_unit_kerja":" BPS Kabupaten Bogor",
            "status": "Ditolak"
        },
        ...
    ]
    }
    ```

### Get Pemilihan Penempatan by Provinsi

- Method: `GET`
- URL: `/api/pemilihan-penempatan/{provinsi}`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
    "status": "success",
    "message": "Data Pemilihan Penempatan Berhasil Diambil",
    "data": [
        {
            "id": 1,
            "nama_mahasiswa": "John Doe",
            "nim_mahasiswa": 123,
            "alamat_mahasiswa": "Jl. Raya Pajajaran No. 1, Bogor",
            "nama_unit_kerja": "BPS Kabupaten Bogor",
            "status": "Disetujui"
        }, {
            "id": 2,
            "nama_mahasiswa": "Jane Doe",
            "nim_mahasiswa": 124,
            "alamat_mahasiswa": "Jl. Raya Pajajaran No. 1, Bogor",
            "nama_unit_kerja":" BPS Kabupaten Bogor",
            "status": "Ditolak"
        },
        ...
    ]
    }
    ```

### Konfirmasi Pemilihan Penempatan

- Method: `PUT`
- URL: `/api/pemilihan-penempatan/{id}` // id pemilihan penempatan mending pake url atau body?
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "status": "Disetujui" // atau "Ditolak" atau "Menunggu" atau "Diubah"
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Pemilihan Penempatan Berhasil Diubah",
      "data": {
        "id": 1,
        "nama_mahasiswa": "John Doe",
        "nim_mahasiswa": 123,
        "alamat_mahasiswa": "Jl. Raya Pajajaran No. 1, Bogor",
        "nama_unit_kerja": "BPS Kabupaten Bogor",
        "status": "Disetujui"
      }
    }
    ```

### Add Pemilihan Penempatan

- Method: `POST`
- URL: `/api/pemilihan-penempatan`
- Request:

  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:

    ```json
    {
      "nama_mahasiswa": "John Doe",
      "nim_mahasiswa": 123,
      "alamat_mahasiswa": "Jl. Raya Pajajaran No. 1, Bogor",
      "pilihan_unit_kerja": {
        // ini pilihan unit kerja ngikut gimana enaknya
        "pilihan1": "BPS Kabupaten Bogor",
        "pilihan2": "BPS Kabupaten Kediri",
        "pilihan3": "BPS Jakarta Selatan"
      },
      "status": "Menunggu"
    }
    ```

- Response: - Status: `200` - Header:
  - Content-Type: application/json
  - Body:
  ```json
  {
    "status": "success",
    "message": "Pemilihan Penempatan Berhasil Ditambahkan"
  }
  ```

### Delete Pemilihan Penempatan

- Method: `DELETE`
- URL: `/api/pemilihan-penempatan/{id}`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Pemilihan Penempatan Berhasil Dihapus"
    }
    ```

## Bimbingan Magang Mahasiswa Endpoints

### Get Bimbingan Magang by Mahasiswa

- Method: `GET`
- URL: `/api/bimbingan-magang/mahasiswa/{id}` // id mahasiswa
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
    "status": "success",
    "message": "Data Bimbingan Magang Berhasil Diambil",
    "data": [
        {
        "id": 1,
        "tanggal": "2021-08-01",
        "jenis": "Bimbingan 1",
        "deskripsi": "Melaporkan Kegiatan Magang",
        "status": "Disetujui",
        "link_online_meet": "https://meet.google.com/abc-def-ghi"
        },
        {
        "id": 2,
        "tanggal": "2021-08-02",
        "jenis": "Bimbingan 2",
        "deskripsi": "Melaporkan progres laporan magang",
        "status": "Menunggu",
        "link_online_meet": ""
        }
        ...
    ]
    }
    ```

### Add Bimbingan Magang

- Method: `POST`
- URL: `/api/bimbingan-magang`
- Request:

  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:

    ```json
    {
      "id_mahasiswa": 1,
      "tanggal": "2021-08-01",
      "jenis": "Bimbingan 1",
      "deskripsi": "Melaporkan Kegiatan Magang",
      "status": "Menunggu"
    }
    ```

- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Bimbingan Magang Berhasil Ditambahkan"
    }
    ```

### Edit Bimbingan Magang by Mahasiswa

- Method: `PUT`
- URL: `/api/bimbingan-magang/{id}` // id bimbingan magang
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "id_mahasiswa": 1,
      "tanggal": "2021-08-01",
      "jenis": "Bimbingan 1",
      "deskripsi": "Melaporkan Kegiatan Magang"
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Bimbingan Magang Berhasil Diubah"
    }
    ```

## Bimbingan Magang Dosen Pembimbing Endpoints

### Get Bimbingan Magang by Dosen Pembimbing

- Method: `GET`
- URL: `/api/bimbingan-magang/dosen-pembimbing/{id}` // id dosen pembimbing
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
    "status": "success",
    "message": "Data Bimbingan Magang Berhasil Diambil",
    "data": [
       {
        "id": 1,
        "id_mahasiswa": 1,
        "nama_mahasiswa": "John Doe",
        "nim_mahasiswa": 123345678,
        "tanggal": "2021-08-01",
        "jenis": "Bimbingan 1",
        "deskripsi": "Melaporkan Kegiatan Magang",
        "status": "Disetujui",
        "link_online_meet": "https://meet.google.com/abc-def-ghi"
        },
        {
        "id": 2,
        "id_mahasiswa": 1,
        "nama_mahasiswa": "John Doe",
        "nim_mahasiswa": 123345678,
        "tanggal": "2021-08-02",
        "jenis": "Bimbingan 2",
        "deskripsi": "Melaporkan progres laporan magang",
        "status": "Menunggu",
        "link_online_meet": ""
        }
        ...
    ]
    }
    ```

### Konfirmasi Bimbingan Magang

- Method: `PUT`
- URL: `/api/bimbingan-magang/{id}` // id bimbingan magang
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "link_online_meet": "https://meet.google.com/abc-def-ghi", //optional
      "status": "Disetujui" // atau "Ditolak" atau "Menunggu" atau "Diubah"
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Bimbingan Magang Berhasil Diubah"
    }
    ```

### Add Bimbingan Magang by Dosen Pembimbing

- Method: `POST`
- URL: `/api/bimbingan-magang`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "tanggal": "2021-08-01",
      "peserta": [
        {
          "id_mahasiswa": 1
        },
        {
          "id_mahasiswa": 2
        }
      ]
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Bimbingan Magang Berhasil Ditambahkan"
    }
    ```

## Bimbingan Skripsi Mahasiswa Endpoints

### Get Bimbingan Skripsi by Mahasiswa

- Method: `GET`
- URL: `/api/bimbingan-skripsi/mahasiswa/{id}` // id mahasiswa
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
    "status": "success",
    "message": "Data Bimbingan Skripsi Berhasil Diambil",
    "data": [
        {
        "id": 1,
        "tanggal": "2021-08-01",
        "jenis": "Bimbingan 1",
        "deskripsi": "Melaporkan Progres Skripsi",
        "status": "Disetujui",
        },
        {
        "id": 2,
        "tanggal": "2021-08-02",
        "jenis": "Bimbingan 2",
        "deskripsi": "Melaporkan progres laporan skripsi",
        "status": "Menunggu",
        }
        ...
    ]
    }
    ```

### Add Bimbingan Skripsi

- Method: `POST`
- URL: `/api/bimbingan-skripsi`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "id_mahasiswa": 1,
      "tanggal": "2021-08-01",
      "jenis": "Bimbingan 1",
      "deskripsi": "Melaporkan Progres Skripsi",
      "status": "Menunggu"
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Bimbingan Skripsi Berhasil Ditambahkan"
    }
    ```

### Edit Bimbingan Skripsi by Mahasiswa

- Method: `PUT`
- URL: `/api/bimbingan-skripsi/{id}` // id bimbingan skripsi
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "id_mahasiswa": 1,
      "tanggal": "2021-08-01",
      "jenis": "Bimbingan 1",
      "deskripsi": "Melaporkan Progres Skripsi"
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Bimbingan Skripsi Berhasil Diubah"
    }
    ```

## Bimbingan Skripsi Dosen Pembimbing Endpoints

### Get Bimbingan Skripsi by Dosen Pembimbing

- Method: `GET`
- URL: `/api/bimbingan-skripsi/dosen-pembimbing/{id}` // id dosen pembimbing
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
    "status": "success",
    "message": "Data Bimbingan Skripsi Berhasil Diambil",
    "data": [
        {
        "id": 1,
        "id_mahasiswa": 1,
        "nama_mahasiswa": "John Doe",
        "nim_mahasiswa": 123345678,
        "tanggal": "2021-08-01",
        "jenis": "Bimbingan 1",
        "deskripsi": "Melaporkan Progres Skripsi",
        "status": "Disetujui",
        },
        {
        "id": 2,
        "id_mahasiswa": 1,
        "nama_mahasiswa": "John Doe",
        "nim_mahasiswa": 123345678,
        "tanggal": "2021-08-02",
        "jenis": "Bimbingan 2",
        "deskripsi": "Melaporkan progres laporan skripsi",
        "status": "Menunggu",
        }
        ...
    ]
    }
    ```

### Konfirmasi Bimbingan Skripsi

- Method: `PUT`
- URL: `/api/bimbingan-skripsi/{id}` // id bimbingan skripsi
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "status": "Disetujui" // atau "Ditolak" atau "Menunggu" atau "Diubah"
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Bimbingan Skripsi Berhasil Diubah"
    }
    ```

## Kegiatan Harian Mahasiswa Endpoints

### Get Kegiatan Harian by Mahasiswa

- Method: `GET`
- URL: `/api/kegiatan-harian/mahasiswa/{id}` // id mahasiswa
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
    "status": "success",
    "message": "Data Kegiatan Harian Berhasil Diambil",
    "data": [
        {
          "id": 1,
          "tanggal_kegiatan": "2021-08-01",
          "deskripsi_kegiatan": "Menginput data ke dalam sistem",
          "volume": 10,
          "satuan": "data",
          "durasi": "2 jam",
          "pemberi_tugas": "Pak Budi",
          "status_penyelesaian": "Belum Selesai"
        },
        {
          "id": 2,
          "tanggal_kegiatan": "2021-08-02",
          "deskripsi_kegiatan": "Menginput data ke dalam sistem",
          "volume": 10,
          "satuan": "data",
          "durasi": "2 jam",
          "pemberi_tugas": "Pak Budi",
          "status_penyelesaian": "Belum Selesai"
        }
        ...
    ]
    }
    ```

### Add Kegiatan Harian

- Method: `POST`
- URL: `/api/kegiatan-harian`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "id_mahasiswa": 1,
      "tanggal_kegiatan": "2021-08-01",
      "deskripsi_kegiatan": "Menginput data ke dalam sistem",
      "volume": 10,
      "satuan": "data",
      "durasi": "2 jam",
      "pemberi_tugas": "Pak Budi",
      "status_penyelesaian": "Belum Selesai"
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Kegiatan Harian Berhasil Ditambahkan"
    }
    ```

### Edit Kegiatan Harian by Mahasiswa

- Method: `PUT`
- URL: `/api/kegiatan-harian/{id}` // id kegiatan harian
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "id_mahasiswa": 1,
      "tanggal_kegiatan": "2021-08-01",
      "deskripsi_kegiatan": "Menginput data ke dalam sistem",
      "volume": 10,
      "satuan": "data",
      "durasi": "2 jam",
      "pemberi_tugas": "Pak Budi",
      "status_penyelesaian": "Belum Selesai"
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Kegiatan Harian Berhasil Diubah"
    }
    ```

## Kegiatan Harian Pembimbing Lapangan Endpoints ////////////////

### Get Kegiatan Harian by Pembimbing Lapangan

- Method: `GET`
- URL: `/api/kegiatan-harian/pembimbing-lapangan/{id}` // id pembimbing lapangan
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
    "status": "success",
    "message": "Data Kegiatan Harian Berhasil Diambil",
    "data": [
        {
          "id": 1,
          "id_mahasiswa": 1,
          "nama_mahasiswa": "John Doe",
          "nim_mahasiswa": 123345678,
          "tanggal_kegiatan": "2021-08-01",
          "deskripsi_kegiatan": "Menginput data ke dalam sistem",
          "volume": 10,
          "satuan": "data",
          "durasi": "2 jam",
          "pemberi_tugas": "Pak Budi",
          "status_penyelesaian": "Belum Selesai"
        },
        {
          "id": 2,
          "id_mahasiswa": 1,
          "nama_mahasiswa": "John Doe",
          "nim_mahasiswa": 123345678,
          "tanggal_kegiatan": "2021-08-02",
          "deskripsi_kegiatan": "Menginput data ke dalam sistem",
          "volume": 10,
          "satuan": "data",
          "durasi": "2 jam",
          "pemberi_tugas": "Pak Budi",
          "status_penyelesaian": "Belum Selesai"
        }
        ...
    ]
    }
    ```

### Konfirmasi Kegiatan Harian

- Method: `PUT`
- URL: `/api/kegiatan-harian/{id}` // id kegiatan harian
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "status_penyelesaian": "Selesai" // atau "Belum Selesai" atau "Diubah"
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Kegiatan Harian Berhasil Diubah"
    }
    ```

## Kegiatan Harian Dosen Pembimbing Endpoints ////////////////

### Get Kegiatan Harian by Dosen Pembimbing

- Method: `GET`
- URL: `/api/kegiatan-harian/dosen-pembimbing/{id}` // id dosen pembimbing
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
    "status": "success",
    "message": "Data Kegiatan Harian Berhasil Diambil",
    "data": [
        {
          "id": 1,
          "id_mahasiswa": 1,
          "nama_mahasiswa": "John Doe",
          "nim_mahasiswa": 123345678,
          "tanggal_kegiatan": "2021-08-01",
          "deskripsi_kegiatan": "Menginput data ke dalam sistem",
          "volume": 10,
          "satuan": "data",
          "durasi": "2 jam",
          "pemberi_tugas": "Pak Budi",
          "status_penyelesaian": "Belum Selesai"
        },
        {
          "id": 2,
          "id_mahasiswa": 1,
          "nama_mahasiswa": "John Doe",
          "nim_mahasiswa": 123345678,
          "tanggal_kegiatan": "2021-08-02",
          "deskripsi_kegiatan": "Menginput data ke dalam sistem",
          "volume": 10,
          "satuan": "data",
          "durasi": "2 jam",
          "pemberi_tugas": "Pak Budi",
          "status_penyelesaian": "Belum Selesai"
        }
        ...
    ]
    }
    ```

## Rekapitulasi Kegiatan Bulanan Mahasiswa Endpoints

### Get Rekapitulasi Kegiatan Bulanan by Mahasiswa

- Method: `GET`
- URL: `/api/kegiatan-bulanan/mahasiswa/{id}` // id mahasiswa
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:

  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "status": "success",
      "message": "Rekapitulasi Kegiatan Bulanan Berhasil Diambil",
      "data": [
        {
          "id": 1,
          "uraian_kegiatan": "Membuat Infografis",
          "satuan": "box",
          "target": 2,
          "realisasi": 2,
          "persentase": 100,
          "tingkat_kualitas": 98,
          "keterangan": "Selesai"
        },
        {
          "id": 2,
          "uraian_kegiatan": "Membuat Banner Halaman Kantor",
          "satuan": "box",
          "target": 2,
          "realisasi": 2,
          "persentase": 100,
          "tingkat_kualitas": 98,
          "keterangan": "Selesai"
        }
        ...
      ]
    }
    ```

### Edit Rekapitulasi Kegiatan Bulanan by Mahasiswa

- Method: `PUT`
- URL: `/api/kegiatan-bulanan/{id}` // id rekapitulasi kegiatan bulanan
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "uraian_kegiatan": "Membuat Infografis",
      "satuan": "box",
      "target": 2,
      "realisasi": 2,
      "persentase": 100,
      "tingkat_kualitas": 98,
      "keterangan": "Selesai"
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Rekapitulasi Kegiatan Bulanan Berhasil Diubah"
    }
    ```

## Rekapitulasi Kegiatan Bulanan Pembimbing Lapangan Endpoints ////////////////

## Presensi Mahasiswa Endpoints

### Get Presensi by Mahasiswa

- Method: `GET`
- URL: `/api/presensi/mahasiswa/{id}` // id mahasiswa
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:

  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "status": "success",
    "message": "Data Presensi Berhasil Diambil",
    "data": [
      {
        "id": 1,
        "tanggal": "2022-12-15",
        "waktu_datang": "07:31",
        "waktu_pulang": "17:00",
        "status": "Terlambat"
      },
      {
        "id": 2,
        "tanggal": "2022-12-16",
        "waktu_datang": "07:31",
        "waktu_pulang": "17:00",
        "status": "Terlambat"
      },
      ...
    ]
  }
  ```

### Add Presensi // set waktu diambil dari frontend atau backend?

#### Datang

- Method: `POST`
- URL: `/api/presensi/datang`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "id_mahasiswa": 1,
      "tanggal": "2022-12-15",
      "waktu_datang": "07:31"
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Presensi Datang Berhasil Ditambahkan"
    }
    ```

#### Pulang

- Method: `POST`
- URL: `/api/presensi/pulang`
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    ```json
    {
      "id_mahasiswa": 1,
      "tanggal": "2022-12-15",
      "waktu_pulang": "17:00"
    }
    ```
- Response:
  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:
    ```json
    {
      "status": "success",
      "message": "Presensi Pulang Berhasil Ditambahkan"
    }
    ```

## Presensi Mahasiswa for Pembimbing Lapangan Endpoints

### Get Presensi by Pembimbing Lapangan

- Method: `GET`
- URL: `/api/presensi/pembimbing-lapangan/{id}` // id pembimbing lapangan
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:

  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "status": "success",
    "message": "Data Presensi Berhasil Diambil",
    "data": [
      {
        "id": 1,  // id mahasiswa
        "nama_mahasiswa": "John Doe",
        "nim_mahasiswa": 123345678,
        "data_presensi": [
          {
            "id_presensi": 1,
            "tanggal": "2022-12-15",
            "waktu_datang": "07:31",
            "waktu_pulang": "17:00",
            "status": "Terlambat"
          },
          {
            "id_presensi": 2,
            "tanggal": "2022-12-16",
            "waktu_datang": "07:31",
            "waktu_pulang": "17:00",
            "status": "Terlambat"
          },
          ...
        ]
      },
      {
        "id": 2, // id mahasiswa
        "nama_mahasiswa": "Jane Doel",
        "nim_mahasiswa": 123345679,
        "data_presensi": [
          {
            "id_presensi": 4,
            "tanggal": "2022-12-15",
            "waktu_datang": "07:31",
            "waktu_pulang": "17:00",
            "status": "Terlambat"
          },
          {
            "id_presensi": 5,
            "tanggal": "2022-12-16",
            "waktu_datang": "07:31",
            "waktu_pulang": "17:00",
            "status": "Terlambat"
          },
          ...
        ]
      }
      ...
    ]
  }
  ```

## Presensi for Dosen Pembimbing Endpoints

### Get Presensi by Dosen Pembimbing

- Method: `GET`
- URL: `/api/presensi/dosen-pembimbing/{id}` // id dosen pembimbing
- Request:
  - Header:
    - Content-Type: application/json
    - Accept: application/json
  - Body:
    - No Body
- Response:

  - Status: `200`
  - Header:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "status": "success",
    "message": "Data Presensi Berhasil Diambil",
    "data": [
      {
        "id": 1, // id mahasiswa
        "nama_mahasiswa": "John Doe",
        "nim_mahasiswa": 123345678,
        "data_presensi": [
          {
            "id_presensi": 1,
            "tanggal": "2022-12-15",
            "waktu_datang": "07:31",
            "waktu_pulang": "17:00",
            "status": "Terlambat"
          },
          {
            "id_presensi": 2,
            "tanggal": "2022-12-16",
            "waktu_datang": "07:31",
            "waktu_pulang": "17:00",
            "status": "Terlambat"
          },
          ...
        ]
      },
      {
        "id": 2, // id mahasiswa
        "nama_mahasiswa": "Jane Doel",
        "nim_mahasiswa": 123345679,
        "data_presensi": [
          {
            "id_presensi": 4,
            "tanggal": "2022-12-15",
            "waktu_datang": "07:31",
            "waktu_pulang": "17:00",
            "status": "Terlambat"
          },
          {
            "id_presensi": 5,
            "tanggal": "2022-12-16",
            "waktu_datang": "07:31",
            "waktu_pulang": "17:00",
            "status": "Terlambat"
          },
          ...
        ]
      }
      ...
    ]
  }
  ```
