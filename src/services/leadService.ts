import { ID } from 'appwrite';
import { appwriteConfig, databases, isAppwriteConfigured } from '../config/appwrite';
import { LeadSubmissionPayload, ServiceResult } from '../types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const submittedFingerprints = new Set<string>();

export function validateLeadPayload(payload: LeadSubmissionPayload): string | null {
  if (!payload.name || payload.name.trim().length < 2) {
    return 'Please enter your name (at least 2 characters).';
  }
  if (!EMAIL_REGEX.test(payload.email.trim())) {
    return 'Please enter a valid email address.';
  }
  if (payload.inquiryType !== 'newsletter' && (!payload.roleFocus || payload.roleFocus.trim().length < 2)) {
    return 'Please specify the role or hiring focus.';
  }
  return null;
}

export async function submitLead(
  payload: LeadSubmissionPayload
): Promise<ServiceResult<{ documentId: string }>> {
  const validationError = validateLeadPayload(payload);
  if (validationError) {
    return { ok: false, error: validationError, code: 'VALIDATION_ERROR' };
  }

  const fingerprint = `${payload.inquiryType}:${payload.email.trim().toLowerCase()}`;
  if (submittedFingerprints.has(fingerprint)) {
    return {
      ok: false,
      error: 'A request with this email has already been submitted during this session.',
      code: 'DUPLICATE',
    };
  }

  if (
    !isAppwriteConfigured ||
    !appwriteConfig.databaseId ||
    !appwriteConfig.leadsCollectionId
  ) {
    return {
      ok: false,
      code: 'UNCONFIGURED',
      error:
        'Lead persistence requires Appwrite configuration (VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID, VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_LEADS_COLLECTION_ID).',
    };
  }

  try {
    const doc = await databases.createDocument({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.leadsCollectionId,
      documentId: ID.unique(),
      data: {
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        company: payload.company?.trim() || '',
        roleFocus: payload.roleFocus.trim(),
        inquiryType: payload.inquiryType,
        notes: payload.notes?.trim() || '',
        submittedAt: new Date().toISOString(),
      },
    });
    submittedFingerprints.add(fingerprint);
    return { ok: true, data: { documentId: doc.$id } };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unable to submit your request right now. Please try again.';
    return { ok: false, error: message, code: 'REQUEST_FAILED' };
  }
}
