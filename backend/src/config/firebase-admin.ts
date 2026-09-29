import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { env } from './env.js';

if (!getApps().length) {
  const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

  try {
    initializeApp({
      credential: cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } catch (err: any) {
    console.warn("Firebase Admin failed to initialize. If you are using dummy keys, Firebase features will not work.", err.message);
  }
}

export const firebaseAuth = getApps().length ? getAuth() : ({} as any);
