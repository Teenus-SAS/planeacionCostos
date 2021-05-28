export async function fetchData(url, options = null) {
  if (options && options.body) {
    if (!options.method || options.method == "GET") {
      const body = options.body;
      const bodyKeys = Object.keys(body);
      options.body = undefined;
      url += "?";
      bodyKeys.forEach((key) => {
        url += `${key}=${body[key]}&`;
      });
      if (bodyKeys.length > 0) {
        url = url.substr(0, url.length - 1);
      }
    } else {
      options.body = JSON.stringify(options.body);
    }
  }
  const data = await fetch(url, options);
  return await data.json();
}
