'use client'

import { getToken } from "@/utils/get-profile";
import { Text, Badge, Flex, Stack, TextInput, Button, Select } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { notifications } from '@mantine/notifications'

interface TahunAjaran {
  tahunAjaranId: string;
  tahun: string;
  isActive: boolean
}

const TahunAjaran = () => {
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [selectedTahun, setSelectedTahun] = useState("");
  const [createloading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [dataTahunAjaran, setDataTahunAjaran] = useState<TahunAjaran[]>([]);

  const isValidTahunAjaran = (value: string) => {
    const match = value.match(/^(\d{4})\/(\d{4})$/);
    if (!match) return false;

    const [_, firstYear, secondYear] = match;

    // Pastikan tahun kedua adalah satu tahun setelah tahun pertama
    return parseInt(secondYear) === parseInt(firstYear) + 1;
  };


  // Handle form submission
  const handleCreateTahunAjaran = async (e: React.FormEvent) => {
    e.preventDefault();

    setCreateLoading(true);
    setError(null);
    setValidationError(null);

    const formData = {
      tahun: tahunAjaran,
    };

    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tahun-ajaran`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) fetchTahunAjaran();
      setCreateLoading(false);
      notifications.show({
        title: 'Sukses',
        message: 'Sukses created tahun ajaran',
        color: 'green',
      });
    } catch (error) {
      setCreateLoading(false);
      setError("Error occurred while submitting the form.");
      notifications.show({
        title: 'Gagal',
        message: 'Gagal created tahun ajaran',
        color: 'red',
      });
    }
  };

  const handleSetTahunAjaran = async (e: React.FormEvent) => {
    e.preventDefault();

    setUpdateLoading(true);
    setError(null);
    setValidationError(null);

    const formData = {
      isActive: true,
    };

    const tahunId = dataTahunAjaran.find((value) => value.tahun === selectedTahun)?.tahunAjaranId

    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tahun-ajaran/set-active/${tahunId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) fetchTahunAjaran();
      setUpdateLoading(false);
      notifications.show({
        title: 'Sukses',
        message: 'Sukses memilih tahun ajaran',
        color: 'green',
      });
    } catch (error) {
      setUpdateLoading(false);
      setError("Error occurred while submitting the form.");
      console.error(error);
      notifications.show({
        title: 'Gagal',
        message: 'Gagal memilih tahun ajaran',
        color: 'red',
      });
    }
  }

  const fetchTahunAjaran = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tahun-ajaran`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDataTahunAjaran(data.data);
    } catch (error) {
      setError("Error occurred while fetching data.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTahunAjaran();
  }, []);

  useEffect(() => {
    if (dataTahunAjaran.length === 1 && !selectedTahun) {
      setSelectedTahun(dataTahunAjaran[0].tahun);
    }
  
    if (!selectedTahun) {
      const active = dataTahunAjaran.find((item) => item.isActive);
      if (active) setSelectedTahun(active.tahun);
    }
  }, [dataTahunAjaran, selectedTahun]);
  

  return (
    <>
      <Text c="dimmed" mb="md" size="xl">
        Tahun Ajaran
      </Text>

      <Badge
        color="red"
        variant="light"
        size="lg"
        radius="sm"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
        mb="md"
      >
        <Flex direction="row" gap="sm" justify="center" align="center">
          <IconAlertCircle size={18} style={{ marginRight: 8 }} />
          <Text size="sm">
            Harap bijak dalam fitur ini karena akan mengubah seluruh data yang masuk dan yang ditampilkan dalam sistem.
          </Text>
        </Flex>
      </Badge>

      <form onSubmit={handleCreateTahunAjaran}>
        <Stack style={{ marginTop: "2%" }}>
          <Text style={{ fontWeight: "bold", fontSize: "20px" }}>Tahun Ajaran Baru</Text>

          <Flex direction="row" align="center" gap="sm">
            <TextInput
              placeholder="2025/2026"
              description={`Format harus tahun/tahun, contoh: ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`}
              style={{ width: "20rem" }}
              size="md"
              value={tahunAjaran}
              onChange={(e) => {
                setTahunAjaran(e.target.value);
                setValidationError(!isValidTahunAjaran(e.target.value) ? "Format harus tahun/tahun, contoh: 2025/2026" : null);
              }}
              error={validationError}
            />

            <Button type="submit" color="blue" variant="light" mt={20} loading={createloading}>
              Simpan
            </Button>
          </Flex>
        </Stack>
      </form>
      <form onSubmit={handleSetTahunAjaran}>
        <Stack mt="md">
          <Text style={{ fontWeight: "bold", fontSize: "20px", marginTop: "20px" }}>Sesuaikan Tahun Ajaran</Text>

          <Flex direction="row" align="center" gap="sm">
            <Stack style={{ width: "20rem" }}>
              <Select
                allowDeselect={false}
                size="md"
                description="Hati-hati, pilihan ini akan memengaruhi seluruh sistem"
                data={dataTahunAjaran
                  .sort((a, b) => {
                    const tahunA = parseInt(a.tahun.split("/")[0], 10);
                    const tahunB = parseInt(b.tahun.split("/")[0], 10);
                    return tahunB - tahunA;
                  })
                  .map((item) => ({
                    value: item.tahun,
                    label: item.tahun,
                  }))}
                value={selectedTahun || dataTahunAjaran.find((item) => item.isActive)?.tahun || ""}
                onChange={(value) => setSelectedTahun(value as string)}

              />
            </Stack>
            <Button type="submit" color="blue" variant="light" mt={35} loading={updateLoading}>
              Simpan
            </Button>
          </Flex>
        </Stack>
      </form>

    </>
  );
};

export default TahunAjaran;
