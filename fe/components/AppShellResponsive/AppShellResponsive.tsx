
import { AppShell, Avatar, Burger, Group, Menu, Text, useComputedColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { SwitchMode } from '@/components/SwitchMode/SwitchMode';
import { Navbar } from '@/components/Navbar/Navbar';
import { IconAdjustments, IconCalendarStats, IconFileAnalytics, IconGauge, IconLock, IconNotes, IconPresentationAnalytics } from '@tabler/icons-react';
import { NavbarProps } from '@/components/Navbar/Navbar';
import Image from 'next/image';
import { logout } from '@/lib';
import { getProfile } from '@/utils/get-profile';


const AppShellResponsive = ({ children, mockdata, profilePath, updateProfilePath }: Readonly<{ children: React.ReactNode, mockdata: NavbarProps[], profilePath: string, updateProfilePath?: string }>) => {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const router = useRouter();
    const [dataProfile, setDataProfile] = useState<{ email?: string }>({});
    const computedColorScheme = useComputedColorScheme();
    const [imageSrc, setImageSrc] = useState('/MagangSTIS.svg');

    const fetchData = async () => {
        try {
            const response = await getProfile();
            setDataProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    }

    useEffect(() => {
        fetchData();
        setImageSrc(computedColorScheme === 'dark' ? "/Magang-dark.svg" : "/MagangSTIS.svg");
    }, [computedColorScheme]);

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: "sm",
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger
                            opened={mobileOpened}
                            onClick={toggleMobile}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <Burger
                            opened={desktopOpened}
                            onClick={toggleDesktop}
                            visibleFrom="sm"
                            size="sm"
                        />
                        <Image
                            src={imageSrc}
                            alt="Magang Logo"
                            width={180}
                            height={40}
                            priority
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                router.push('/');
                            }}
                        />
                    </Group>
                    <Group>
                        <SwitchMode />
                        <Text size='xs' visibleFrom='xs'>{dataProfile?.email}</Text>
                        <Menu position="bottom-end">
                            <Menu.Target>
                                <Avatar radius="xl" />
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    onClick={() => {
                                        router.push(profilePath);
                                    }}
                                >
                                    Profil
                                </Menu.Item>
                                {
                                    updateProfilePath && (
                                <Menu.Item
                                    onClick={() => {
                                        router.push(updateProfilePath);
                                    }}
                                >
                                    Update Biodata
                                </Menu.Item>
                                    )
                                }
                                <Menu.Item
                                    onClick={() => {
                                        // remove cookie
                                        logout().then(() => { router.push('/') });
                                    }}
                                >Keluar</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Navbar mockdata={mockdata} toggleMobile={toggleMobile} />
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    )
}

export default AppShellResponsive