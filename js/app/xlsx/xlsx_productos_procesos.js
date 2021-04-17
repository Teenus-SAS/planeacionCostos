import { ImportacionXLSX } from "./ImportacionXLSX.js";

let productos = [];
let procesos = [];
let maquinas = [];
$.get("/app/config-general/api/get_processes.php", (data, status, xhr) => {
  procesos = data;
});
$.get("/app/config-general/api/get_machines.php", (data, status, xhr) => {
  maquinas = data;
});
$.get("/app/config-general/api/get_products.php", (data, status, xhr) => {
  productos = data;
});

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
    TiempoAlistamiento: "process.timeAlistamiento",
    TiempoOperacion: "process.timeOperacion",
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
        String(proc.name).toLowerCase() == String(cell.proceso).toLowerCase()
    );
    const maquinaExists = maquinas.find(
      (mach) =>
        String(mach.name).toLowerCase() == String(cell.maquina).toLowerCase()
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
    if (!maquinaExists && cell.maquina != "N/A" && cell.maquina != undefined) {
      return {
        type: "Maquina no existe",
        columnName: "maquina",
      };
    }

    cell.proceso = processExists.id;
    if (maquinaExists) {
      cell.maquina = maquinaExists.id;
    } else {
      cell.maquina = "NULL";
    }
  },
  (data) => {
    const mapped = [];
    data.forEach((product) => {
      if (product.processes) {
        product.processes.forEach((process) => {
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
