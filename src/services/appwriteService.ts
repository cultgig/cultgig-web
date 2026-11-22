import { ID } from 'appwrite';
import { account, isAppwriteConfigured } from '../config/appwrite';
import { ServiceResult } from '../types';

export interface AuthPayload {
  email: string;
  password: string;
  fullName?: string;
  audience: 'candidate' | 'company';
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthPayload(
  payload: AuthPayload,
  mode: 'sign-up' | 'log-in'
): string | null {
  if (!EMAIL_REGEX.test(payload.email.trim())) {
    return 'Please enter a valid work or personal email address.';
  }
  if (payload.password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (mode === 'sign-up' && payload.fullName && payload.fullName.trim().length < 2) {
    return 'Please enter your full name.';
  }
  return null;
}

export async function signUpWithAppwrite(
  payload: AuthPayload
): Promise<ServiceResult<{ userId: string; email: string }>> {
  const validationError = validateAuthPayload(payload, 'sign-up');
  if (validationError) {
    return { ok: false, error: validationError, code: 'VALIDATION_ERROR' };
  }

  if (!isAppwriteConfigured) {
    return {
      ok: false,
      code: 'UNCONFIGURED',
      error:
        'Appwrite authentication is not configured yet. Add VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID to enable account creation.',
    };
  }

  try {
    const created = await account.create({
      userId: ID.unique(),
      email: payload.email.trim(),
      password: payload.password,
      name: payload.fullName?.trim() || undefined,
    });
    await account.createEmailPasswordSession({
      email: payload.email.trim(),
      password: payload.password,
    });
    return { ok: true, data: { userId: created.$id, email: created.email } };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unable to create account right now. Please try again.';
    return { ok: false, error: message, code: 'REQUEST_FAILED' };
  }
}

export async function logInWithAppwrite(
  payload: AuthPayload
): Promise<ServiceResult<{ userId: string; email: string }>> {
  const validationError = validateAuthPayload(payload, 'log-in');
  if (validationError) {
    return { ok: false, error: validationError, code: 'VALIDATION_ERROR' };
  }

  if (!isAppwriteConfigured) {
    return {
      ok: false,
      code: 'UNCONFIGURED',
      error:
        'Appwrite authentication is not configured yet. Add VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID to enable sign-in.',
    };
  }

  try {
    const session = await account.createEmailPasswordSession({
      email: payload.email.trim(),
      password: payload.password,
    });
    return {
      ok: true,
      data: { userId: session.userId, email: payload.email.trim() },
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Invalid credentials or unable to reach authentication service.';
    return { ok: false, error: message, code: 'REQUEST_FAILED' };
  }
}
