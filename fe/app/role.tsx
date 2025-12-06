'use client';

import { Button, Stack } from "@mantine/core"
import { openModal } from "@mantine/modals"
import React from 'react'

const Role = () => {
    return (
        <Button
            variant="light"
            color="blue"
            fullWidth
            style={{ marginTop: "auto" }}
            onClick={() => showModal()}
        >
            Login
        </Button>
    )
}

const showModal = () => {
    openModal({
        title: "Login",
        modalId: "login",
        children: (
            <Stack>
                <Button variant="light" color="blue" fullWidth component="a" href="/admin">Admin</Button>
                <Button variant="light" color="blue" fullWidth component="a" href="/mahasiswa">Mahasiswa</Button>
                <Button variant="light" color="blue" fullWidth component="a" href="/tim-magang">Tim Magang</Button>
                <Button variant="light" color="blue" fullWidth component="a" href="/pembimbing-lapangan">Pembimbing Lapangan</Button>
                <Button variant="light" color="blue" fullWidth component="a" href="/dosen-pembimbing">Dosen Pembimbing</Button>
                <Button variant="light" color="blue" fullWidth component="a" href="/admin-provinsi">Admin Provinsi</Button>
                <Button variant="light" color="blue" fullWidth component="a" href="/admin-satker">Admin Satker</Button>
                <Button variant="light" color="blue" fullWidth component="a" href="/baak">BAAK</Button>
                <Button variant="light" color="blue" fullWidth component="a" href="/bau">BAU</Button>


            </Stack>
        )
    })
}

export default Role