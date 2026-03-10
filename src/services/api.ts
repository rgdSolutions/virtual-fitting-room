const API_URL = 'https://httpbin.org/post';

export async function uploadPhoto(uri: string): Promise<Record<string, unknown>> {
  const filename = uri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  const formData = new FormData();
  formData.append('photo', {
    uri,
    name: filename,
    type,
  } as unknown as Blob);

  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }
  return data;
}
