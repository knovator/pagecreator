import { WidgetData, PageData } from '../types';

interface GetDataParams {
  url: string;
  code: string;
  token?: string | (() => Promise<string>);
}

export async function getData({
  url,
  code,
  token,
}: GetDataParams): Promise<WidgetData | PageData | null> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ code }),
    });
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data['data'];
  } catch (error) {
    return null;
  }
}
