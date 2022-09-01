import { WidgetData } from '../types';

interface GetWidgetDataParams {
  url: string;
  code: string;
  token?: string | (() => Promise<string>);
}

export async function getWidgetData({
  url,
  code,
  token,
}: GetWidgetDataParams): Promise<WidgetData> {
  let apiToken = token;
  if (typeof token === 'function') apiToken = await token();

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `jwt ${apiToken}`,
    },
    body: JSON.stringify({ code }),
  });
  const data = await response.json();
  return data['data'];
}
