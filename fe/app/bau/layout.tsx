'use client';
import AppShellResponsive from "@/components/AppShellResponsive/AppShellResponsive"
import { NavbarProps } from "@/components/Navbar/Navbar"
import { IconCashBanknote, IconHome2 } from "@tabler/icons-react";
import { IconAdjustments, IconCalendarStats, IconFileAnalytics, IconGauge, IconLock, IconNotes, IconPresentationAnalytics } from "@tabler/icons-react";

const profilePath: string = "/bau/profil";

const mockdata: NavbarProps[] = [
    {
        label: "Beranda",
        icon: IconHome2,
        link: "/bau",
    },
    // {
    //     label: "Rekening",
    //     icon: IconCashBanknote,
    //     link: "/bau/rekening",
    // }
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