import { WidgetData, PageData, TileData } from '../types';

interface GetDataParams {
  url: string;
  code: string;
  token?: string | (() => Promise<string>);
}

export async function getData({
  url,
  code,
  token,
}: GetDataParams): Promise<WidgetData | PageData> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  return data['data'];
}

export const isMobileDevice =
  typeof window !== 'undefined' && /Mobi/i.test(window?.navigator?.userAgent);

export const filterTileData = (data: TileData): boolean =>
  isMobileDevice ? data.tileType === 'Mobile' : data.tileType === 'Web';
