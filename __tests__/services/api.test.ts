import { uploadPhoto } from '../../src/services/api';

describe('uploadPhoto', () => {
  const mockJson = jest.fn();
  const mockFetch = jest.fn() as jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = mockFetch;
    mockJson.mockResolvedValue({ status: 'ok' });
    mockFetch.mockResolvedValue({ ok: true, json: mockJson });
  });

  it('POSTs to httpbin.org/post with FormData body', async () => {
    await uploadPhoto('/path/to/photo.png');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://httpbin.org/post',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      }),
    );
  });

  it('extracts filename from URI', async () => {
    const appendSpy = jest.spyOn(FormData.prototype, 'append');
    await uploadPhoto('/path/to/myimage.png');

    expect(appendSpy).toHaveBeenCalledWith(
      'photo',
      expect.objectContaining({ name: 'myimage.png' }),
    );
    appendSpy.mockRestore();
  });

  it('derives MIME type from extension (.png)', async () => {
    const appendSpy = jest.spyOn(FormData.prototype, 'append');
    await uploadPhoto('/path/to/photo.png');

    expect(appendSpy).toHaveBeenCalledWith(
      'photo',
      expect.objectContaining({ type: 'image/png' }),
    );
    appendSpy.mockRestore();
  });

  it('falls back to image/jpeg when no extension', async () => {
    const appendSpy = jest.spyOn(FormData.prototype, 'append');
    await uploadPhoto('/path/to/photo');

    expect(appendSpy).toHaveBeenCalledWith(
      'photo',
      expect.objectContaining({ type: 'image/jpeg' }),
    );
    appendSpy.mockRestore();
  });

  it('falls back to "photo.jpg" when URI pop yields empty', async () => {
    const appendSpy = jest.spyOn(FormData.prototype, 'append');
    await uploadPhoto('');

    expect(appendSpy).toHaveBeenCalledWith(
      'photo',
      expect.objectContaining({ name: 'photo.jpg' }),
    );
    appendSpy.mockRestore();
  });

  it('returns parsed JSON on success', async () => {
    mockJson.mockResolvedValue({ data: 'test' });
    const result = await uploadPhoto('/path/to/photo.png');
    expect(result).toEqual({ data: 'test' });
  });

  it('throws on non-ok response (status 500)', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    await expect(uploadPhoto('/path/to/photo.png')).rejects.toThrow(
      'Upload failed with status 500',
    );
  });

  it('throws on network error', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    await expect(uploadPhoto('/path/to/photo.png')).rejects.toThrow(
      'Network error',
    );
  });
});
