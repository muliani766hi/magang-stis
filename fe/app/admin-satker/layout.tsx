'use client';
import AppShellResponsive from "@/components/AppShellResponsive/AppShellResponsive"
import { NavbarProps } from "@/components/Navbar/Navbar"
import { IconAdjustments, IconCalendarStats, IconClockCheck, IconFileAnalytics, IconGauge, IconHome2, IconLock, IconNotes, IconPresentationAnalytics, IconUser } from "@tabler/icons-react";

const profilePath: string = "/admin-satker/profil";

const mockdata: NavbarProps[] = [
    {
        label: "Beranda",
        icon: IconHome2,
        link: "/admin-satker",
    },
    // {
    //     label: "Penempatan Magang",
    //     icon: IconPresentationAnalytics,
    //     links: [
    //         {
    //             label: "Alokasi",
    //             link: "/admin-satker/penempatan/alokasi",
    //             icon: IconAdjustments,
    //         },
    //         {
    //             label: "Unit Kerja",
    //             link: "/admin-satker/penempatan/unit-kerja",
    //             icon: IconAdjustments,
    //         }
    //     ],
    // },
    {
        label: "Daftar Presensi",
        icon: IconClockCheck,
        link: "/admin-satker/presensi",
    },
    {
        label: "Kelola Pembimbing Lapangan",
        icon: IconUser,
        link: "/admin-satker/kelola/pembimbing-lapangan",
    }
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