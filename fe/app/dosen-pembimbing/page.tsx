'use client'
import { useEffect, useState } from "react";
import {
    IconCalendarCheck,
    IconClockCheck,
    IconInfoCircle,
    IconNote,
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
    Box,
    Progress
} from "@mantine/core";
import { getPresensiNew } from '@/utils/presensi'

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

    const [data, setData] = useState<any[]>([])

    const fetchData = async () => {
        try {
            const response = await getPresensiNew()
            let modifiedData = response.data.map((item: { mahasiswaId: any; }) => ({
                ...item,
                id: item.mahasiswaId,
            }))

            setData(modifiedData)
        } catch (error) {
            console.error("Failed to fetch data", error)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        fetchData()
    }, [])


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
                    href="/dosen-pembimbing/presensi"

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
                    href="/dosen-pembimbing/kegiatan/harian"

                    withBorder>
                    <Card.Section>
                        <Center bg="var(--mantine-primary-color-filled)" c={"white"} h={150}>
                            <IconNote size={50} />
                        </Center>
                    </Card.Section>
                    <Text fw={500} size="lg" mt="md">
                        Catatan Kegiatan
                    </Text>

                    <Text mt="xs" c="dimmed" size="sm">
                        Catatan kegiatan harian mahasiswa magang
                    </Text>
                </Card>

                <Card
                    shadow="xs"
                    padding="md"
                    radius="sm"
                    component="a"
                    href="/dosen-pembimbing/bimbingan/magang"

                    withBorder>
                    <Card.Section>
                        <Center bg="var(--mantine-primary-color-filled)" c={"white"} h={150}>
                            <IconCalendarCheck size={50} />
                        </Center>
                    </Card.Section>
                    <Text fw={500} size="lg" mt="md">
                        Bimbingan Magang
                    </Text>

                    <Text mt="xs" c="dimmed" size="sm">
                        Jadwal pertemuan bimbingan magang
                    </Text>
                </Card>
            </SimpleGrid>
            
            {/* <Card shadow="sm" padding="lg" w={600} radius="md" withBorder>
                <Text fw={600} mb="xs">
                    Presentase Kehadiran Mahasiswa
                </Text>
                <Divider mb="sm" />
                <Stack gap="sm">
                    {data.map((mhs, index) => (
                        <Group justify="space-between" key={index}>
                            <Text size="sm" w={140}>
                                {mhs.nama}
                            </Text>
                            <Progress value={mhs.persentaseKehadiran} w={300} color="blue" radius="xl" />
                            <Text size="sm" w={30} ta="right">
                                {mhs.persentaseKehadiran}
                            </Text>
                        </Group>
                    ))}
                </Stack>
            </Card> */}
        </>
    )
}
