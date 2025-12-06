'use client'

import { useState, useEffect } from "react";
import { ActionIcon, Card, Center, Divider, Image, SimpleGrid, Text, Stack, Title, Group, Badge, Flex } from "@mantine/core";
import { IconCalendarCheck, IconCashBanknote, IconClockCheck, IconFileAnalytics, IconLocation, IconLocationBolt, IconLocationPin, IconMap, IconMapPin, IconNote, IconPin } from "@tabler/icons-react";
import { BarChart } from '@mantine/charts';
import { getChartPerizinan } from '@/utils/presensi'
import { getChartJmlhMhs } from '@/utils//kelola-user/mahasiswa'

const colors = {
    disetujui: '#228be6',
    dikembalikan: '#4dabf7',
    menunggu: '#d0ebff',
};

const JENIS_MAPPING: Record<string, string> = {
    'izin sakit rawat inap': 'RAWAT INAP',
    'izin dispensasi': 'DISPENSASI',
    'izin keperluan penting': 'IZIN',
    'izin sakit rawat jalan': 'RAWAT JALAN',
    '': 'TANPA KETERANGAN',
    null: 'TANPA KETERANGAN',
    'website error': 'WEBSITE ERROR',
    'dinas luar': 'DINAS LUAR',
    '': 'PERIZINAN KAMPUS',
};


export default function Home() {
    const [chartDataPerizinan, setChartDataPerizinan] = useState([]);
    const [chartDataManual, setChartDataManual] = useState([]);
    const [chartMahasiswa, setChartMahasiswa] = useState([])

    const fetchChartPerizinan = async () => {
        const result = await getChartPerizinan();

        const defaultDataPerizinan = [
            'RAWAT INAP',
            'DISPENSASI',
            'IZIN',
            'RAWAT JALAN',
            'TANPA KETERANGAN'
        ];

        const mappedPerizinan = defaultDataPerizinan.map(label => {
            const jenisBackend = Object.keys(JENIS_MAPPING).find(
                key => JENIS_MAPPING[key] === label
            );

            const data = result.perizinan.find((item: any) => item.jenis === jenisBackend || (!item.jenis && label === 'TANPA KETERANGAN'));

            return {
                jenis: label,
                jumlah: data ? data.jumlah || data._count?.jenis || 0 : 0
            };
        });

        const defaultDataManual = [
            'WEBSITE ERROR',
            'DINAS LUAR',
            'PERIZINAN KAMPUS',
        ];

        const mapped = defaultDataManual.map(label => {
            const jenisBackend = Object.keys(JENIS_MAPPING).find(
                key => JENIS_MAPPING[key] === label
            );

            const data = result.manual.find((item: any) => item.jenis === jenisBackend || (!item.jenis && label === 'TANPA KETERANGAN'));

            return {
                jenis: label,
                jumlah: data ? data.jumlah || data._count?.jenis || 0 : 0
            };
        });

        setChartDataManual(mapped as any);
        setChartDataPerizinan(mappedPerizinan as any);
    };

    const fetchChartMhs = async () => {
        const result = await getChartJmlhMhs();

        // Filter hanya prodi yang diperlukan
        const allowed = ['DIV ST', 'DIV KS', 'DIII ST'];

        const mapped = allowed.map(label => {
            const data = result.find((item: any) => item.jenis === label);

            return {
                prodi: label,
                jumlah: data ? data.jumlah : 0
            };
        });
        setChartMahasiswa(mapped as any);
    };


    useEffect(() => {
        fetchChartPerizinan();
        fetchChartMhs()
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
                    href="/admin/bimbingan/magang"

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

                <Card
                    shadow="xs"
                    padding="md"
                    radius="sm"
                    component="a"
                    href="/admin/penempatan/alokasi"

                    withBorder>
                    <Card.Section>
                        <Center bg="var(--mantine-primary-color-filled)" c={"white"} h={150}>
                            <IconMapPin size={50} />
                        </Center>
                    </Card.Section>
                    <Text fw={500} size="lg" mt="md">
                        Penempatan Magang
                    </Text>

                    <Text mt="xs" c="dimmed" size="sm">
                        Alokasi penempatan magang mahasiswa
                    </Text>
                </Card>

                <Card
                    shadow="xs"
                    padding="md"
                    radius="sm"
                    component="a"
                    href="/admin/laporan-magang"

                    withBorder>
                    <Card.Section>
                        <Center bg="var(--mantine-primary-color-filled)" c={"white"} h={150}>
                            <IconFileAnalytics size={50} />
                        </Center>
                    </Card.Section>
                    <Text fw={500} size="lg" mt="md">
                        Laporan Magang
                    </Text>

                    <Text mt="xs" c="dimmed" size="sm">
                        Daftar Laporan Magang Mahasiswa
                    </Text>
                </Card>

            </SimpleGrid>

            {/* <Divider
                label={
                    <Text
                        size="xs"
                        c={"gray"}
                        fw={700}
                    > Grafik
                    </Text >
                }
                labelPosition="left"
                size={2}
                my="md"
                mt={40}
            /> */}

            {/* <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} w="full">
                <Card withBorder padding="md" style={{ gridColumn: "span 2" }}>
                    <BarChart
                        h={300}
                        data={chartDataPerizinan}
                        dataKey="jenis"
                        series={[{ name: 'jumlah', color: '#4dabf7' }]}
                        yAxisLabel="Jumlah Perizinan Mahasiswa"
                    />
                </Card>
                <Card withBorder mt="md" padding="md" style={{ gridColumn: "span 1" }}>
                    <BarChart
                        h={300}
                        data={chartDataManual}
                        dataKey="jenis"
                        series={[{ name: 'jumlah', color: '#4dabf7' }]}
                        yAxisLabel="Jumlah Kendala Mahasiswa"
                    />
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Stack gap="xs">
                        <Flex gap="xs">
                            <Title order={5}>Jumlah Mahasiswa</Title>
                            <Group gap="xs">
                                <Badge color="blue">D-IV ST</Badge>
                                <Badge color="yellow">D-IV KS</Badge>
                                <Badge color="gray">D-III ST</Badge>
                            </Group>
                        </Flex>
                        <Divider my="sm" />
                        <BarChart
                            h={300}
                            data={chartMahasiswa}
                            dataKey="prodi"
                            series={[{ name: 'jumlah', color: 'blue.6' }]}
                            valueFormatter={(value: any) => `${value}`}
                            tooltipAnimationDuration={200}
                            orientation="vertical"
                            gridAxis="none"
                            barProps={{ radius: 10 }}
                            maxBarWidth={35}
                        />
                        <Divider my="sm" />

                    </Stack>
                </Card>
            </SimpleGrid> */}
        </>
    )
}
