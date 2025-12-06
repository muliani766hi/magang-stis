'use client'
import { Switch, Text, Stack, Button, Card, SimpleGrid, TextInput, Textarea, Group, Checkbox } from '@mantine/core'
import React, { useState, useEffect } from 'react'
import { getRoles } from '@/utils/roles';
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { closeModal, openModal } from '@mantine/modals';
import { useForm } from "@mantine/form";
import { getPengumuman, postPengumuman, removePengumuman } from '@/utils/pengumuman';

const Pengumuman = () => {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<{ roleId: string; roleName: string }[]>([]);
  const [pengumuman, setPengumuman] = useState([])

  const fetchRoles = async () => {
    setLoading(true);
    const result = await getRoles();
    setRoles(result.data);
    setLoading(false);
  };

  const fetchPengumuman = async () => {
    setLoading(true);
    const result = await getPengumuman();
    setPengumuman(result.data);
    setLoading(false);
  };


  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchPengumuman()
  }, []);


  return (
    <>
      <Text c="dimmed" mb="md">Pengumuman</Text>

      <Button type="button" color="blue" variant="light" onClick={
        () => {
          openModal({
            modalId: "add",
            title: "Tambah Pengumuman",
            children: <AddPengumumanModal roles={roles} />,
          });
        }
      }>
        <IconPlus size={18} style={{ marginRight: 8, fontWeight: "bold" }} />
        Tambah Pengumuman
      </Button>
      {/* <Switch
        style={{ marginTop: "30px", marginBottom: "10px" }}
        defaultChecked
        // checked={isAccessAlocation}
        // onChange={async (event) => {
        //     setIsAccessAlocation(event.currentTarget.checked)
        //     const res = await putAccessAlocation(idAccessAlocation, event.currentTarget.checked)
        //     notifications.show({ title: res.status, message: res.message });
        // }}
        label="Peringatan penilaian pembimbing lapangan dan dosen pembimbing"
      /> */}
      {
        pengumuman.map((value: any, index) => (
          <Stack style={{ marginTop: "30px", marginBottom: "10px" }}>
            <Card shadow="sm" padding="md" radius="md" withBorder>
              <SimpleGrid cols={2}>
                <Stack>
                  <Text size="md" style={{ fontWeight: "bold" }}>
                    {value.judul}
                  </Text>
                  <Text size="sm" c="dimmed" >
                    Tanggal {formatDate(value.tanggal)}
                  </Text>
                  <Text size="sm" c="dimmed" style={{ marginTop: "-10px" }}>
                    Untuk {value.role.join(', ')}
                  </Text>
                  <Text size="sm" c="dimmed" style={{ marginTop: "-10px" }}>
                    {value.deskripsi}
                  </Text>
                </Stack>
                <Stack justify="center" align="end">
                  <Button type="button" color="red" variant="filled" radius="md"
                    onClick={async () => {
                      const res = await removePengumuman(value.groupId)
                      notifications.show({
                        title: 'Sukses',
                        message: res.message,
                        color: 'green',
                      });
                    }}
                  >
                    <IconTrash size={18} style={{ fontWeight: "bold" }} />
                  </Button>
                </Stack>
              </SimpleGrid>
            </Card>
          </Stack>
        ))
      }
    </>
  )
}

const AddPengumumanModal = ({ roles }: { roles: { roleId: string; roleName: string }[] }) => {
  const form = useForm({
    initialValues: {
      roleIds: [] as string[], 
      judul: '',
      isi: '',
    },
  });

  const [selectRoles, setSelectRoles] = useState<string[]>([]);

  const handleCheckboxChange = (roleId: string) => {
    setSelectRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = async (values: typeof form.values) => {

    const res = await postPengumuman(values)

    notifications.show({
      title: 'Sukses',
      message: res.message,
      color: 'green',
    });

    closeModal("add");
  };

  const filteredRoles = roles.filter(role => 
    !['admin', 'tim magang', 'bagian administrasi umum', 'bagian administrasi akademik dan kemahasiswaan'].includes(role.roleName.toLowerCase())  
  );

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Stack style={{ marginBottom: "10px", marginTop: "10px" }}>
          <Text size="md">Pilih Pengguna</Text>
          <Text size="sm" c="dimmed" style={{ marginTop: "-10px" }}>
            Pilih pengguna yang akan menerima pengumuman
          </Text>
          {filteredRoles.map((value, index) => (
            <Checkbox
              key={index}
              label={value.roleName}
              value={String(value.roleId)}
              checked={form.values.roleIds.includes(String(value.roleId))}
              onChange={() => {
                const id = String(value.roleId);
                const updated = form.values.roleIds.includes(id)
                  ? form.values.roleIds.filter((v) => v !== id)
                  : [...form.values.roleIds, id];
                form.setFieldValue("roleIds", updated);
              }}
            />
          ))}
        </Stack>

        <TextInput
          variant="filled"
          label="Judul Pengumuman"
          placeholder="Judul pengumuman"
          {...form.getInputProps("judul")}
        />
        <Textarea
          variant="filled"
          label="Isi Pengumuman"
          placeholder="Isi pengumuman"
          autosize
          minRows={3}
          {...form.getInputProps("isi")}
        />
        <Group justify="right">
          <Button type="submit" color="green" variant="filled">
            Simpan
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default Pengumuman