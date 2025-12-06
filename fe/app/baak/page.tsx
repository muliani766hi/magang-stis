'use client'
import { ActionIcon, Card, Center, Divider, Image, SimpleGrid, Text } from "@mantine/core";
import { IconCalendarCheck, IconClockCheck, IconNote } from "@tabler/icons-react";

export default function Home() {
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
                    href="/baak/presensi"

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

                {/* <Card
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
                </Card> */}
            </SimpleGrid>
        </>
    )
}
