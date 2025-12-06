'use client'
import { useEffect, useState } from "react";
import {
    IconCalendarCheck,
    IconClockCheck,
    IconInfoCircle,
    IconMapPin,
    IconNote,
    IconUser,
} from "@tabler/icons-react";
import { getPengumuman } from "@/utils/pengumuman";
import { getChartAdprov } from "@/utils/chart/admin-provinsi";
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
import { DonutChart } from "@mantine/charts";

export default function Home() {
    const [loading, setLoading] = useState(true)
    const [pengumuman, setPengumuman] = useState([])
    const [menunggu, setMenunggu] = useState(0)
    const [dialokasian, setDialokasikan] = useState(0)

    const fetchPengumuman = async () => {
        const pengumuman = await getPengumuman()
        setPengumuman(pengumuman.data)
        setLoading(false)
    }

    useEffect(() => {
        fetchPengumuman()
    }, [])

    const fetchChart = async () => {
        const chartData = await getChartAdprov()
        console.log(chartData)
        setMenunggu(chartData.data.menunggu)
        setDialokasikan(chartData.data.dialokasikan)
        setLoading(false)
    }

    useEffect(() => {
        fetchChart()
    }, [])

    function LegendItem({ label, color }: { label: string; color: string }) {
        return (
            <Group gap={5}>
                <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
                <Text size="xs" c="dimmed">{label}</Text>
            </Group>
        );
    }


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
                    href="/admin-provinsi/penempatan/alokasi"

                    withBorder>
                    <Card.Section>
                        <Center bg="var(--mantine-primary-color-filled)" c={"white"} h={150}>
                            <IconMapPin size={50} />
                        </Center>
                    </Card.Section>
                    <Text fw={500} size="lg" mt="md">
                        Alokasi
                    </Text>

                    <Text mt="xs" c="dimmed" size="sm">
                        Tentukan alokasi magang mahasiswa
                    </Text>
                </Card>

                <Card
                    shadow="xs"
                    padding="md"
                    radius="sm"
                    component="a"
                    href="/admin-provinsi/penempatan/unit-kerja"

                    withBorder>
                    <Card.Section>
                        <Center bg="var(--mantine-primary-color-filled)" c={"white"} h={150}>
                            <IconNote size={50} />
                        </Center>
                    </Card.Section>
                    <Text fw={500} size="lg" mt="md">
                        Unit Kerja
                    </Text>

                    <Text mt="xs" c="dimmed" size="sm">
                        Kelola unit kerja magang
                    </Text>
                </Card>

                <Card
                    shadow="xs"
                    padding="md"
                    radius="sm"
                    component="a"
                    href="/admin-provinsi/kelola/admin-satker"

                    withBorder>
                    <Card.Section>
                        <Center bg="var(--mantine-primary-color-filled)" c={"white"} h={150}>
                            <IconUser size={50} />
                        </Center>
                    </Card.Section>
                    <Text fw={500} size="lg" mt="md">
                        Kelola Admin Satker
                    </Text>

                    <Text mt="xs" c="dimmed" size="sm">
                        Kelola akun admin satker
                    </Text>
                </Card>
            </SimpleGrid>

            {/* <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="lg">
                <Card withBorder mt="md" padding="md" w={400}>
                    <Text fw={600} size="sm" mb="sm" style={{ textAlign: "center" }}>
                        Pengalokasian Mahasiswa
                    </Text>
                    <DonutChart
                        h={200}
                        thickness={30}
                        withTooltip={false}
                        data={
                            [
                                { name: 'Menunggu', value: menunggu, color: 'blue.2' },
                                { name: 'Dialokasikan', value: dialokasian, color: 'blue.6' },
                            ]
                        }
                    />
                    <Stack >
                        <LegendItem label="Menunggu" color="#a5d8ff" />
                    </Stack>
                    <Stack >
                        <LegendItem label="Dialokasikan" color="#228be6" />
                    </Stack>
                </Card>
            </SimpleGrid> */}
            
        </>
    )
}
