import axios from '../../libs/axiosContpaqi';
const apiContpaqiDocs = '/api/documentos';

export const getDocumentConcepts = async () => {
  const res = await axios.get(`${apiContpaqiDocs}/conceptos-documentos`);
  return res.data;
};
