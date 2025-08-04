import { cookies } from 'next/headers';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_image: string;
  status: string;
  role_id: number;
  device_token: string;
}

// Server-side authentication check
export async function getServerAuth(): Promise<{
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}> {
  try {
    const cookieStore = await cookies();

    const isAuthenticated =
      cookieStore.get('is_authenticated')?.value === 'true';
    const userDataCookie = cookieStore.get('user_data')?.value;
    const token = cookieStore.get('auth_token')?.value || null;

    if (isAuthenticated && userDataCookie) {
      const user = JSON.parse(userDataCookie) as User;
      return {
        isAuthenticated: true,
        user,
        token,
      };
    }

    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  }
}

// Server-side logout
export async function serverLogout() {
  const cookieStore = await cookies();

  // Clear all auth-related cookies
  cookieStore.delete('auth_token');
  cookieStore.delete('user_data');
  cookieStore.delete('is_authenticated');
}

// Middleware helper for protected routes
export async function requireAuth(): Promise<User> {
  const auth = await getServerAuth();

  if (!auth.isAuthenticated || !auth.user) {
    throw new Error('Authentication required');
  }

  return auth.user;
}
