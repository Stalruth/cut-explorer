export async function load({ fetch, params, url }) {
  const protocol = url.protocol.slice(0, -1);
  const hostname = url.hostname;
  const port = url.port;
  const response = await fetch(`/data/${params.slug}.json`);
  return { protocol, hostname, port, tournament: await response.json() };
}
