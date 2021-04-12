function resumenSubidaExcel(
  createdCount,
  updatedCount,
  errorsCount,
  stringType,
  pluralStringType
) {
  const updatedString = `<p>- Se ${
    updatedCount > 1 ? "han" : "ha"
  } <span style="color:blue">actualizado</span> ${updatedCount} ${
    updatedCount > 1 || updatedCount == 0 ? pluralStringType : stringType
  }.</p>`;
  const createdString = `<p>- Se ${
    createdCount > 1 ? "han" : "ha"
  } <span style="color:green">cargado</span> ${createdCount} ${
    createdCount > 1 || createdCount == 0 ? pluralStringType : stringType
  }.</p>`;
  const errorsString = `<p>- ${errorsCount} ${
    errorsCount > 1 ? "filas" : "fila"
  } <span style="color:red">con errores</span>.</p>`;
  return bootbox.dialog({
    title: "Resumen subida",
    message: `${createdCount > 0 ? createdString : ""}${
      updatedCount > 0 ? updatedString : ""
    }${errorsCount > 0 ? errorsString : ""}`,
  });
}
