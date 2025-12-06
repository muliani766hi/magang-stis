import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (token) {
        try {
            // Decode the token
            const decodedToken: any = jwtDecode(token);
            const role = decodedToken.role;

            const requestedPath = new URL(request.url).pathname;

            // Define the role-based access rules
            const rolePathMap: { [key: string]: string } = {
                'admin': '/admin',
                'mahasiswa': '/mahasiswa',
                'dosen pembimbing magang': '/dosen-pembimbing',
                'pembimbing lapangan': '/pembimbing-lapangan',
                'admin provinsi': '/admin-provinsi',
                'admin satuan kerja': '/admin-satker',
            };

            // Check if the role is allowed for the requested path
            if (role && requestedPath.startsWith(rolePathMap[role])) {
                return NextResponse.next();
            } else {
                // Redirect based on role
                if (role in rolePathMap) {
                    return NextResponse.redirect(new URL(rolePathMap[role], request.url));
                }
            }
        } catch (error) {
            console.error('Token decoding failed:', error);
            // Handle token decoding errors if necessary
        }
    }

    // If no token is found or role is not matched, redirect to the login page
    return NextResponse.rewrite(new URL('/', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/mahasiswa/:path*',
        '/admin/:path*',
        '/admin-provinsi/:path*',
        '/admin-satker/:path*',
        '/baak/:path*',
        '/bau/:path*',
        '/dosen-pembimbing/:path*',
        '/mahasiswa/wa/:path*',
        '/pembimbing-lapangan/:path*',
        '/tim-magang/:path*',
    ],
};
