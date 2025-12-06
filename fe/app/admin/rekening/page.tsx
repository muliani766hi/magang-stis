import TableRekening from "@/components/Table/TableRekening/TableRekening"
import { Button, Group, Text } from "@mantine/core"
import { IconFileExport } from "@tabler/icons-react"

const Rekening = () => {
    return (
        <>
            <Text c="dimmed" mb="md">Rekening</Text>
            <Group justify="flex-end" mb={10}>
                <Button leftSection={<IconFileExport size={14} />}>Ekspor</Button>
            </Group>

            <TableRekening />
        </>
    )
}

export default Rekening