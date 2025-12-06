'use client';
import AppShellResponsive from "@/components/AppShellResponsive/AppShellResponsive"
import { NavbarProps } from "@/components/Navbar/Navbar"
import { IconAdjustments, IconCalendarStats, IconClock, IconClockCheck, IconFileAnalytics, IconGauge, IconHome2, IconLock, IconNotes, IconPresentationAnalytics } from "@tabler/icons-react";

const profilePath: string = "/baak/profil";

const mockdata: NavbarProps[] = [
    {
        label: "Beranda",
        icon: IconHome2,
        link: "/baak",
    },
    {
        label: "Daftar Presensi",
        icon: IconClockCheck,
        link: "/baak/presensi",
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