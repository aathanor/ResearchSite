export async function onRequest(context) {
  const response = await context.next();
  const protectedResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

  protectedResponse.headers.set(
    'X-Robots-Tag',
    'noindex, nofollow, noarchive, nosnippet, noimageindex'
  );
  protectedResponse.headers.set('Cache-Control', 'private, no-store');

  return protectedResponse;
}
