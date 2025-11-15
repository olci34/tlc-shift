import apiClient from './interceptors/apiClient';

export const deletePhoto = async (cldImgId: string) => {
  const url = `/listings/photos/${cldImgId}`;

  try {
    const res = await apiClient.delete(url);
    return res.data;
  } catch (e: any) {
    console.log(`Error occurred when deleting photo. Error: ${e}`);
  }
};
