'use client'

import { ActionIcon, Alert, Button, Card, Group, Loader, LoadingOverlay, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { PresensiProps } from './page';
import { IconAlertCircle, IconMapPin } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { getPresensiManual, postPresensi } from '@/utils/presensi';
import { getToken } from '@/utils/get-profile';

export interface MapProps {
    latitude: number | null;
    longitude: number | null;
}

function haversine(lat1: any, lon1: any, lat2: any, lon2: any) {
    const R = 6371.0; // Radius bumi dalam kilometer
    const toRadians = (degree: any) => degree * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

const Map = ({ currentLocation, targetLocation, fetchData, records, loading }: { currentLocation: MapProps, targetLocation: PresensiProps, fetchData: () => void, records: any, loading: boolean }) => {
    const mapUrl = `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}&output=embed`;
    const mapTargetUrl = `https://www.google.com/maps?q=${targetLocation.latitude},${targetLocation.longitude}`;
    // local time string interval 1 second
    const [localTime, setLocalTime] = useState<string | null>(null);
    // local day and date 
    const date = new Date();
    const dateString = date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        const interval = setInterval(() => {
            setLocalTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const [distance, setDistance] = useState<number | null>(null);

    const [isFormSubmitted, setIsFormSubmitted] = useState(false); // cek if form is submitted

    const [dataPresensiManual, setDataPresensiManual] = useState<any[]>([]);
    const [dataPresensiManualToday, setDataPresensiManualToday] = useState<any[]>([]);
    const [loadingButtonTandai, setLoadingButtonTandai] = useState(false);

    const fetchDataPresensiManual = async () => {
        try {
            const response = await getPresensiManual();
            let modifiedDataPresensiManual = response.data.map((item: { presensiManualId: any; }) => ({
                ...item,
                id: item.presensiManualId,
            }));

            modifiedDataPresensiManual.sort((a: { tanggal: string; }, b: { tanggal: string; }) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

            const filteredData = response.data.filter((item: { tanggal: string; }) => new Date(item.tanggal).toLocaleDateString() === new Date().toLocaleDateString());

            setDataPresensiManual(modifiedDataPresensiManual);
            setDataPresensiManualToday(filteredData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    }

    useEffect(() => {
        fetchDataPresensiManual();
    }, []);

    useEffect(() => {
        // Update form submission status based on the updated state.
        if (dataPresensiManualToday.length === 0) {
            setIsFormSubmitted(false);
        } else {
            setIsFormSubmitted(true);
        }
    }, [dataPresensiManualToday]);

    const form = useForm({
        initialValues: {
            tanggal: '',
            keterangan: '',
            id: '',
            filePresensi: null,
        },
        validate: {
            tanggal: (value) => {
                if (!value) {
                    return 'tanggal tidak boleh kosong';
                }
            },
            keterangan: (value) => {
                if (!value) {
                    return 'keterangan tidak boleh kosong';
                }
            },
        }
    });

    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (currentLocation.latitude && currentLocation.longitude && targetLocation?.latitude && targetLocation?.longitude) {
            const dist = haversine(currentLocation.latitude, currentLocation.longitude, targetLocation.latitude, targetLocation.longitude);
            setDistance(dist);
        }
    }, [currentLocation, targetLocation]);

    const withinRadius = distance !== null && distance <= 0.05;

    const formatDistance = (distance: number) => {
        if (distance < 1) {
            return `${(distance * 1000).toFixed(2)} meter`;
        }
        return `${distance.toFixed(2)} km`;
    };

    const handleFileUpload = async (value: any, file: any) => {
        const token = await getToken();

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const formdata = new FormData();
        formdata.append("json", JSON.stringify({
            keterangan: value.keterangan,
            tanggal: value.tanggal.setHours(9)
        }));

        formdata.append("file", file);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/presensi-manual`, requestOptions);
            if (!response.ok) {
                throw new Error(await response.text());
            }
        } catch (error) {
            throw new Error(`${error}`);

        }
    }

    return (
        <>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mt="lg">
                <Stack gap="md" h={"100%"}>
                    <Card shadow="xs" padding="md" radius="sm" withBorder>
                        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                        <Stack gap="xs">
                            <Group justify='space-between' wrap='nowrap'>
                                <Text size='lg' fw={500}>Lokasi Magang: {targetLocation?.nama}</Text>
                                <ActionIcon
                                    variant='light'
                                    size="lg"
                                    onClick={() => {
                                        window.open(mapTargetUrl, '_blank');
                                    }}
                                    title='Lokasi magang'
                                >
                                    <IconMapPin style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                </ActionIcon>
                            </Group>
                            <Text size='md'>{dateString}</Text>
                            <Text size='xl' fw={700}
                            >{localTime ? localTime : <Loader color="grey" type="dots" />}</Text>

                            {/* {disable button if current location is not in radius of 50m target location} */}
                            <Group justify={withinRadius ? 'right' : 'space-between'}
                                wrap="nowrap">
                                {distance !== null ? (
                                    <Alert variant='light' color='red' title='Anda di luar lokasi magang' hidden={withinRadius} icon={<IconAlertCircle />} >
                                        <Text size='xs' c="dimmed">Jarak Anda dengan lokasi magang adalah {distance && formatDistance(distance)}</Text>
                                    </Alert>) : (
                                    <Alert variant='light' color='red' title='Aktifkan Lokasi' hidden={withinRadius} icon={<IconAlertCircle />}>
                                        <Text size='xs' c="dimmed">Pastikan Anda mengaktifkan akses lokasi di browser Anda</Text>
                                    </Alert>
                                )}
                                <Button
                                    loading={loadingButtonTandai}
                                    variant="light"
                                    disabled={!withinRadius}
                                    // check if already datang in that day
                                    // || records.some((record: { tanggal: string; }) => new Date(record.tanggal).toLocaleDateString() === new Date().toLocaleDateString())

                                    // || (new Date().getHours() >= 8 && new Date().getHours() <= 15)
                                    // || (new Date().getHours() >= 18 && new Date().getHours() <= 6)
                                    // }
                                    onClick={async () => {
                                        try {
                                            setLoadingButtonTandai(true);

                                            // const pad = (num: any) => num.toString().padStart(2, '0');

                                            // const offset = -waktu.getTimezoneOffset();
                                            // const sign = offset >= 0 ? '+' : '-';
                                            // const hoursOffset = pad(Math.floor(Math.abs(offset) / 60));
                                            // const minutesOffset = pad(Math.abs(offset) % 60);

                                            // const isoStringWithTimeZone = `${waktu.getFullYear()}-${pad(waktu.getMonth() + 1)}-${pad(waktu.getDate())}T${pad(waktu.getHours())}:${pad(waktu.getMinutes())}:${pad(waktu.getSeconds())}`;

                                            // const tanggal = waktu.toLocaleDateString();
                                            // const tanggal = new Date().toLocaleDateString();
                                            const values = {
                                                waktu: new Date().toLocaleString('en-US'),
                                                tanggal: new Date().toLocaleString('en-US'),
                                            };

                                            // console.log(values)

                                            const response = await postPresensi(values);

                                            // if (!response.ok) {
                                            //     throw new Error("Failed to post presensi");
                                            //     console.log(await response.text());
                                            // }

                                            fetchData();
                                            notifications.show({
                                                title: 'Berhasil',
                                                message: 'Anda berhasil menandai kedatangan',
                                                color: 'green',
                                            });

                                        } catch (error) {
                                            notifications.show({
                                                title: 'Gagal',
                                                message: 'Anda tidak bisa menandai kedatangan saat ini',
                                                color: 'red',
                                            });
                                        } finally {
                                            setLoadingButtonTandai(false);
                                        }
                                    }}
                                >
                                    Tandai
                                </Button>
                            </Group>
                        </Stack>
                    </Card>
                </Stack >
                <Paper shadow='xs' radius='sm' withBorder style={{ position: 'relative', height: '100%' }}>
                    <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    <iframe
                        title="User Location Map"
                        width="100%"
                        height="100%"
                        src={mapUrl}
                        allowFullScreen
                        loading="lazy"
                        style={{
                            border: "none",
                            borderRadius: "0.25rem", // Example: Add border radius
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" // Example: Add shadow
                        }}
                    ></iframe>
                </Paper>
            </SimpleGrid >
        </>
    );
};

export default Map;
