'use server';
import { cache } from 'react';
// import 'server-only'
import { cookies } from 'next/headers';

export const getProfile = cache(async () => {
    const token = cookies().get('token')?.value;

    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await fetch(`${process.env.API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw new Error('Failed to fetch profile');
    }
});

export async function getDosenId() {
    const token = cookies().get('token')?.value;
    const dosenId = await fetch(`${process.env.API_URL}/auth/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
    })
        .then((res) => res.json())
        .then((data) => data.data.dosenPembimbingMagang.dosenId)
        .catch((err) => console.log(err));

    return dosenId;
}

export async function getToken() {
    return cookies().get('token')?.value;
}

export async function putNewPassword(values: any) {
    const token = cookies().get('token')?.value;

    try {
        const response = await fetch(`${process.env.API_URL}/users/update-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Failed to fetch data');
    }
}
