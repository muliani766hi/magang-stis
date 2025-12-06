'use client';
import AppShellResponsive from "@/components/AppShellResponsive/AppShellResponsive"
import { NavbarProps } from "@/components/Navbar/Navbar"
import { IconClockCheck } from "@tabler/icons-react";
import { IconAdjustments, IconCalendarStats, IconFileAnalytics, IconGauge, IconHome2, IconLock, IconNote, IconNotebook, IconNotes, IconPresentationAnalytics } from "@tabler/icons-react";

const profilePath: string = "/dosen-pembimbing/profil";

const mockdata: NavbarProps[] = [
    {
        label: "Beranda",
        icon: IconHome2,
        link: "/dosen-pembimbing",
    },
    {
        label: "Daftar Presensi",
        icon: IconClockCheck,
        link: "/dosen-pembimbing/presensi",
    },
    {
        label: "Catatan Kegiatan",
        icon: IconNotes,
        link: undefined,
        initiallyOpened: false,
        links: [
            {
                label: "Kegiatan Harian",
                link: "/dosen-pembimbing/kegiatan/harian",
                icon: IconNote,
            },
            {
                label: "Kegiatan Bulanan",
                link: "/dosen-pembimbing/kegiatan/bulanan",
                icon: IconNotebook,
            },
        ],
    },
    {
        label: "Bimbingan Magang",
        icon: IconCalendarStats,
        link: "/dosen-pembimbing/bimbingan/magang",
    },
    {
        label: "Laporan Magang",
        icon: IconFileAnalytics,
        link: "/dosen-pembimbing/laporan-magang",
    },
    {
        label: "Penilaian",
        icon: IconPresentationAnalytics,
        link: undefined,
        initiallyOpened: false,
        links: [
            {
                label: "Bimbingan",
                link: "/dosen-pembimbing/penilaian/bimbingan",
                icon: IconNote,
            },
            {
                label: "Laporan",
                link: "/dosen-pembimbing/penilaian/laporan",
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