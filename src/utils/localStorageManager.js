export const saveToLocalStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
};

export const getFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Erro ao ler do localStorage:', error);
    return null;
  }
};

export const syncWithLocalStorage = (gratitudes) => {
  saveToLocalStorage('gratitudes', gratitudes);
};