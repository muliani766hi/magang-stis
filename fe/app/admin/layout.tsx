'use client';
import AppShellResponsive from "@/components/AppShellResponsive/AppShellResponsive"
import { NavbarProps } from "@/components/Navbar/Navbar"
import { IconAdjustments, IconBook,IconClockCheck, IconBuilding, IconCalendarCheck, IconCalendarClock, IconCalendarStats, IconCashBanknote, IconFileAnalytics, IconGauge, IconHome2, IconLock, IconMapPin, IconNote, IconNotebook, IconNotes, IconPresentationAnalytics, IconUser, IconUserCode, IconUserSearch, IconUserShield, IconUsersGroup, IconUsersPlus , IconCalendar} from "@tabler/icons-react";

const profilePath: string = "/admin/profil";

const mockdata: NavbarProps[] = [
    {
        label: "Beranda",
        icon: IconHome2,
        link: "/admin",
    },
    {
        label: "Daftar Presensi",
        icon: IconClockCheck,
        link: "/admin/presensi",
    },
    {
        label: "Pengumuman",
        icon: IconHome2,
        link: "/admin/pengumuman",
    },
    // {
    //     label: "Catatan Kegiatan",
    //     icon: IconNotes,
    //     link: undefined,
    //     // initiallyOpened: true,
    //     links: [
    //         {
    //             label: "Kegiatan Harian",
    //             link: "/admin/kegiatan/harian",
    //             icon: IconNote,
    //         },
    //         {
    //             label: "Kegiatan Bulanan",
    //             link: "/admin/kegiatan/bulanan",
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
                link: "/admin/bimbingan/magang",
                icon: IconCalendarCheck,
            },
            {
                label: "Perizinan Kampus",
                link: "/admin/bimbingan/perizinan",
                icon: IconCalendarClock,
            },
        ],
    },
    // {
    //     label: "Rekening",
    //     icon: IconCashBanknote,
    //     link: "/admin/rekening",
    // },

    {
        label: "Penempatan Magang",
        icon: IconPresentationAnalytics,
        links: [
            {
                label: "Alokasi",
                link: "/admin/penempatan/alokasi",
                icon: IconMapPin,
            },
            {
                label: "Unit Kerja",
                link: "/admin/penempatan/unit-kerja",
                icon: IconBuilding,
            }
        ]
    },
    {
        label: "Laporan Magang",
        icon: IconFileAnalytics,
        link: "/admin/laporan-magang"
    },
    {
        label: "Tahun Ajaran",
        icon: IconCalendar,
        link: "/admin/tahun-ajaran"
    },
    {
        label: "Kelola Pengguna",
        icon: IconUser,
        links: [
            {
                label: "Mahasiswa",
                link: "/admin/kelola-user/mahasiswa",
                icon: IconUsersGroup
            },
            {
                label: "Dosen Pembimbing",
                link: "/admin/kelola-user/dosen-pembimbing",
                icon: IconUserShield
            },
            {
                label: "Pembimbing Lapangan",
                link: "/admin/kelola-user/pembimbing-lapangan",
                icon: IconUserSearch
            },
            {
                label: "Admin Provinsi",
                link: "/admin/kelola-user/admin-provinsi",
                icon: IconUserCode
            },
            // {
            //     label: "Admin Satker",
            //     link: "/admin/kelola-user/admin-provinsi",
            //     icon: IconUserCode
            // },
            {
                label: "Keuangan",
                link: "/admin/kelola-user/kabag",
                icon: IconUserCode
            }
        ],
    },
    {
        label: "Pemberkasan",
        icon: IconCalendar,
        link: "/admin/pemberkasan"
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