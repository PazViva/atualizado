import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const GRATITUDE_COLLECTION = 'gratitude';

export const toggleFavorite = async (userId, gratitudeId, favorite) => {
  if (!userId || !gratitudeId) {
    throw new Error('Dados inválidos para atualizar favorito');
  }

  try {
    await updateDoc(doc(db, GRATITUDE_COLLECTION, gratitudeId), {
      favorite
    });
  } catch (error) {
    console.error('Erro ao atualizar favorito:', error);
    throw new Error('Não foi possível atualizar o favorito. Por favor, tente novamente.');
  }
};