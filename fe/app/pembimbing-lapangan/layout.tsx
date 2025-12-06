'use client';
import AppShellResponsive from "@/components/AppShellResponsive/AppShellResponsive"
import { NavbarProps } from "@/components/Navbar/Navbar"
import { IconAdjustments, IconCalendarStats, IconClockCheck, IconFileAnalytics, IconGauge, IconHome2, IconLock, IconNote, IconNotebook, IconNotes, IconPresentationAnalytics } from "@tabler/icons-react";

const profilePath: string = "/pembimbing-lapangan/profil";

const mockdata: NavbarProps[] = [
    {
        label: "Beranda",
        icon: IconHome2,
        link: "/pembimbing-lapangan",
    },
    {
        label: "Daftar Presensi",
        icon: IconClockCheck,
        link: "/pembimbing-lapangan/presensi",
    },
    {
        label: "Catatan Kegiatan",
        icon: IconNotes,
        link: undefined,
        initiallyOpened: true,
        links: [
            {
                label: "Kegiatan Harian",
                link: "/pembimbing-lapangan/kegiatan/harian",
                icon: IconNote,
            },
            {
                label: "Kegiatan Bulanan",
                link: "/pembimbing-lapangan/kegiatan/bulanan",
                icon: IconNotebook,
            },
        ],
    },
    {
        label: "Perizinan Kampus",
        icon: IconCalendarStats,
        link: "/pembimbing-lapangan/bimbingan/perizinan",
    },
    {
        label: "Laporan Magang",
        icon: IconFileAnalytics,
        link: "/pembimbing-lapangan/laporan-magang",
    },
    {
        label: "Penilaian",
        icon: IconPresentationAnalytics,
        link: undefined,
        initiallyOpened: false,
        links: [
            {
                label: "Kinerja",
                link: "/pembimbing-lapangan/penilaian/kinerja",
                icon: IconNote,
            },
            {
                label: "Laporan",
                link: "/pembimbing-lapangan/penilaian/laporan",
                icon: IconNotebook,
            },
        ],
    },

];


const AppShell = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <AppShellResponsive
            mockdata={mockdata}
            profilePath={profilePath}
        >{children}</AppShellResponsive>
    )
}

export default AppShell