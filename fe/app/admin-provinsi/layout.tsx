'use client';
import AppShellResponsive from "@/components/AppShellResponsive/AppShellResponsive"
import { NavbarProps } from "@/components/Navbar/Navbar"
import { IconAdjustments, IconBrandOffice, IconBuilding, IconCalendarStats, IconFileAnalytics, IconGauge, IconHome2, IconLock, IconMapPin, IconNotes, IconPresentationAnalytics, IconUser } from "@tabler/icons-react";

const profilePath: string = "/admin-provinsi/profil";

const mockdata: NavbarProps[] = [
    {
        label: "Beranda",
        icon: IconHome2,
        link: "/admin-provinsi",
    },
    {
        label: "Penempatan Magang",
        icon: IconPresentationAnalytics,
        links: [
            {
                label: "Alokasi",
                link: "/admin-provinsi/penempatan/alokasi",
                icon: IconMapPin,
            },
            {
                label: "Unit Kerja",
                link: "/admin-provinsi/penempatan/unit-kerja",
                icon: IconBuilding,
            }
        ],
    },
    {
        label: "Kelola Admin Satker",
        icon: IconUser,
        link: "/admin-provinsi/kelola/admin-satker",
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