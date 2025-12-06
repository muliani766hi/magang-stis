1. Sistem pemilihan tempat magang saat ini masih menggunakan aplikasi pihak ketiga yaitu Google Formulir untuk mengumpulkan data penempatan mahasiswa.
2. Presensi magang yang dibebaskan mengkuti instansi tempat magang dapat mengakibatkan perbedaan dalam pengumpulan data kehadiran mahasiswa.
3. Catatan kegiatan yang memerlukan tanda tangan pembimbing lapangan dapat mengalami kendala ketika pembimbing lapangan tidak berada di tempat atau sedang berhalangan.
4. Beberapa proses lain seperti pengumpulan nomor rekening mahasiswa dan pengumpulan laporan magang juga masih menggunakan Google Formulir. Pengumpulan data yang terpisah dapat menyulitkan mahasiswa dalam mengumpulkan data yang diperlukan.
   Oleh karena itu, dibutuhkan sebuah sistem yang dapat mengatasi permasalahan tersebut.

Arsitektur sistem usulan

Sistem yang diusulkan adalah sistem berbasis web yang dapat diakses di berbagai perangkat melalui web browser. Sistem ini dibangun dengan menggunakan arsitektur model RESTful API yang pembangunannya dibagi menjadi dua bagian, yaitu frontend dan backend. Pembangunan bagian frontend menggunakan kerangka kerja Next.js dan library Mantin UI sebagai komponen-komponen antarmuka.

activity diagram digunakan untuk menggambarkan alur kerja sistem yang diusulkan. diagram ini merupakan pengembangan dari use case diagram yang telah dibuat sebelumnya, dengan tujuan untuk memperjelas alur kerja sistem yang diusulkan. Berikut adalah activity diagram dari sistem yang diusulkan.

Dalam pembangunan bagian frontend ini, menggunakan kerangka kerja Next.js versi 14 dan library Mantine UI versi 7 untuk komponen-komponen antarmuka. Sistem dibangun dengan desain antarmuka dominan berwarna putih dengan aksen warna biru. Berikut adalah beberapa halaman antarmuka yang dibangun dalam sistem ini.

halaman masuk aplikasi
pada halaman ini, pengguna dapat memasukkan email dan kata sandi untuk masuk ke dalam aplikasi. Terdapat juga metode masuk dengan menggunakan akun Google untuk beberapa aktor yang telah terdaftar di dalam sistem. Proses autentikasi mengarahkan pengguna ke halaman yang sesuai dengan peran pengguna dalam sistem.

halaman pemilihan tempat magang
Pada halaman ini, pengguna mahasiswa dapat memilih tiga pilihan tempat magang yang diinginkan. Pengguna dapat memilih tempat magang dengan cara mencari instansi tempat magang pada input dropdown

Halaman presensi magang
Pada halaman ini, pengguna mahasiswa dapat melakukan presensi pada tempat magang. Tombol tandai kehadiran akan muncul ketika pengguna berada di lokasi tempat magang. Apabila pengguna tidak berada di lokasi tempat magang, akan muncul notifikasi bahwa pengguna tidak berada di lokasi tempat magang.

Progres penelitian ini masih dalam tahap implementasi sehingga belum dapat dilakukan tahap pengujian yang dilakukan menggunakan uji Black Box Testing dan System Usability Scale (SUS).
