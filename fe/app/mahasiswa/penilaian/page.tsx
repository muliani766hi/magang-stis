'use client';

import { Box, Modal, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { DataTable } from "mantine-datatable";
import FormStepper from "@/components/FormStepper/FormStepper";

interface FormValues {
    nilai1: number | null;
    nilai2: number | null;
    nilai3: number | null;
    nilai4: number | null;
    nilai5: number | null;
    // nilai6: string;
    // nilai7: string;
    // nilai8: string;
    // nilai9: string;
    // nilai10: string;
}


const Penilaian = () => {
    const [active, setActive] = useState(0);
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm<FormValues>({
        initialValues: {
            nilai1: null,
            nilai2: null,
            nilai3: null,
            nilai4: null,
            nilai5: null,
            // nilai6: "",
            // nilai7: "",
            // nilai8: "",
            // nilai9: "",
            // nilai10: "",
        },

        validate: {
            // email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            nilai1: (value) =>
                value !== null && value >= 50 && value <= 100 ? null : "Nilai harus diantara 50 - 100",
            nilai2: (value) =>
                value !== null && value >= 50 && value <= 100 ? null : "Nilai harus diantara 50 - 100",
            nilai3: (value) =>
                value !== null && value >= 50 && value <= 100 ? null : "Nilai harus diantara 50 - 100",
            nilai4: (value) =>
                value !== null && value >= 50 && value <= 100 ? null : "Nilai harus diantara 50 - 100",
            nilai5: (value) =>
                value !== null && value >= 50 && value <= 100 ? null : "Nilai harus diantara 50 - 100",
            // nilai6: (value) =>
            //   value >= 50 && value <= 100 ? null : "Nilai harus diantara 50 - 100",
            // nilai7: (value) =>
            //   value >= 50 && value <= 100 ? null : "Nilai harus diantara 50 - 100",
            // nilai8: (value) =>
            //   value >= 50 && value <= 100 ? null : "Nilai harus diantara 50 - 100",
            // nilai9: (value) =>
            //   value >= 50 && value <= 100 ? null : "Nilai harus diantara 50 - 100",
            // nilai10: (value) =>
            //   value >= 50 && value <= 100 ? null : "Nilai harus diantara 50 - 100",
        },
    });

    const items = [
        {
            label: "Inisiatif",
            var: "nilai1",
            keterangan_1:
                "Tidak pernah menyampaikan ide/gagasan dalam melaksanakan bimbingan magang",
            keterangan_2:
                "Beberapa kali menyampaikan ide/gagasan dalam melaksanakan bimbingan magang",
            keterangan_3:
                "Sering menyampaikan ide/gagasan dalam melaksanakan bimbingan magang",
        },
        {
            label: "Disiplin",
            var: "nilai2",
            keterangan_1:
                "Jarang menyusun prnulisan laporan magang dengan tepat waktu sesuai target",
            keterangan_2:
                "Hampir selalu menyusun penulisan laporan magang tepat waktu sesuai terget",
            keterangan_3:
                "Selalu menyusun laporan penulisan laporan magang tepat waktu sesuai target",
        },
        {
            label: "Ketekunan",
            var: "nilai3",
            keterangan_1:
                "Jarang melaksanakan penulisan laporan magang sampai selesai dengan kualitas yang baik",
            keterangan_2:
                "Hampir selalu melaksanakan penulisan laporan magang sampai selesai dengan kualitas yang baik",
            keterangan_3:
                "Selalu melaksanakan penulisan laporan magang sampai selesai dengan kualitas yang baik",
        },
        {
            label: "Berpikir Kritis, Kreatif, dan Analitis",
            var: "nilai4",
            keterangan_1:
                "Kurang menunjukkan kemampuan berfikir kritis, kreatif, dan analitis yang cukup baik",
            keterangan_2:
                "Selalu menunjukkan kemampuan berfikir kritis, kreatif, dan analitis yang baik",
            keterangan_3:
                "Selalu menunjukkan kemampuan berfikir kritis, kreatif, dan analitis yang sangat baik",
        },
        {
            label: "Kemampuan Komunikasi",
            var: "nilai5",
            keterangan_1:
                "Kurang mampu melakukan komunikasi (tertulis/lisan) dalam bimbingan dan atau presentasi",
            keterangan_2:
                "Mampu melakukan komunikasi (tertulis/lisan) dalam bimbingan dan atau presentasi",
            keterangan_3:
                "Mampu melakukan komunikasi (tertulis/lisan) dalam bimbingan dan atau presentasi dengan sangat baik",
        },
    ];

    return (
        <>
            <Text size="xl" mb={10}>
                Penilaian Mahasiswa
            </Text>
            <DataTable
                highlightOnHover
                withTableBorder
                borderRadius="sm"
                withColumnBorders

                records={[
                    {
                        id: 1,
                        nim: 1,
                        nama: "Joe Biden",
                        kelas: "4SI3",
                        status: "Selesai"
                    },
                    {
                        id: 2,
                        nim: 2,
                        nama: "Kamala Harris",
                        kelas: "4SI3", status: "Selesai"
                    },
                    {
                        id: 3,
                        nim: 3,
                        nama: "Nancy Pelosi",
                        kelas: "4SI3",
                        status: "Selesai"
                    },
                    {
                        id: 4,
                        nim: 4,
                        nama: "Chuck Schumer",
                        kelas: "4SI3",
                        status: "Selesai"
                    },
                    {
                        id: 5,
                        nim: 5,
                        nama: "Mitch McConnell",
                        kelas: "4SI3",
                        status: "Selesai"
                    },
                    {
                        id: 6,
                        nim: 6,
                        nama: "Kevin McCarthy",
                        kelas: "4SI3",
                        status: "Selesai"
                    },
                    {
                        id: 7,
                        nim: 7,
                        nama: "Steny Hoyer",
                        kelas: "4SI3",
                        status: "Selesai"
                    },
                    {
                        id: 8,
                        nim: 8,
                        nama: "Jim Clyburn",
                        kelas: "4SI3",
                        status: "Belum Dinilai",
                    },
                    {
                        id: 9,
                        nim: 9,
                        nama: "Liz Cheney",
                        kelas: "4SI3",
                        status: "Belum Dinilai",
                    },
                    {
                        id: 10,
                        nim: 10,
                        nama: "Steve Scalise",
                        kelas: "4SI3",
                        status: "Belum Dinilai",
                    },
                ]}
                // define columns
                columns={[
                    {
                        accessor: "nim",
                        // this column has a custom title
                        title: "NIM",
                        // right-align column
                        textAlign: "right",
                    },
                    { accessor: "nama" },

                    { accessor: "kelas" },
                    {
                        accessor: "status",
                        // this column has custom cell data rendering
                        render: ({ status }) => (
                            <Box fw={700} c={status === "Selesai" ? "green" : "red"}>
                                {status}
                            </Box>
                        ),
                    },
                ]}
                // execute this callback when a row is clicked
                onRowClick={open}
            />
            <Modal
                size="xl"
                opened={opened}
                onClose={close}
                closeOnClickOutside={false}
                title="Penilaian"
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <Modal.Body>
                    <FormStepper
                        items={items}
                        active={active}
                        setActive={setActive}
                        form={form}
                    />
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Penilaian