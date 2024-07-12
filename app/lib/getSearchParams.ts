export default function getSearchParams(request: Request, key: string) {
  const url = new URL(request.url);
  return url.searchParams.get(key);
}
