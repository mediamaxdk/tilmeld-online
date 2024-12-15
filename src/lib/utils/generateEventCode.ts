import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const generateCode = (length: number = 6): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
};

export const generateUniqueEventCode = async (): Promise<string> => {
  let isUnique = false;
  let code = '';
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    code = generateCode();
    const eventRef = doc(db, 'events', code);
    const eventDoc = await getDoc(eventRef);
    isUnique = !eventDoc.exists();
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Could not generate unique event code');
  }

  return code;
}; 