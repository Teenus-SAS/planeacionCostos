export async function fetchData(url, options = null) {
  const data = await fetch(url);
  return await data.json();
}
