'use client';
import AppShellResponsive from "@/components/AppShellResponsive/AppShellResponsive"
import { NavbarProps } from "@/components/Navbar/Navbar"
import { IconBuilding, IconMap2 } from "@tabler/icons-react";
import { IconAdjustments, IconCalendarCheck, IconCalendarClock, IconCalendarStats, IconClockCheck, IconFileAnalytics, IconGauge, IconHome, IconHome2, IconLock, IconMapPin, IconNote, IconNoteOff, IconNotebook, IconNotes, IconPresentationAnalytics } from "@tabler/icons-react";

// TODO: Replace with actual profile path
const profilePath: string = "/mahasiswa/profil";
const updateProfilePath: string = "/mahasiswa/profil/update"
// TODO: Replace with actual data
const mockdata: NavbarProps[] = [
    {
        label: "Beranda",
        icon: IconHome2,
        link: "/mahasiswa",
    },
    {
        label: "Presensi",
        icon: IconClockCheck,
        link: "/mahasiswa/presensi"
    },
    {
        label: "Catatan Kegiatan",
        icon: IconNotes,
        link: undefined,
        links: [
            {
                label: "Kegiatan Harian",
                link: "/mahasiswa/kegiatan/harian",
                icon: IconNote,
            },
            {
                label: "Kegiatan Bulanan",
                link: "/mahasiswa/kegiatan/bulanan",
                icon: IconNotebook,
            },
        ],
    },
    // {
    //     label: "Penempatan",
    //     icon: IconNotes,
    //     link: undefined,
    //     links: [
    //         {
    //             label: "Kegiatan Harian",
    //             link: "/mahasiswa/penempatan/unit-kerja",
    //             icon: IconNote,
    //         },
    //         {
    //             label: "Kegiatan Bulanan",
    //             link: "/mahasiswa/penempatan/alokasi",
    //             icon: IconNotebook,
    //         },
    //     ],
    // },
    {
        label: "Bimbingan",
        icon: IconCalendarStats,
        link: undefined,
        links: [
            {
                label: "Bimbingan Magang",
                link: "/mahasiswa/bimbingan/magang",
                icon: IconCalendarCheck,
            },
            {
                label: "Perizinan Kampus",
                link: "/mahasiswa/bimbingan/perizinan",
                icon: IconCalendarClock,
            },
        ],
    },
    {
        label: "Penempatan Magang",
        icon: IconBuilding,
        link: "/mahasiswa/penempatan-magang"
    },
    {
        label: "Laporan",
        icon: IconFileAnalytics,
        link: undefined,
        links: [
            {
                label: "Presentasi Laporan",
                link: "/mahasiswa/presentasi-laporan",
                icon: IconPresentationAnalytics,
            },
            {
                label: "Laporan Magang",
                link: "/mahasiswa/laporan-magang",
                icon: IconFileAnalytics,
            },

        ],
    },
    {
        label: "Dokumen Translok",
        icon: IconBuilding,
        link: "/mahasiswa/dokumen-translok"
    },
];


const AppShell = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <AppShellResponsive
            mockdata={mockdata}
            profilePath={profilePath}
            updateProfilePath={updateProfilePath}
        >{children}</AppShellResponsive>
    )
}

export default AppShell