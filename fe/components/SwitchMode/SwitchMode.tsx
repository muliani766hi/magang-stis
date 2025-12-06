import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import cx from 'clsx';
import classes from './SwitchMode.module.css';
import { useEffect, useState } from 'react';

export function SwitchMode() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        // Set hasMounted to true once the component mounts
        setHasMounted(true);
    }, []);

    const title = hasMounted ? `${computedColorScheme === 'light' ? 'dark' : 'light'} mode` : '';

    return (
        <ActionIcon
            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
            variant="default"
            radius="xl"
            size="lg"
            aria-label="Toggle color scheme"
            title={title}
        >
            <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
            <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
        </ActionIcon>
    );
}