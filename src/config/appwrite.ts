import { Account, Client, Databases } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT?.trim() || '';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID?.trim() || '';

export const isAppwriteConfigured = Boolean(endpoint && projectId);

export const client = new Client();

if (isAppwriteConfigured) {
  client.setEndpoint(endpoint).setProject(projectId);
}

export const account = new Account(client);
export const databases = new Databases(client);

export const appwriteConfig = {
  endpoint,
  projectId,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID?.trim() || '',
  leadsCollectionId: import.meta.env.VITE_APPWRITE_LEADS_COLLECTION_ID?.trim() || '',
};
