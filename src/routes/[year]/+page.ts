import { PUBLIC_API_URL } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: Pageload = async ({ fetch, params }) => {
  const tourInfo = await (
    await fetch(`${PUBLIC_API_URL}/tournaments/${params.year}/tournaments.json`)
  ).json();

  return {
    tourInfo,
    year: params.year
  }
};

