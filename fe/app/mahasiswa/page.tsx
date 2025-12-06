'use client'
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
import {
    IconCalendarCheck,
    IconClockCheck,
    IconInfoCircle,
    IconNote,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getPengumuman } from "@/utils/pengumuman";
import { getQueryDokumenTranslok, getQueryStatusRekening } from "@/utils/dokumen-translok";
import { getPresensiNewById } from "@/utils/presensi";

export default function Home() {
    const [filter, setFilter] = useState("semua");
    const [loading, setLoading] = useState(true)
    const [pengumuman, setPengumuman] = useState([])
    const [alertDokumen, setAlertDokumen] = useState([])
    const [alertRekening, setAlertRekening] = useState([])
    const [presensi, setPresensi] = useState({
        jumlah: {
          tepatWaktu: 0,
          terlambat: 0,
        },
        persentasePerKategori: {
          tepatWaktu: 0,
          terlambat: 0,
        },
        persentaseKehadiran: 0,
      });
    const fetchPengumuman = async () => {
        const pengumuman = await getPengumuman()
        setPengumuman(pengumuman.data)
        setLoading(false)
    }

    const fetchDokumenAlert = async () => {
        const dokumen = await getQueryDokumenTranslok('dikembalikan')
        setAlertDokumen(dokumen.data)
        setLoading(false)
    }

    const fetchRekeningAlert = async () => {
        const rekening = await getQueryStatusRekening('dikembalikan')
        console.log("fe",rekening.data)
        setAlertRekening(rekening.data)
        setLoading(false)
    }

    const fetchPresensi = async () => {
        const dokumen = await getPresensiNewById()
        setPresensi(dokumen.data)
        setLoading(false)
    }

    useEffect(() => {
        fetchPengumuman()
        fetchDokumenAlert()
        fetchPresensi()
        fetchRekeningAlert()
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
            <Text size="xl" fw={700}>
                Selamat datang!
            </Text>

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
                    {
                        (alertDokumen.length > 0 || alertRekening.length > 0) && (
                            <Divider my="xs" />
                        )
                    }
                    {
                        alertRekening.map((value: any, index) => (
                            <List.Item key={index}>
                                {`Kesalahan pengisian rekening: ${value.catatanRek}`}
                            </List.Item>
                        ))
                    }
                    {
                        alertDokumen.map((value: any, index) => (
                            <List.Item key={index}>
                                {`Kesalahan dokumen translok Bulan ${value.bulan}: ${value.catatan}`}
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
                    href="/mahasiswa/presensi"

                    withBorder>
                    <Card.Section>
                        <Center bg="var(--mantine-primary-color-filled)" c={"white"} h={150}>
                            <IconClockCheck size={50} />
                        </Center>
                    </Card.Section>
                    <Text fw={500} size="lg" mt="md">
                        Presensi
                    </Text>

                    <Text mt="xs" c="dimmed" size="sm">
                        Tandai kehadiran magang Anda
                    </Text>
                </Card>

                <Card
                    shadow="xs"
                    padding="md"
                    radius="sm"
                    component="a"
                    href="/mahasiswa/kegiatan/harian"

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
                        Catat kegiatan harian Anda selama magang
                    </Text>
                </Card>

                <Card
                    shadow="xs"
                    padding="md"
                    radius="sm"
                    component="a"
                    href="/mahasiswa/bimbingan/magang"

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

            {/* <Divider
                label={
                    <Text size="xs" c={"gray"} fw={700}>
                        Statistik Presensi
                    </Text>
                }
                labelPosition="left"
                size={2}
                my="md"
            />

            <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="lg">
                <Card withBorder padding="md" w={400}>
                    <Text fw={600} size="sm" mb="sm">
                        Rekapitulasi presensi
                        {/* <Text span c="blue" fw={700} ml="xs">
                            presentase: ${presensi.persentaseKehadiran}%
                        </Text> */}
                    {/* </Text>
                    <DonutChart
                        h={200}
                        thickness={30}
                        withTooltip={false}
                        data={
                             [
                                { name: 'Tepat waktu', value: presensi?.jumlah.tepatWaktu, color: 'indigo.6' },
                                { name: 'Terlambat', value: presensi?.jumlah.terlambat, color: 'yellow.6' },
                                { name: 'Tidak hadir', value: 0, color: 'teal.6' },
                            ]
                        }
                    />
                    <Group justify="center" mt="md" gap="xl">
                        <Stack align="center" >
                            <Text>{ presensi?.persentasePerKategori.tepatWaktu}%</Text>
                            <LegendItem label="Tepat waktu" color="blue" />
                        </Stack>

                        <Stack align="center" >
                            <Text>{presensi?.persentasePerKategori.terlambat}%</Text>
                            <LegendItem label="Terlambat" color="cyan" />
                        </Stack>

                        <Stack align="center" >
                            <Text>-</Text>
                            <LegendItem label="Tidak hadir" color="gray" />
                        </Stack>
                    </Group>
                </Card> */} 

                {/* <Card
                    shadow="xs"
                    padding="md"
                    radius="sm"
                    component="a"
                    href="/mahasiswa/presensi"
                    withBorder
                >
                    <Card.Section>
                        <Center bg="var(--mantine-primary-color-filled)" c={"white"} h={150}>
                            <IconClockCheck size={50} />
                        </Center>
                    </Card.Section>
                    <Text fw={500} size="lg" mt="md">
                        Presensi
                    </Text>
                    <Text mt="xs" c="dimmed" size="sm">
                        Tandai kehadiran magang Anda
                    </Text>
                </Card>

                <Card
                    shadow="xs"
                    padding="md"
                    radius="sm"
                    component="a"
                    href="/mahasiswa/kegiatan/harian"
                    withBorder
                >
                    <Card.Section>
                        <Center bg="var(--mantine-primary-color-filled)" c={"white"} h={150}>
                            <IconNote size={50} />
                        </Center>
                    </Card.Section>
                    <Text fw={500} size="lg" mt="md">
                        Catatan Kegiatan
                    </Text>
                    <Text mt="xs" c="dimmed" size="sm">
                        Catat kegiatan harian Anda selama magang
                    </Text>
                </Card>

                <Card
                    shadow="xs"
                    padding="md"
                    radius="sm"
                    component="a"
                    href="/mahasiswa/bimbingan/magang"
                    withBorder
                >
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
                </Card> */}
            {/* </SimpleGrid> */}
        </>
    );
}   