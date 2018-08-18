const API_URL = 'http://v2.strichliste.org/api/';

export async function get(
  endpoint: string,
  method: string = 'GET'
  // tslint:disable-next-line:no-any
): Promise<any> {
  return fetch(API_URL + endpoint, { mode: 'cors', method }).then(async res =>
    res.json()
  );
}
