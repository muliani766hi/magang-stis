'use client';

import { useEffect, useState } from "react";
import { Group, Code, ScrollArea, rem } from "@mantine/core";
import {
    IconNotes,
    IconCalendarStats,
    IconGauge,
    IconPresentationAnalytics,
    IconFileAnalytics,
    IconAdjustments,
    IconLock,
} from "@tabler/icons-react";
// import { UserButton } from '../UserButton/UserButton';
import { LinksGroup } from "../NavbarLinksGroup/NavbarLinksGroup";
import classes from "./Navbar.module.css";
import { usePathname } from "next/navigation";

export interface NavbarProps {
    label: string;
    icon: React.ElementType;
    initiallyOpened?: boolean;
    link?: string
    links?: {
        label: string;
        link: string;
        icon: React.ElementType | undefined;
    }[] | undefined;
}

export function Navbar({ mockdata, toggleMobile }: { mockdata: NavbarProps[], toggleMobile: () => void }) {
    const pathname = usePathname();
    const [active, setActive] = useState(pathname);
    // console.log(pathname);

    // Update the active state whenever the pathname changes
    useEffect(() => {
        setActive(pathname);
    }, [pathname]);

    const links = mockdata.map((item) => (
        <LinksGroup
            key={item.label}
            icon={item.icon}
            label={item.label}
            initiallyOpened={item.initiallyOpened}
            link={item.link}
            links={item.links}
            active={active}
            setActive={setActive}
            pathname={pathname}
            toggleMobile={toggleMobile}
        />
    ));

    return (
        <ScrollArea className={classes.links}>
            <div className={classes.linksInner}>{links}</div>
        </ScrollArea>
    );
}

