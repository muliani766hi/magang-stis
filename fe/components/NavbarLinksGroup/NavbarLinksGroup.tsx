'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Group,
    Box,
    Collapse,
    ThemeIcon,
    Text,
    UnstyledButton,
    rem,
    NavLink,
} from "@mantine/core";
import { IconCalendarStats, IconChevronRight } from "@tabler/icons-react";
import classes from "./NavbarLinksGroup.module.css";

interface LinksGroupProps {
    icon: React.ElementType;
    label: string;
    initiallyOpened?: boolean;
    link: string | undefined;
    links: {
        label: string;
        link: string;
        icon: React.ElementType | undefined;
    }[] | undefined;
    active: string;
    setActive: (active: string) => void;
    pathname: string;
    toggleMobile: () => void;
}

export function LinksGroup({
    icon: Icon,
    label,
    initiallyOpened,
    link,
    links,
    active,
    setActive,
    pathname,
    toggleMobile,
}: LinksGroupProps) {
    const hasLinks = Array.isArray(links);
    const [opened, setOpened] = useState(initiallyOpened || false);
    const router = useRouter();

    useEffect(() => {
        // Check if any child link is active and update the opened state
        const anyChildActive = (hasLinks ? links : []).some(
            (link) => active === link.link
        );
        setOpened(anyChildActive);
    }, [active, links, hasLinks, opened]);

    const items = (hasLinks ? links : []).map((link) => (
        <NavLink
            // href={link.link}
            key={link.label}
            active={active === link.link || undefined}
            label={link.label}
            leftSection={
                link.icon ? (
                    <ThemeIcon variant="light" size={30} mr={"xs"}>
                        <link.icon size="1rem" stroke={1.5} />
                    </ThemeIcon>
                ) : (
                    undefined
                )
            }
            onClick={() => {
                router.push(link.link);
                setActive(link.link);
                toggleMobile();
            }}
            fw={500}
            fz={"sm"}
            px={"lg"}
            py={"xs"}
            className={classes.link}
        />
    ));

    return (
        <>
            <NavLink
                // href={link}
                key={label}
                active={active === link || undefined}
                label={label}
                leftSection={
                    <ThemeIcon variant="light" size={30} mr={"xs"}>
                        <Icon size="1rem" stroke={1.5} />
                    </ThemeIcon>
                }
                childrenOffset={34}
                onClick={() => {
                    if (!hasLinks) {
                        router.push(link ?? "");
                        setActive(link ?? "");
                        toggleMobile();
                    }
                }}
                fw={500}
                fz={"sm"}
                px={"lg"}
                py={"xs"}
                // defaultOpened={opened}
                opened={opened || undefined}
            >
                {hasLinks ? items : null}
            </NavLink>
        </>
    );
}

// const mockdata = {
//     label: "Releases",
//     icon: IconCalendarStats,
//     links: [
//         { label: "Upcoming releases", link: "/" },
//         { label: "Previous releases", link: "/" },
//         { label: "Releases schedule", link: "/" },
//     ],
// };

// export function NavbarLinksGroup() {
//     return (
//         <Box mih={220} p="md">
//             <LinksGroup link={""} active={""} setActive={function (active: string): void {
//                 throw new Error("Function not implemented.");
//             } } pathname={""} {...mockdata} />
//         </Box>
//     );
// }
