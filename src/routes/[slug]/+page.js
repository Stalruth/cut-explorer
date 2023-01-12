export async function load({ fetch, params }) {
  const response = await fetch(`/data/${params.slug}.json`);
  return await response.json();
}
