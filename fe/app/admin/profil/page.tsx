'use client'

import ChangePassword from "@/components/Profile/ChangePassword";
import { getProfile } from "@/utils/get-profile";
import { TextInput, Box, Text, Group, Stack, Select, SimpleGrid, Fieldset, Button, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { init } from "next/dist/compiled/webpack/webpack";
import { useEffect, useState } from "react";

export default function Profil() {
    const [data, setData] = useState({} as any);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await getProfile();

            setData(response.data);
            // console.log(response.data);
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
            <Text c="dimmed" mb="md">Profil</Text>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" pos="relative">
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Stack justify="flex-start">
                    {/* <TextInput label="NIP" placeholder="NIP" readOnly value={data.nim || ''} /> */}
                    {/* <TextInput label="Nama" placeholder="Nama" readOnly value={data.nama || ''} /> */}
                    <TextInput label="Email" placeholder="Email" readOnly value={data.email || ''} />
                    {/* <TextInput label="No. HP" placeholder="No. HP" readOnly value={data.no_hp || ''} /> */}
                    {/* <TextInput label="Tempat, Tanggal Lahir" placeholder="Tempat, Tanggal Lahir" readOnly value={data.tempat_tanggal_lahir || ''} /> */}
                    {/* <TextInput label="Alamat" placeholder="Alamat" readOnly value={data.alamat || ''} /> */}
                </Stack>
                <ChangePassword />
            </SimpleGrid >
        </>
    );
}
