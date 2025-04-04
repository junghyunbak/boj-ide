export async function fetchImageAsBase64(imageUrl: string): Promise<Blob> {
  const response = await fetch(imageUrl);

  const blob = await response.blob();

  return blob;
}
