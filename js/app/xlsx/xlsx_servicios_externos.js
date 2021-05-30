import { fetchData } from "../../utils/fetchData.js";
import { ImportacionXLSX } from "./ImportacionXLSX.js";

let productos = (await fetchData("/app/config-general/api/get_products.php"))
  .data;

const exportImportServiciosExternos = new ImportacionXLSX(
  "api/get_servicios_externos.php",
  "/formatos/formato-servicios-externos.xlsx",
  "Servicios Externos",
  "Servicios Externos",
  {
    Servicio: "name",
    Producto: "product",
    Costo: "cost",
  },
  $("#fileserviciosExternos"),
  (cell) => {
    const productExists = productos.find((prod) => prod.name === cell.producto);
    if (!productExists) {
      return {
        type: "Producto no existe",
        columnName: "producto",
      };
    }
    cell.producto = productExists.id;
  },
  (data) => {
    return data
      .filter((value) => value)
      .map((servicio) => {
        const productName = products.find(
          (prod) => prod.id === servicio.idProducto
        ).name;
        return {
          name: servicio.nombreServicio,
          product: productName,
          cost: servicio.costo,
        };
      });
  }
);

$("#fileserviciosExternos").change(function () {
  const subidaExcelServiciosExternos =
    exportImportServiciosExternos.subidaExcel;
  subidaExcelServiciosExternos.inputFile = this;
  subidaExcelServiciosExternos.onloadReader(() => {
    subidaExcelServiciosExternos.verifySheetName(() => {
      uploadServiciosExternos(subidaExcelServiciosExternos);
    });
  });
  subidaExcelServiciosExternos.clearFile();
});

function uploadServiciosExternos(subidaExcel) {
  const serviciosExternos = subidaExcel.array;
  $.post(
    "api/upload_servicios_externos.php",
    { serviciosExternos: JSON.stringify(serviciosExternos) },
    (data, status) => {
      if (status == "success") {
        let updatedCount = 0;
        let createdCount = 0;
        for (let index = 0; index < data.length; index++) {
          if (data[index]) {
            updatedCount++;
          } else {
            createdCount++;
          }
        }
        subidaExcel.resumenSubida(
          createdCount,
          updatedCount,
          "servicio",
          "servicios"
        );
      }
    }
  );
  $tableServiciosExternos.api().ajax.reload();
}

$("#download_serviciosExternos").click(() => {
  exportImportServiciosExternos.bajadaExcel.download();
});
