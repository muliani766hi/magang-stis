import { Button, Group, NumberInput, Stepper, Table, Text, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCircleX } from '@tabler/icons-react';


interface FormStepperProps {
    items: {
        label: string;
        var: string;
        keterangan_1: string;
        keterangan_2: string;
        keterangan_3: string;
    }[];
    active: number;
    setActive: (active: number) => void;
    form: any;
}

const FormStepper = ({ items, active, setActive, form }: FormStepperProps) => {
    const maxStep = items.length - 1;
    const nextStep = () => {
        const current = active < maxStep ? active + 1 : active;
        setActive(current);
    };

    const prevStep = () => {
        const current = active > 0 ? active - 1 : active;
        setActive(current);
    };


    const stepper = items.map((item) => (
        <Stepper.Step
            // label={item.label}
            key={item.var}
            description={form.values[item.var]}
            color={!form.isValid(item.var) ? "red" : undefined}
            completedIcon={
                !form.isValid(item.var) ? (
                    <IconCircleX style={{ width: rem(20), height: rem(20) }} />
                ) : null
            }
        >
            <Text size="lg">
                {item.label}
            </Text>

            <Table
                withColumnBorders
                withRowBorders={false}
                style={{
                    textAlign: "justify",
                }}
                mb={"lg"}
            >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Kurang Memuaskan (50 - 69)</Table.Th>
                        <Table.Th>Cukup Memuaskan (70 - 85)</Table.Th>
                        <Table.Th>Sangat Memuaskan (86 - 100)</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Td>{item.keterangan_1}</Table.Td>
                        <Table.Td>{item.keterangan_2}</Table.Td>
                        <Table.Td>{item.keterangan_3}</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
            <NumberInput
                size="md"
                radius="xs"
                // label={item.label}
                key={item.var}
                // description="Input description"
                placeholder="Masukkan nilai"
                clampBehavior="strict"
                min={0}
                max={100}
                stepHoldDelay={100}
                {...form.getInputProps(item.var)}
            />
        </Stepper.Step>
    ));
    return (
        <form onSubmit={form.onSubmit((values: any) => console.log(values))}>
            <Stepper active={active} onStepClick={setActive} size="md">
                {stepper}
            </Stepper>

            <Group justify="center" mt="xl">
                {active == 0 ? (
                    <></>
                ) : (
                    <Button variant="default" onClick={prevStep}>
                        Back
                    </Button>)
                }


                {active < maxStep ? (
                    <Button onClick={nextStep}>Next step</Button>
                ) : (
                    <Button type="submit">Submit</Button>
                )}
            </Group>
        </form>
    )
}

export default FormStepper