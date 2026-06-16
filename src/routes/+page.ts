import { PUBLIC_API_URL } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: Pageload = async ({ fetch, params }) => {
  const [
    yearsResponse,
    tourInfoResponse
  ] = await Promise.all([
    fetch(`${PUBLIC_API_URL}/tournaments/years.json`),
    fetch(`${PUBLIC_API_URL}/tournaments/current-year.json`)
  ]);

  return {
    tourInfo: await tourInfoResponse.json(),
    years: await yearsResponse.json()
  }
};

