import axiosContpaqi from '../../libs/axiosContpaqi';
const apiContpaqiDocs = '/api/documentos';

export const getDocumentConcepts = async () => {
  const res = await axiosContpaqi.get(`${apiContpaqiDocs}/conceptos-documentos`);
  return res.data;
};
