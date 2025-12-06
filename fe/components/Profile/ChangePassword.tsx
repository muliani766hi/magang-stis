import { putNewPassword } from '@/utils/get-profile';
import { Button, Fieldset, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import React from 'react'

const ChangePassword = () => {
    const form = useForm({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            konfirmNewPassword: '',
        },

        validate: {
            oldPassword: (value) => {
                if (!value) {
                    return 'Password Lama tidak boleh kosong';
                }
            },
            newPassword: (value) => {
                if (!value) {
                    return 'Password Baru tidak boleh kosong';
                }
                if (value.length < 6) {
                    return 'Password Baru minimal 6 karakter';
                }
            },
            konfirmNewPassword: (value) => {
                if (!value) {
                    return 'Konfirmasi Password Baru tidak boleh kosong';
                }
                if (value !== form.values.newPassword) {
                    return 'Konfirmasi Password Baru tidak sesuai';
                }
            }
        }
    });
    return (
        <>
            <Fieldset legend="Ubah Password" h={"min-content"}>
                <form onSubmit={form.onSubmit(async (values) => {
                    try {
                        const response = await putNewPassword(values);
                        // console.log(response);

                        notifications.show({ title: 'Berhasil', message: 'Password berhasil diubah' });
                        form.reset()
                    } catch (error) {
                        console.error('Failed to update data', error);
                        notifications.show({ title: 'Gagal', message: 'Password gagal diubah', color: 'red' });
                    }
                })}>
                    <Stack justify="flex-start" >
                        <TextInput label="Password Lama" placeholder="" type="password" {...form.getInputProps('oldPassword')} />
                        <TextInput label="Password Baru" placeholder="" type="password" {...form.getInputProps('newPassword')} />
                        <TextInput label="Konfirmasi Password Baru" placeholder="" type="password" {...form.getInputProps('konfirmNewPassword')} />

                        <Group justify="flex-end">
                            <Button type="submit"
                                variant="light"
                            >Simpan</Button>
                        </Group>
                    </Stack>
                </form>
            </Fieldset>
        </>
    )
}

export default ChangePassword