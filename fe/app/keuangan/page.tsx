'use client'
import { useEffect, useState } from "react";
import {
    IconInfoCircle,
    IconNote,
    IconReportMoney,
} from "@tabler/icons-react";
import { getPengumuman } from "@/utils/pengumuman";
import {
    Alert,
    Card,
    Center,
    Divider,
    Group,
    List,
    SimpleGrid,
    Text,
} from "@mantine/core";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [pengumuman, setPengumuman] = useState([]);

    const fetchPengumuman = async () => {
        const pengumuman = await getPengumuman();
        setPengumuman(pengumuman.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPengumuman();
    }, []);

    return (
        <>
            <Text c="dimmed" mb="md">
                Beranda
            </Text>
            <Text size="xl" fw={700}>Selamat datang!</Text>

            <Alert my="md" variant="light" title="" icon={<IconInfoCircle />}>
                <Group justify="space-between" mb="xs">
                    <Text fw={700}>Pengumuman</Text>
                </Group>
                <List size="xs">
                    {pengumuman.map((value: any, index) => (
                        <List.Item key={index}>
                            {value.deskripsi}
                        </List.Item>
                    ))}
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
                    href="/keuangan/rekening"

                    withBorder>
                    <Card.Section>
                        <Center bg="var(--mantine-primary-color-filled)" c={"white"} h={150}>
                            <IconReportMoney size={50} />
                        </Center>
                    </Card.Section>
                    <Text fw={500} size="lg" mt="md">
                        Rekening
                    </Text>

                    <Text mt="xs" c="dimmed" size="sm">
                        Data rekening mahasiswa
                    </Text>
                </Card>

                <Card
                    shadow="xs"
                    padding="md"
                    radius="sm"
                    component="a"
                    href="/keuangan/pemberkasan"

                    withBorder>
                    <Card.Section>
                        <Center bg="var(--mantine-primary-color-filled)" c={"white"} h={150}>
                            <IconNote size={50} />
                        </Center>
                    </Card.Section>
                    <Text fw={500} size="lg" mt="md">
                        Pemberkasan 
                    </Text>

                    <Text mt="xs" c="dimmed" size="sm">
                        File dokumen translok
                    </Text>
                </Card>

            </SimpleGrid>
        </>
    );
}
