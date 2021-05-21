export function fillSelect(
  selectId,
  arrayValues,
  sorted = null,
  nonSelectedMessage = "Seleccione un item"
) {
  $(`#${selectId}`).append(
    `<option selected disabled>${nonSelectedMessage}</option>`
  );
  if (sorted) {
    if (typeof sorted == "function") {
      arrayValues = arrayValues.sort(sorted);
    } else {
      arrayValues = arrayValues.sort((elementA, elementB) =>
        elementA.description < elementB.description
          ? -1
          : elementA.description > elementB.description
          ? 1
          : 0
      );
    }
  }
  arrayValues.forEach((element) => {
    $(`#${selectId}`).append(
      `<option value="${element.value}">${element.description}</option>`
    );
  });
}
