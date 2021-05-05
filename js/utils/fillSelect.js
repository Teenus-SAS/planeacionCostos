export function fillSelect(
  selectId,
  arrayValues,
  nonSelectedMessage = "Seleccione un item"
) {
  $(`#${selectId}`).append(
    `<option selected disabled>${nonSelectedMessage}</option>`
  );
  arrayValues.forEach((element) => {
    $(`#${selectId}`).append(
      `<option value="${element.value}">${element.description}</option>`
    );
  });
}
