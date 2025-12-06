'use client'
import { useEffect, useState } from "react";
import {
    IconCalendarCheck,
    IconClockCheck,
    IconInfoCircle,
    IconNote,
    IconUser,
} from "@tabler/icons-react";
import { getPengumuman } from "@/utils/pengumuman";
import {
    ActionIcon,
    Alert,
    Card,
    Center,
    Divider,
    Image,
    List,
    SimpleGrid,
    Text,
    Group,
    Select,
    Stack,
    Box
} from "@mantine/core";
import { getAllPemlapWithMhs } from '@/utils/kelola-user/pembimbing-lapangan'
import { useDisclosure } from '@mantine/hooks'
import { DataTable } from 'mantine-datatable'
import { getAdminSatker } from "@/utils/kelola-user/admin-satker";

export default function Home() {
    const [loading, setLoading] = useState(true)
    const [pengumuman, setPengumuman] = useState([])
    const fetchPengumuman = async () => {
        const pengumuman = await getPengumuman()
        setPengumuman(pengumuman.data)
        setLoading(false)
    }
    useEffect(() => {
        fetchPengumuman()
    }, [])

    const [data, setData] = useState([]);
    const [kodeSatker, setKodeSatker] = useState('')
    const [dataMahasiswa, setDataMahasiswa] = useState<{ value: string; label: string; }[]>([]);
    const [dataMahasiswaFull, setDataMahasiswaFull] = useState<[]>([]);
    const [opened, { open, close }] = useDisclosure(false);

    const fetchData = async () => {
        try {
            const response = await getAllPemlapWithMhs();
            console.log(response)
            let modifiedData = response.data.map((item: { pemlapId: any; }) => ({
                ...item,
                id: item.pemlapId,  // Add the `id` field using `pemlapId`
            }));
            modifiedData = modifiedData.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
            // console.log(modifiedData);
            setData(modifiedData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <>
            <Text c="dimmed" mb="md">
                Beranda
            </Text>
            <Text
                size="xl"
                fw={700}
            >Selamat datang!</Text>
            <Alert my="md" variant="light" title="" icon={<IconInfoCircle />}>
                <Group justify="space-between" mb="xs">
                    <Text fw={700}>Pengumuman</Text>
                </Group>

                <List size="xs">
                    {
                        pengumuman.map((value: any, index) => (
                            <List.Item key={index}>
                                {value.deskripsi}
                            </List.Item>
                        ))
                    }
                </List>
            </Alert>

            <Divider
                label={
                    <Text
                        size="xs"
                        c={"gray"}
                        fw={700}
                    >Pintasan
                    </Text >
                }
                labelPosition="left"
                size={2}
                my="md"
            />

            <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="lg">
                <Card
                    shadow="xs"
                    padding="md"
                    radius="sm"
                    component="a"
                    href="/admin-satker/presensi"

                    withBorder>
                    <Card.Section>
                        <Center bg="var(--mantine-primary-color-filled)" c={"white"} h={150}>
                            <IconClockCheck size={50} />
                        </Center>
                    </Card.Section >
                    <Text fw={500} size="lg" mt="md">
                        Daftar Presensi
                    </Text>

                    <Text mt="xs" c="dimmed" size="sm">
                        Daftar presensi mahasiswa magang
                    </Text>
                </Card >

                <Card
                    shadow="xs"
                    padding="md"
                    radius="sm"
                    component="a"
                    href="/admin-satker/kelola/pembimbing-lapangan"

                    withBorder>
                    <Card.Section>
                        <Center bg="var(--mantine-primary-color-filled)" c={"white"} h={150}>
                            <IconUser size={50} />
                        </Center>
                    </Card.Section>
                    <Text fw={500} size="lg" mt="md">
                        Kelola Pembimbing Lapangan
                    </Text>

                    <Text mt="xs" c="dimmed" size="sm">
                        Kelola akun pembimbing lapangan
                    </Text>
                </Card>
                
            </SimpleGrid >


            {/* {data.length > 0 && (
                <Box mt="xl">
                    <Text fw={700} mb="sm">Data Pembimbing Lapangan & Mahasiswa</Text>
                    <DataTable
                        withTableBorder
                        borderRadius="md"
                        highlightOnHover
                        striped
                        columns={[
                            { accessor: 'nama_pembimbing', title: 'Pembimbing Lapangan' },
                            { accessor: 'nama_mahasiswa', title: 'Mahasiswa' },
                            { accessor: 'prodi', title: 'Prodi' },
                        ]}
                        records={data.flatMap((pemlap: any) =>
                            pemlap.mahasiswa.map((mhs: any, index: number) => ({
                                id: `${pemlap.pemlapId}-${index}`,
                                nama_pembimbing: index === 0 ? pemlap.nama : '',
                                nama_mahasiswa: mhs.nama,
                                prodi: mhs.prodi,
                            }))
                        )}
                    />

                </Box>
            )} */}

        </>
    )
}
