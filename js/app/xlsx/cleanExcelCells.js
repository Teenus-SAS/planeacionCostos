function cleanExcelCells(array) {
  let mapped = [];
  array.forEach((item) => {
    let keys = Object.keys(item);
    let cleaned = {};
    keys.forEach((key) => {
      cleaned[key.trim()] =
        typeof item[key] == "string" ? item[key].trim() : item[key];
    });
    mapped.push(cleaned);
  });
  return mapped;
}
