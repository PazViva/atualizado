import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const GRATITUDE_COLLECTION = 'gratitude';

export const addGratitude = async (userId, text) => {
  if (!userId || !text?.trim()) {
    throw new Error('Dados inválidos para adicionar gratidão');
  }

  try {
    const docRef = await addDoc(collection(db, GRATITUDE_COLLECTION), {
      userId,
      text: text.trim(),
      createdAt: serverTimestamp()
    });
    return docRef;
  } catch (error) {
    console.error('Erro ao adicionar gratidão:', error);
    throw new Error('Não foi possível salvar sua gratidão. Por favor, tente novamente.');
  }
};