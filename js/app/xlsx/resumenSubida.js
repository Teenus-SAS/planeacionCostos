function resumenSubidaExcel(
  createdCount,
  updatedCount,
  stringType,
  pluralStringType
) {
  return bootbox.dialog({
    title: "Resumen subida",
    message: `<p><b>-</b> Se ${
      updatedCount > 1 ? "han" : "ha"
    } <i>actualizado</i> ${updatedCount} ${
      updatedCount > 1 || updatedCount == 0 ? pluralStringType : stringType
    }.</p><p><b>-</b> Se ${
      updatedCount > 1 ? "han" : "ha"
    } <i>cargado</i> ${createdCount} ${
      createdCount > 1 || createdCount == 0 ? pluralStringType : stringType
    }.</p>`,
  });
}
