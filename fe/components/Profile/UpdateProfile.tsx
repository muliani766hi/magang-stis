'use client'

import { getProfile } from "@/utils/get-profile";
import { getProvinsi } from "@/utils/provinsi";
import { putMahasiswa } from "@/utils/kelola-user/mahasiswa";
import { TextInput, Box, Modal, Text, Group, Stack, Select, SimpleGrid, Fieldset, Button, LoadingOverlay, Autocomplete } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import MapComponent from "@/components/Map";
import { useDisclosure } from '@mantine/hooks';
import { getKabupaten, getAllKabupaten } from "@/utils/kabupaten";
import { IconMapPin } from "@tabler/icons-react";

const dataClass = [
    { value: "2D31", label: "2D31" },
    { value: "2D32", label: "2D32" },
    { value: "2D33", label: "2D33" },
    { value: "2D34", label: "2D34" },
    { value: "2D35", label: "2D35" },
    { value: "3SK1", label: "3SK1" },
    { value: "3SK2", label: "3SK2" },
    { value: "3SK3", label: "3SK3" },
    { value: "3SK4", label: "3SK4" },
    { value: "3SE1", label: "3SE1" },
    { value: "3SE2", label: "3SE2" },
    { value: "3SE3", label: "3SE3" },
    { value: "3SE4", label: "3SE4" },
    { value: "3SD1", label: "3SD1" },
    { value: "3SD2", label: "3SD2" },
    { value: "3SD3", label: "3SD3" },
    { value: "3SD4", label: "3SD4" },
    { value: "3SI1", label: "3SI1" },
    { value: "3SI2", label: "3SI2" },
    { value: "3SI3", label: "3SI3" },
    { value: "3SI4", label: "3SI4" }
]

const dataProdi = [
    { value: "DIII ST", label: "DIII ST" },
    { value: "DIV KS", label: "DIV KS" },
    { value: "DIV ST", label: "DIV ST" }
]

type Provinsi = {
    provinsiId: string;
    nama: string;
    kabupatenKota: KabupatenWali[]
};

type KabupatenWali = {
    kabupatenKotaId: string;
    nama: string;
};

type Kabupaten = {
    kabupatenKotaId: string;
    nama: string;
};

type UserData = {
    nama: string;
    nim: string;
    email: string;
    noHp: string;
    noHpWali: string;
    alamat: string;
    alamatWali: string;
    kelas: string;
    prodi: string;
    kabupatenId: string;
    provinsiWaliId: string;
    kabupatenWaliId: string;
    nomorRekening: string;
    namaRekening: string;
    bank: string;
    lat: number;
    lng: number;
};

const daftarBankResmi = [
  "BCA",
  "BNI",
  "BRI",
  "Bank Mandiri",
  "BTN",
  "BSI",
  "Bank Jago",
  "Seabank"
];


const UpdateProfile = () => {

    const [loading, setLoading] = useState(true);
    const [selectedKelas, setSelectedKelas] = useState<string | null>(null);
    const [selectedProdi, setSelectedProdi] = useState<string | null>(null);
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [selectedKabupaten, setSelectedKabupaten] = useState<string | null>(null);
    const [provinsiOptions, setProvinsiOptions] = useState<Provinsi[]>([]);
    const [selectedProvinsiWali, setSelectedProvinsiWali] = useState<string | null>(null);
    const [kabupatenWaliOptions, setKabupatenWaliOptions] = useState<KabupatenWali[]>([]);
    const [selectedKabupatenWali, setSelectedKabupatenWali] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [initialPosition, setInitialPosition] = useState<{ lat: number, lng: number } | null>(null);
    const [opened, { open, close }] = useDisclosure();
    const [kabupatenOptions, setKabupatenOptions] = useState<Kabupaten[]>([]);

    const form = useForm<UserData>({
        initialValues: {
            nama: "",
            nim: "",
            email: "",
            noHp: "",
            noHpWali: "",
            alamat: "",
            alamatWali: "",
            kelas: "",
            prodi: "",
            kabupatenId: "",
            kabupatenWaliId: "",
            provinsiWaliId: "",
            nomorRekening: "",
            namaRekening: "",
            bank: "",
            lat: 0,
            lng: 0
        },
        validateInputOnChange: true,
        validate: {
            email: (value) => {
                if (!value) return "Email tidak boleh kosong";
                if (!/@/.test(value)) return "Format email salah";
                return null;
            },
            noHp: (value) => {
                if (!value) return 'Nomor telepon tidak boleh kosong';
                if (!/^62\d+$/.test(value)) return 'Nomor telepon harus diawali dengan 62';
                return null;
            },
            noHpWali: (value) => {
                if (!value) return 'Nomor telepon wali tidak boleh kosong';
                if (!/^62\d+$/.test(value)) return 'Nomor telepon wali harus diawali dengan 62';
                return null;
            },
            bank: (value) => {
                if (!value) {
                    return 'Bank tidak boleh kosong';
                }
            },
           nomorRekening: (value, values) => {
                if (!value) {
                    return 'No. Rekening tidak boleh kosong';
                }
                if (!/^\d+$/.test(value)) {
                    return 'No. Rekening harus berupa angka';
                }

                const bank = values.bank;
                const panjangValid: Record<string, number> = {
                    BCA: 10,
                    BNI: 10,
                    BRI: 15,
                    "Bank Mandiri": 13,
                    BTN: 16,
                    BSI: 10,
                    "Bank Jago": 12,
                    Seabank: 12,
                };

                if (bank in panjangValid) {
                    const panjang = panjangValid[bank];
                    if (value.length !== panjang) {
                    return `No. Rekening ${bank} harus ${panjang} digit`;
                    }
                }

                return null;
            },
            namaRekening: (value) => {
                if (!value) {
                    return 'Atas Nama tidak boleh kosong';
                }
            }
        }
    });

    const fetchData = async () => {
        const response = await getProfile();
        // console.log('profile', response)
        form.setValues(response.data.mahasiswa);
        setLoading(false);
    }

    // console.log(form.values)


    const fetchDataProvinsi = async () => {
        const provinsiData = await getProvinsi();
        setProvinsiOptions(provinsiData.data);
        setLoading(false)
    }


    const fetchKabupatenWali = async (provinsiId: string) => {
        try {
            const response = await getKabupaten({ provinsiId });
            if (Array.isArray(response.data)) {
                setKabupatenWaliOptions(response.data);
            } else {
                setKabupatenWaliOptions([]);
                console.warn('Kabupaten data bukan array:', response.data);
            }
        } catch (error) {
            console.error("Gagal fetch kabupaten:", error);
            setKabupatenWaliOptions([]);
        }
    };

    // const fetchKabupaten = async () => {
    //     try {
    //         const response = await getAllKabupaten();
    //         if (Array.isArray(response.data)) {
    //             setKabupatenOptions(response.data);
    //         } else {
    //             setKabupatenOptions([]);
    //             console.warn('Kabupaten data bukan array:', response.data);
    //         }
    //     } catch (error) {
    //         console.error("Gagal fetch kabupaten:", error);
    //         setKabupatenOptions([]);
    //     }
    // };

    const fetchKabupaten = async () => {
        try {
            const response = await getAllKabupaten();
    
            // Daftar ID kabupaten yang ingin difilter
            // const selectedKabupatenIds = [155, 156, 157, 158, 159, 160, 161, 176, 179, 183, 184, 268, 270, 273];
            const selectedKodeSatker = [3101, 3171, 3172, 3173, 3174, 3175, 3671, 3674, 3603, 3201, 3216, 3271, 3275, 3276];
            const selectedKodeSatkerStr = selectedKodeSatker.map(String);
            
            // Filter data kabupaten berdasarkan ID yang ada dalam selectedKabupatenIds
            if (Array.isArray(response.data)) {
                const filteredKabupaten = response.data.filter(
                (kabupaten: { kodeKabupatenKota: string }) =>
                    selectedKodeSatkerStr.includes(kabupaten.kodeKabupatenKota)
                );
                setKabupatenOptions(filteredKabupaten);
            } else {
                setKabupatenOptions([]);
                console.warn('Kabupaten data bukan array:', response.data);
            }
        } catch (error) {
            console.error("Gagal fetch kabupaten:", error);
            setKabupatenOptions([]);
        }
    };
    
    


    useEffect(() => {
        fetchData();
        fetchDataProvinsi()
        fetchKabupaten()
    }, []);

    useEffect(() => {
        const provinsiId = selectedProvinsiWali || form.values.provinsiWaliId;
        if (provinsiId) {
            fetchKabupatenWali(provinsiId);
        }
    }, [selectedProvinsiWali, form.values.provinsiWaliId]);


    useEffect(() => {
        setIsClient(true);

        if (form.values.lat || form.values.lng) {
            setInitialPosition({
                lat: form.values.lat,
                lng: form.values.lng,
            });
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setInitialPosition({
                            lat: latitude,
                            lng: longitude,
                        });
                    },

                );
            }
        }

    }, [form.values.lat, form.values.lng]);

    // if (!isClient || initialPosition === null) {
    //     return <div>Loading...</div>;
    // }

    const handlePositionChange = (position: { lat: number, lng: number }) => {
        form.setFieldValue("lat", position.lat ?? 0);
        form.setFieldValue("lng", position.lng ?? 0);
    };

    const handleSubmit = async (values: any) => {
        setLoading(true)
        await putMahasiswa(values?.mahasiswaId, values);
        notifications.show({ title: 'Berhasil', message: 'Biodata berhasil diubah' });
        setLoading(false)
    }


    return (
        <>
            <Text c="dimmed" mb="md">Update Biodata</Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" pos="relative">
                    <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    <Stack justify="flex-start">
                        {/* <TextInput label="Nama lengkap" readOnly {...form.getInputProps('nama')} />
                        <TextInput label="NIM" readOnly {...form.getInputProps("nim")} />
                        <TextInput label="Kelas" readOnly {...form.getInputProps("kelas")} />
                        <TextInput label="Prodi" readOnly {...form.getInputProps("prodi")} /> */}
                        <TextInput label="Email Selain @stis.ac.id" description="Email" required {...form.getInputProps("email")} />
                        <TextInput label="Nomor telepon/WhatsApp" description="Contoh : 6281234567890" required {...form.getInputProps("noHp")} />
                        <TextInput label="Nomor telepon/WhatsApp orang tua/wali" description="Contoh : 6281234567890" required {...form.getInputProps("noHpWali")} />
                        {/* <Select
                            allowDeselect={false}
                            label="Kelas"
                            data={dataClass.map((args) => ({
                                value: args.value,
                                label: args.label
                            }))}
                            required
                            description="Pilih "
                            value={selectedKelas || form.values.kelas}
                            onChange={(value) => {
                                setSelectedKelas(value);
                                form.setFieldValue("kelas", value ?? "");
                            }}
                        />
                        <Select
                            allowDeselect={false}
                            label="Prodi"
                            required
                            data={dataProdi.map((args) => ({
                                value: args.value,
                                label: args.label
                            }))}
                            description="Pilih Prodi"
                            value={selectedProdi || form.values.prodi}
                            onChange={(value) => {
                                setSelectedProdi(value);
                                form.setFieldValue("prodi", value ?? "");
                            }}
                        /> */}
                        <TextInput label="Alamat lengkap tempat tinggal di Jakarta dan sekitarnya" required description="Isikan alamat" {...form.getInputProps("alamat")} />
                        <Select
                            allowDeselect={false}
                            label="Kabupaten/Kota tempat tinggal di Jakarta dan sekitarnya"
                            data={kabupatenOptions.map((kab) => ({
                                value: String(kab.kabupatenKotaId),
                                label: kab.nama
                            }))}
                            required
                            description="Pilih Kabupaten/Kota"
                            value={selectedKabupaten || String(form.values.kabupatenId)}
                            onChange={(value) => {
                                setSelectedKabupaten(value);
                                form.setFieldValue("kabupatenId", value ?? "");
                            }}
                        />
                        <TextInput label="Alamat lengkap tempat tinggal orang tua/wali" required description="Isikan alamat" {...form.getInputProps("alamatWali")} />
                    </Stack>
                    <Stack justify="flex-start">
                        <Select
                            allowDeselect={false}
                            label="Provinsi tempat tinggal orang tua/wali"
                            data={provinsiOptions.map(prov => ({ value: String(prov.provinsiId), label: prov.nama }))}
                            required
                            description="Pilih "
                            value={selectedProvinsiWali || String(form.values.provinsiWaliId)}
                            onChange={(value) => {
                                setSelectedProvinsiWali(value);
                                form.setFieldValue("provinsiWaliId", value ?? "");
                            }}
                        />
                        <Select
                            allowDeselect={false}
                            label="Kabupaten/Kota tempat tinggal orang tua/wali"
                            data={kabupatenWaliOptions.map((kab) => ({
                                value: String(kab.kabupatenKotaId),
                                label: kab.nama
                            }))}
                            required
                            description="Pilih "
                            value={selectedKabupatenWali || String(form.values.kabupatenWaliId)}
                            onChange={(value) => {
                                setSelectedKabupatenWali(value);
                                form.setFieldValue("kabupatenWaliId", value ?? "");
                            }}
                        />

                        {/* <Stack>
                            <Text fw={500} style={{ fontSize: "14px" }}>Pilih alamat melalui peta<span style={{ color: "red", marginLeft: "3px" }}>*</span></Text>
                            <Button onClick={open} style={{ width: "13%" }}>Pilih</Button>
                        </Stack> */}

                        <Stack>
                        <Text fw={500} style={{ fontSize: "14px" }}>
                            Pilih alamat melalui peta
                            <span style={{ color: "red", marginLeft: "3px" }}>*</span>
                        </Text>
                        <Button
                            onClick={open}
                            style={{ width: "15%", height: "40px" }}
                            leftSection={<IconMapPin size={16} />}
                        >
                            Pilih
                        </Button>
                        </Stack>

                       
                        {/* <Select
                            allowDeselect={false}
                            label="Bank"
                            data={[
                                { value: "BCA", label: "Bank Central Asia (BCA)" },
                                { value: "BNI", label: "Bank Negara Indonesia (BNI)" },
                                { value: "BRI", label: "Bank Rakyat Indonesia (BRI)" },
                                { value: "Bank Mandiri", label: "Bank Mandiri" },
                                { value: "BTN", label: "Bank Tabungan Negara (BTN)" },
                                { value: "BSI", label: "Bank Syariah Indonesia (BSI)" },
                                { value: "Bank Jago", label: "Bank Jago" },
                                { value: "Seabank", label: "Sea Bank" },
                                // { value: "cimb", label: "CIMB Niaga" },
                                // { value: "permata", label: "Bank Permata" },
                                // { value: "danamon", label: "Bank Danamon" },
                                // { value: "mega", label: "Bank Mega" },
                                // { value: "ocbc", label: "OCBC NISP" },
                                // { value: "bukopin", label: "Bank Bukopin" },
                            ]}
                            required
                            description="Pilih Bank"
                            value={selectedBank || form.values.bank}
                            onChange={(value) => {
                                setSelectedBank(value);
                                form.setFieldValue("bank", value ?? "");
                                form.validateField("nomorRekening");
                            }}
                        /> */}

                        <Autocomplete
                            label="Bank"
                            required
                            description="Pilih atau ketik nama bank"
                            data={daftarBankResmi}
                            value={form.values.bank}
                            onChange={(value) => {
                                setSelectedBank(value); // opsional simpan state lokal
                                form.setFieldValue("bank", value ?? "");
                                form.validateField("nomorRekening");
                            }}
                            mt={3}
                        />

                        <TextInput label="No Rekening" description="Contoh: 222212999" required
                            {...form.getInputProps("nomorRekening")}
                            onChange={(event) => {
                                form.setFieldValue("nomorRekening", event.target.value);
                                form.validateField("nomorRekening"); // Validasi langsung setelah perubahan
                            }}
                        />

                        <TextInput label="Nama Rekening" description="Masukkan nama sesuai buku rekening" required {...form.getInputProps("namaRekening")} />
                        <Group justify="flex-end">
                            <Button type="submit" loading={loading}
                                variant="light"
                            >Kirim</Button>
                        </Group>
                    </Stack>
                </SimpleGrid >
            </form>
            <Modal opened={opened} onClose={close} title="Peta Lokasi">
                <MapComponent
                    initialPosition={initialPosition as any}
                    onPositionChange={handlePositionChange}
                    key={opened ? 'open' : 'closed'}
                />
                <Group justify="flex-end" style={{ marginTop: "30px" }}>
                    <Button
                        variant="light"
                        onClick={close}
                    >Konfirmasi</Button>
                </Group>
            </Modal>
        </>
    );
}

export default UpdateProfile