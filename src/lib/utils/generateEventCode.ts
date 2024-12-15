import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const generateCode = (length: number = 6): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length }, 
    () => chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
};

export const generateUniqueEventCode = async (): Promise<string> => {
  let code = generateCode();
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 5;

  while (!isUnique && attempts < maxAttempts) {
    // Check if code exists
    const eventRef = doc(db, 'events', code);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      isUnique = true;
    } else {
      code = generateCode();
      attempts++;
    }
  }

  if (!isUnique) {
    throw new Error('Could not generate unique event code');
  }

  return code;
}; 