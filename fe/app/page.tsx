'use client'
import { Button, Card, Center, PasswordInput, Stack, Text, TextInput, rem, useComputedColorScheme } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import Image from "next/image";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { handleLogin } from "@/lib";

export default function Home() {

  const [loading, setLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const computedColorScheme = useComputedColorScheme();
  const [imageSrc, setImageSrc] = useState('/MagangSTIS.svg');

  useEffect(() => {
    setImageSrc(computedColorScheme === 'dark' ? "/Magang-dark.svg" : "/MagangSTIS.svg");
  }, [computedColorScheme]);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value: any) => {
        if (!value) {
          return "Username tidak boleh kosong";
        }

        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // // Test the value against the regex pattern
        // if (!emailRegex.test(value)) {
        //   return "Alamat email tidak valid";
        // }
      },
      password: (value: any) => {
        if (!value) {
          return "Password tidak boleh kosong";
        }
        // if (value.length < 6) {
        //   return "Password minimal 6 karakter";
        // }
      },
    },
  });

  return (
    <Center style={{ height: "100vh" }}>
      <Card shadow="sm" padding="xl" style={{ width: 400 }} withBorder>
        <form onSubmit={form.onSubmit(async () => {
          let role;
          try {
            setLoading(true);
            role = await handleLogin(form.values.email, form.values.password);
            console.log(role)
          } catch (error) {
            setLoading(false);
            setLoginFailed(true);
          }

          if (role === 'admin') {
            window.location.href = '/admin';
          }
          if (role === 'mahasiswa') {
            window.location.href = '/mahasiswa';
          }
          if (role === 'dosen pembimbing magang') {
            window.location.href = '/dosen-pembimbing';
          }
          if (role === 'pembimbing lapangan') {
            window.location.href = '/pembimbing-lapangan';
          }
          if (role === 'admin provinsi') {
            window.location.href = '/admin-provinsi';
          }
          if (role === 'admin satuan kerja') {
            window.location.href = '/admin-satker';
          }

          if (role === 'bagian keuangan') {
            window.location.href = '/keuangan';
          }

        })}>
          <Stack gap="lg">
            <Image src={imageSrc} alt="MagangSTIS" width={250} height={60} style={{ margin: "auto" }} />

            <TextInput
              // mt="md"
              rightSectionPointerEvents="none"
              rightSection={
                // <IconAt style={{ width: rem(16), height: rem(16) }} />
                <IconUser style={{ width: rem(16), height: rem(16) }} />
              }
              label="Email"
              w={"100%"}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              // leftSectionPointerEvents="none"
              // leftSection={
              //   <IconLock style={{ width: rem(16), height: rem(16) }} />
              // }
              // mt="sm"
              label="Password"
              // type="password"

              w={"100%"}
              {...form.getInputProps("password")}
            />

            {/* <Anchor size="sm" href="/mahasiswa">Masuk dengan Google</Anchor> */}
            {loginFailed ?
              <Text size="xs" c="red">Masuk gagal, silakan coba lagi</Text>
              : //add space between text and button
              <Text size="xs" c="red">{"\u00A0"}</Text>
            }

            <Button
              type="submit"
              variant="light"
              fullWidth
              loading={loading}
              onClick={() => setLoginFailed(false)}
            >
              Masuk
            </Button>
            {/* <Role /> */}
          </Stack>
        </form>
      </Card>
    </Center>
  );
}
function fetchData() {
  throw new Error("Function not implemented.");
}

