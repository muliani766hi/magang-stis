'use client'

import { putNewPassword } from "@/utils/get-profile";
import { TextInput, Box, Text, Group, Stack, Select, SimpleGrid, Fieldset, Button, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { init } from "next/dist/compiled/webpack/webpack";
import { useEffect, useState } from "react";
import ChangePassword from "./ChangePassword";

interface ProfileData {
    id: number;
    nim: string;
    nama: string;
    email: string;
    no_hp: string;
    kelas: string;
    tempat_tanggal_lahir: string;
    alamat: string;
    bank: string;
    no_rekening: string;
    atas_nama: string;
}

const Profile = () => {

    const [data, setData] = useState({} as ProfileData);
    const [loading, setLoading] = useState(true);

    const form = useForm({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            konfirmNewPassword: '',
        },

        validate: {
            oldPassword: (value) => {
                if (!value) {
                    return 'Password Lama tidak boleh kosong';
                }
            },
            newPassword: (value) => {
                if (!value) {
                    return 'Password Baru tidak boleh kosong';
                }
                if (value.length < 8) {
                    return 'Password Baru minimal 8 karakter';
                }
            },
            konfirmNewPassword: (value) => {
                if (!value) {
                    return 'Konfirmasi Password Baru tidak boleh kosong';
                }
                if (value !== form.values.newPassword) {
                    return 'Konfirmasi Password Baru tidak sesuai';
                }
            }
        }
    });

    const fetchData = async () => {
        const response = await fetch('/api/profil/mahasiswa');
        const res = await response.json();
        console.log(res.data);
        // Update your state with the new data
        setData(res.data);

        setLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, []);



    return (
        <>
            <Text c="dimmed" mb="md">Profil</Text>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" pos="relative">
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Stack justify="flex-start">
                    <TextInput label="NIP" placeholder="NIP" readOnly value={data.nim || ''} />
                    <TextInput label="Nama" placeholder="Nama" readOnly value={data.nama || ''} />
                    <TextInput label="Email" placeholder="Email" readOnly value={data.email || ''} />
                    <TextInput label="No. HP" placeholder="No. HP" readOnly value={data.no_hp || ''} />
                    <TextInput label="Tempat, Tanggal Lahir" placeholder="Tempat, Tanggal Lahir" readOnly value={data.tempat_tanggal_lahir || ''} />
                    <TextInput label="Alamat" placeholder="Alamat" readOnly value={data.alamat || ''} />
                </Stack>
                <ChangePassword />
            </SimpleGrid >
        </>
    );
}

export default Profile