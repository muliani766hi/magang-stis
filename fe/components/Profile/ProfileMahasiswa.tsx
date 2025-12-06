'use client'

import { getProfile } from "@/utils/get-profile";
import { TextInput, Text, Group, Stack, Select, SimpleGrid, Button, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import ChangePassword from "./ChangePassword";
import { getProvinsi } from "@/utils/provinsi";


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
    kodeProvinsi: string;
    nama: string;
    kabupatenKota: KabupatenWali[]
};

type KabupatenWali = {
    kodeKabupatenKota: string;
    nama: string;
};

type Satker = {
    satkerId: number;
    nama: string;
};

type Pemlab = {
    pemlapId: number;
    nama: string;
};

type Dospem = {
    dosenId: number;
    nama: string;
};

type UserData = {
    mahasiswaId?: string
    nama: string;
    nim: string;
    email: string;
    noHp: string;
    noHpWali: string;
    alamat: string;
    alamatWali: string;
    kelas: string;
    prodi: string;
    kabupaten: string;
    provinsiWali: string;
    kabupatenWali: string;
    nomorRekening: string;
    namaRekening: string;
    bank: string;
    dosenPembimbingMagang?: Dospem;
    pembimbingLapangan?: Pemlab;
    satker?: Satker
};

const Profile = () => {

    const [loading, setLoading] = useState(true);
    const [selectedKelas, setSelectedKelas] = useState<string | null>(null);
    const [selectedProdi, setSelectedProdi] = useState<string | null>(null);
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [selectedKabupaten, setSelectedKabupaten] = useState<string | null>(null);
    const [provinsiOptions, setProvinsiOptions] = useState<Provinsi[]>([]);
    const [selectedProvinsiWali, setSelectedProvinsiWali] = useState<string | null>(null);
    const [kabupatenWaliOptions, setKabupatenWaliOptions] = useState<KabupatenWali[]>([]);
    const [selectedKabupatenWali, setSelectedKabupatenWali] = useState<string | null>(null);

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
            kabupaten: "",
            kabupatenWali: "",
            provinsiWali: "",
            nomorRekening: "",
            namaRekening: "",
            bank: ""
        },
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
            nomorRekening: (value) => {
                if (!value) {
                    return 'No. Rekening tidak boleh kosong';
                }
                if (!/^\d+$/.test(value)) {
                    return 'No. Rekening harus berupa angka';
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
        form.setValues(response.data.mahasiswa);
        setLoading(false)
    }

    const fetchDataProvinsi = async () => {
        const provinsiData = await getProvinsi();
        setProvinsiOptions(provinsiData.data);
        setLoading(false)
    }

    const fetchKabupatenWali = async (kodeProvinsi: string) => {
        if (!kodeProvinsi) return;

        const provinsi = provinsiOptions.find(p => p.kodeProvinsi === kodeProvinsi);
        if (provinsi && provinsi.kabupatenKota) {
            setKabupatenWaliOptions(provinsi.kabupatenKota);
        }
    };

    useEffect(() => {
        fetchData();
        fetchDataProvinsi()
    }, []);

    useEffect(() => {
        if (selectedProvinsiWali) {
            fetchKabupatenWali(selectedProvinsiWali);
        } else {
            setKabupatenWaliOptions([]);
        }
    }, [selectedProvinsiWali]);

    const handleSubmit = () => {
        window.location.href = '/mahasiswa/profil/update'
    }

    return (
        <>
            <Text c="dimmed" mb="md">Profil</Text>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" pos="relative">
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Stack justify="flex-start">
                    <TextInput label="Nama" readOnly {...form.getInputProps('nama')} />
                    <TextInput label="NIM" readOnly {...form.getInputProps("nim")} />
                    <TextInput label="Email Selain @stis.ac.id" readOnly {...form.getInputProps("email")} />
                    <TextInput label="Prodi" readOnly {...form.getInputProps('prodi')} />
                    <TextInput label="Kelas" readOnly {...form.getInputProps('kelas')} />

                    {/* <Select
                        allowDeselect={false}
                        label="Kelas"
                        data={dataClass.map((args) => ({
                            value: args.value,
                            label: args.label
                        }))}
                        readOnly
                        value={selectedKelas || form.values.kelas}
                        onChange={(value) => {
                            setSelectedKelas(value);
                            form.setFieldValue("kelas", value ?? "");
                        }}
                    />
                    <Select
                        allowDeselect={false}
                        label="Prodi"
                        readOnly
                        data={dataProdi.map((args) => ({
                            value: args.value,
                            label: args.label
                        }))}
                        value={selectedProdi || form.values.prodi}
                        onChange={(value) => {
                            setSelectedProdi(value);
                            form.setFieldValue("prodi", value ?? "");
                        }}
                    /> */}


                    <TextInput label="Alamat tempat tinggal orang tua" readOnly {...form.getInputProps("alamatWali")} />
                    <TextInput
                        label="Lattitude dan longitude tempat tinggal orang tua"
                        readOnly
                        value={`${form.getInputProps("lat").value}, ${form.getInputProps("lng").value}`}
                    />
                    <TextInput label="Alamat lengkap tempat tinggal di Jakarta" readOnly {...form.getInputProps("alamat")} />

                    <TextInput label="Dosen Pembimbing" readOnly {...form.getInputProps("dosenPembimbingMagang.nama")} />
                    <TextInput label="Pembimbing Lapangan" readOnly {...form.getInputProps("pembimbingLapangan.nama")} />
                </Stack>
                <Stack justify="flex-start">
                    <TextInput label="Nomor telepon" readOnly {...form.getInputProps("noHp")} />
                    <TextInput label="Nomor telepon orang tua" readOnly
                        {...form.getInputProps("noHpWali")}
                        onChange={(event) => {
                            form.setFieldValue("noHpWali", event.target.value);
                            form.validateField("noHpWali");
                        }}
                    />
                    <TextInput label="No Rekening" readOnly 
                        {...form.getInputProps("nomorRekening")}
                        onChange={(event) => {
                            form.setFieldValue("nomorRekening", event.target.value);
                            form.validateField("nomorRekening");
                        }}
                    />
                    <TextInput
                        label="Bank"
                        readOnly
                        value={form.values.bank}
                    />
                    <TextInput label="Nama Rekening" {...form.getInputProps("namaRekening")} />

                    <Group justify="flex-end">
                        <Button onClick={handleSubmit}
                            variant="light"
                        >Ubah Biodata</Button>
                    </Group>

                    <ChangePassword />
                </Stack>
            </SimpleGrid >
        </>
    );
}

export default Profile