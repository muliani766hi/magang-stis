'use server'

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

export const handleLogin = async (email: string, password: string) => {
 
  const response = await fetch(`${process.env.API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();

  cookies().set('token', data.token, {
    httpOnly: true,
    secure: false,
    // domain: '103.172.205.223',
    maxAge: 60 * 60 * 24 * 7, 
    path: '/',
  })


  const decodedToken: any = jwtDecode(data.token);

  const role = decodedToken.role;

  return role;

};

export async function logout() {
  cookies().set("token", "", { expires: new Date(0) });
}
