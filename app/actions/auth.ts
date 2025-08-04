'use server';

import { LoginResponse } from '@/lib/api';
import { validateLoginData } from '@/lib/validations/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface DeviceInfo {
  fcm_token?: string;
  device_id: string;
  device_name: string;
  platform_type: 'Web' | 'Android' | 'iOS';
  api_version: string;
  os_version: string;
  latitude?: number;
  longitude?: number;
  app_version: string;
}

interface LoginRequest {
  email: string;
  password: string;
  device_info: DeviceInfo;
}

// Get device information for server-side login
const getServerDeviceInfo = (): DeviceInfo => {
  return {
    device_id: 'server-' + Math.random().toString(36).substring(2, 15),
    device_name: 'Web Server',
    platform_type: 'Web',
    api_version: '1.0',
    os_version: 'Server',
    app_version: process.env['NEXT_PUBLIC_APP_VERSION'] || '1.2.3',
  };
};

// Server-side API call
async function makeServerLoginRequest(
  email: string,
  password: string
): Promise<LoginResponse> {
  const loginData: LoginRequest = {
    email,
    password,
    device_info: getServerDeviceInfo(),
  };

  const apiUrl = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:5000';

  try {
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'app-type': 'web',
        'Accept-Language': 'en',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || 'An error occurred',
        status: response.status,
        errors: data.errors,
      };
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error
      throw {
        message: 'Network error. Please check your connection.',
        status: 0,
      };
    }
    throw error;
  }
}

// Server action for login form validation
export async function validateLoginAction(formData: FormData) {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validation = await validateLoginData(rawData);

  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  return {
    success: true,
    data: validation.data,
  };
}

// Server action for actual login (server-side API call)
export async function serverLoginAction(_prevState: any, formData: FormData) {
  try {
    // First validate the form data
    const validation = await validateLoginData({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
        message: 'Please fix the validation errors',
      };
    }

    // Make server-side API call
    if (!validation.data) {
      return {
        success: false,
        message: 'Invalid form data',
      };
    }

    const response = await makeServerLoginRequest(
      validation.data.email,
      validation.data.password
    );

    // Check for successful response
    if (response.statusCode === 200 && response.data) {
      const { user, access_token, refresh_token } = response.data;

      // Set secure HTTP-only cookies
      const cookieStore = await cookies();
      cookieStore.set('auth_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 30, // 30 minutes
      });

      cookieStore.set('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      cookieStore.set('user_data', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days (same as refresh token)
      });

      // Store in client-side for immediate access (optional)
      cookieStore.set('is_authenticated', 'true', {
        httpOnly: false, // Allow client access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Redirect to dashboard
      redirect('/');
    } else {
      return {
        success: false,
        message: response.message || 'Login failed',
      };
    }
  } catch (error: any) {
    // Handle specific error cases
    if (error.status === 401) {
      return {
        success: false,
        message: error.message || 'Invalid email or password',
      };
    }

    if (error.status === 0) {
      return {
        success: false,
        message:
          'Cannot connect to server. Please check if the backend is running.',
      };
    }

    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Pure HTML form action (single parameter)
export async function htmlLoginAction(formData: FormData) {
  try {
    // Get redirect URL if provided
    const redirectTo = formData.get('redirect') as string;

    // First validate the form data
    const validation = await validateLoginData({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validation.isValid) {
      // For HTML forms, we can't return state, so just redirect with error
      const errorParams = new URLSearchParams();
      if (validation.errors) {
        Object.entries(validation.errors).forEach(([key, value]) => {
          errorParams.append(`error_${key}`, value);
        });
      }
      // Preserve redirect parameter if it exists
      if (
        redirectTo &&
        redirectTo.startsWith('/') &&
        !redirectTo.startsWith('/auth/')
      ) {
        errorParams.append('redirect', redirectTo);
      }
      redirect(`/auth/login?${errorParams.toString()}`);
    }

    // Make server-side API call
    if (!validation.data) {
      const errorParams = new URLSearchParams();
      errorParams.append('error', 'Invalid form data');
      if (
        redirectTo &&
        redirectTo.startsWith('/') &&
        !redirectTo.startsWith('/auth/')
      ) {
        errorParams.append('redirect', redirectTo);
      }
      redirect(`/auth/login?${errorParams.toString()}`);
    }

    const response = await makeServerLoginRequest(
      validation.data.email,
      validation.data.password
    );

    // Check for successful response
    if (response.statusCode === 200 && response.data) {
      const { user, access_token, refresh_token } = response.data;

      // Set secure HTTP-only cookies
      const cookieStore = await cookies();
      cookieStore.set('auth_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 30, // 30 minutes
      });

      cookieStore.set('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      cookieStore.set('user_data', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days (same as refresh token)
      });

      // Store in client-side for immediate access (optional)
      cookieStore.set('is_authenticated', 'true', {
        httpOnly: false, // Allow client access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Redirect to intended destination or dashboard
      if (
        redirectTo &&
        redirectTo.startsWith('/') &&
        !redirectTo.startsWith('/auth/')
      ) {
        redirect(redirectTo);
      } else {
        redirect('/');
      }
    } else {
      // Redirect back with error message
      const errorParams = new URLSearchParams();
      const errorMessage = encodeURIComponent(
        response.message || 'Login failed'
      );
      errorParams.append('error', errorMessage);
      if (
        redirectTo &&
        redirectTo.startsWith('/') &&
        !redirectTo.startsWith('/auth/')
      ) {
        errorParams.append('redirect', redirectTo);
      }
      redirect(`/auth/login?${errorParams.toString()}`);
    }
  } catch (error: any) {
    // Handle specific error cases and redirect with error
    let errorMessage = 'An unexpected error occurred';

    if (error.status === 401) {
      errorMessage = error.message || 'Invalid email or password';
    } else if (error.status === 0) {
      errorMessage =
        'Cannot connect to server. Please check if the backend is running.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    const errorParams = new URLSearchParams();
    const encodedError = encodeURIComponent(errorMessage);
    errorParams.append('error', encodedError);

    // Preserve redirect parameter if it exists
    const redirectTo = formData.get('redirect') as string;
    if (
      redirectTo &&
      redirectTo.startsWith('/') &&
      !redirectTo.startsWith('/auth/')
    ) {
      errorParams.append('redirect', redirectTo);
    }

    redirect(`/auth/login?${errorParams.toString()}`);
  }
}

// Logout action
export async function logoutAction() {
  const cookieStore = await cookies();

  // Clear all authentication cookies
  cookieStore.delete('auth_token');
  cookieStore.delete('refresh_token');
  cookieStore.delete('user_data');
  cookieStore.delete('is_authenticated');

  // Redirect to login page
  redirect('/auth/login');
}
