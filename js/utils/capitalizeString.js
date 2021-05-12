export function capitalizeString(strInput) {
  const str = String(strInput);
  let strOutput = "";
  let indexFirstLetter = -1;
  const firstLetter = str.split("").find((char, index) => {
    if (
      char != " " &&
      char != "," &&
      char != "." &&
      Number.isNaN(parseInt(char))
    ) {
      indexFirstLetter = index;
      return true;
    }
  });
  if (str.length > 0 && firstLetter) {
    firstLetter.toUpperCase();
    const start = str.slice(0, indexFirstLetter);
    const end = str.slice(indexFirstLetter + 1, str.length).toLowerCase();
    strOutput += start;
    strOutput += firstLetter;
    strOutput += end;
  }

  return strOutput;
}
