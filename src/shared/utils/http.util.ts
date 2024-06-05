export class HttpUtil {
  buildUrl(baseUrl: string, params: Params): string {
    const queryString = Object.keys(params)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(
            params[key].toString(),
          )}`,
      )
      .join('&');

    const url = `${baseUrl}${queryString ? `?${queryString}` : ''}`;

    return url;
  }
}

export interface Params {
  [key: string]: string | number | boolean;
}
