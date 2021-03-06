import { fetchData } from "../../utils/fetchData.js";
import { ImportacionXLSX } from "./ImportacionXLSX.js";

let productos = (await fetchData("/app/config-general/api/get_products.php"))
  .data;
let procesos = (await fetchData("/app/config-general/api/get_processes.php"))
  .data;
let maquinas = (await fetchData("/app/config-general/api/get_machines.php"))
  .data;

const exportImportProductosProcesos = new ImportacionXLSX(
  "/app/config-general/api/get_products.php?process",
  "/formatos/formato-procesos-productos.xlsx",
  "ProcesosProductos",
  "Productos x Procesos",
  {
    Referencia: "ref",
    Producto: "name",
    Proceso: "process.name",
    Maquina: "process.machine",
    "Tiempo Alistamiento": "process.timeAlistamiento",
    "Tiempo Operación": "process.timeOperacion",
  },
  $("#fileProductsProcesses"),
  (cell) => {
    const productExists = productos.find(
      (prod) =>
        String(prod.name).toLowerCase() ==
          String(cell.producto).toLowerCase() && prod.ref == cell.referencia
    );
    const processExists = procesos.find(
      (proc) =>
        String(proc.name).trim().toLowerCase() ==
        String(cell.proceso).trim().toLowerCase()
    );
    const maquinaExists = maquinas.find(
      (mach) =>
        String(mach.name).trim().toLowerCase() ==
        String(cell.maquina).trim().toLowerCase()
    );
    if (!productExists) {
      return {
        type: "Producto no existe",
        columnName: "producto",
      };
    }
    if (!processExists) {
      return {
        type: "Proceso no existe",
        columnName: "proceso",
      };
    }
    if (
      !maquinaExists &&
      cell.maquina != "N/A" &&
      cell.maquina != undefined &&
      cell.maquina != ""
    ) {
      return {
        type: "Maquina no existe",
        columnName: "maquina",
      };
    }

    cell.proceso = processExists.id;
    if (maquinaExists) {
      cell.maquina = maquinaExists.id;
    } else {
      cell.maquina = null;
    }
  },
  (data) => {
    const mapped = [];
    data.forEach((product) => {
      if (product.productProcesses) {
        product.productProcesses.forEach((process) => {
          mapped.push({
            ref: product.ref,
            name: product.name,
            process: {
              name: process.process.name,
              machine: !process.machine ? "N/A" : process.machine.name,
              timeAlistamiento: process.timeAlistamiento,
              timeOperacion: process.timeOperacion,
            },
          });
        });
      }
    });
    return mapped;
  },
  (data) => {
    return data;
  }
);

$("#download-products-processes").click(function () {
  exportImportProductosProcesos.bajadaExcel.download();
});

$("#fileProductsProcesses").change(function () {
  const subidaExcelProductosProcesos =
    exportImportProductosProcesos.subidaExcel;
  subidaExcelProductosProcesos.inputFile = this;
  $("#spinnerAjax").removeClass("fade");
  subidaExcelProductosProcesos.onloadReader(() => {
    subidaExcelProductosProcesos.verifySheetName(() => {
      uploadProductsProcess(subidaExcelProductosProcesos);
    });
  });
  $("#spinnerAjax").addClass("fade");
});

function uploadProductsProcess(subidaExcel) {
  const productsProcess = subidaExcel.array;
  $.post(
    "api/upload_products_processes.php",
    { productsProcess: JSON.stringify(productsProcess) },
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
          "tiempo de proceso",
          "tiempos de procesos"
        );
      }
    }
  );
}
