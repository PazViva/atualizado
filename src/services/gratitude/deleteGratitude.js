import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const GRATITUDE_COLLECTION = 'gratitude';

export const deleteGratitude = async (userId, gratitudeId) => {
  if (!userId || !gratitudeId) {
    throw new Error('Dados inválidos para excluir gratidão');
  }

  try {
    await deleteDoc(doc(db, GRATITUDE_COLLECTION, gratitudeId));
  } catch (error) {
    console.error('Erro ao excluir gratidão:', error);
    throw new Error('Não foi possível excluir a gratidão. Por favor, tente novamente.');
  }
};