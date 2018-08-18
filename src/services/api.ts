const API_URL = 'http://v2.strichliste.org/api/';

export async function fetchJson(
  endpoint: string,
  options: RequestInit = {}
  // tslint:disable-next-line:no-any
): Promise<any> {
  return fetch(API_URL + endpoint, { ...options, mode: 'cors' }).then(
    async res => res.json()
  );
}
