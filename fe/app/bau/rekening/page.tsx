import TableRekening from "@/components/Table/TableRekening/TableRekening"
import { Button, Group, Text } from "@mantine/core"
import { IconFileDownload, IconFileExport, IconFileImport } from "@tabler/icons-react"

const Rekening = () => {
    return (
        <>
            <Text size="xl">Rekening</Text>
            <Group justify="flex-end" mb={10}>
                <Button leftSection={<IconFileExport size={14} />}>Ekspor</Button>
            </Group>

            <TableRekening />
        </>
    )
}

export default Rekening