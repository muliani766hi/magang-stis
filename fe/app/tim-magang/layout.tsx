'use client';
import AppShellResponsive from "@/components/AppShellResponsive/AppShellResponsive"
import { NavbarProps } from "@/components/Navbar/Navbar"
import { IconAdjustments, IconBuilding, IconCalendarCheck, IconCalendarClock, IconCalendarStats, IconCashBanknote, IconFileAnalytics, IconGauge, IconHome2, IconLock, IconMapPin, IconNotes, IconPresentationAnalytics, IconUser, IconUserCode, IconUserSearch, IconUserShield, IconUsersGroup } from "@tabler/icons-react";

const profilePath: string = "/tim-magang/profil";

const mockdata: NavbarProps[] = [
    {
        label: "Beranda",
        icon: IconHome2,
        link: "/tim-magang",
    },
    // {
    //     label: "Catatan Kegiatan",
    //     icon: IconNotes,
    //     link: undefined,
    //     // initiallyOpened: true,
    //     links: [
    //         {
    //             label: "Kegiatan Harian",
    //             link: "/tim-magang/kegiatan/harian",
    //             icon: IconNote,
    //         },
    //         {
    //             label: "Kegiatan Bulanan",
    //             link: "/tim-magang/kegiatan/bulanan",
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
                link: "/tim-magang/bimbingan/magang",
                icon: IconCalendarCheck
            },
            {
                label: "Bimbingan Skripsi",
                link: "/tim-magang/bimbingan/skripsi",
                icon: IconCalendarClock
            },
        ],
    },
    {
        label: "Rekening",
        icon: IconCashBanknote,
        link: "/tim-magang/rekening",
    },

    {
        label: "Penempatan Magang",
        icon: IconPresentationAnalytics,
        links: [
            {
                label: "Alokasi",
                link: "/tim-magang/penempatan/alokasi",
                icon: IconMapPin,
            },
            {
                label: "Unit Kerja",
                link: "/tim-magang/penempatan/unit-kerja",
                icon: IconBuilding,
            }
        ]
    },
    {
        label: "Laporan Magang",
        icon: IconFileAnalytics,
        link: "/tim-magang/laporan-magang"
    },
    {
        label: "Kelola Akun",
        icon: IconUser,
        links: [
            {
                label: "Mahasiswa",
                link: "/tim-magang/kelola-user/mahasiswa",
                icon: IconUsersGroup
            },
            {
                label: "Dosen Pembimbing",
                link: "/tim-magang/kelola-user/dosen-pembimbing",
                icon: IconUserShield
            },
            {
                label: "Pembimbing Lapangan",
                link: "/tim-magang/kelola-user/pembimbing-lapangan",
                icon: IconUserSearch
            },
            {
                label: "Admin Provinsi",
                link: "/tim-magang/kelola-user/admin-provinsi",
                icon: IconUserCode
            }
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