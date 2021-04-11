$("#fileserviciosExternos").change(function () {
  var reader = new FileReader();
  let file = this.files[0];
  let fileInput = this;
  $(this).siblings("label").text(file.name);
  reader.onloadend = function () {
    let data = new Uint8Array(reader.result);
    let workbook = XLSX.read(data, { type: "array" });
    let workSheet = workbook.Sheets["Servicios Externos"];
    let serviciosF = XLSX.utils.sheet_to_json(workSheet);
    let errorsServiciosF = verifyErrorsServiciosF(serviciosF);
    if (errorsServiciosF.length == 0) {
      if (workbook.Sheets["Servicios Externos"] != undefined) {
        if (serviciosF.length == 0) {
          $.alert({
            title: "Tezlik",
            content: "Este archivo está vacío",
          });
        } else {
          bootbox.confirm({
            title: "Importar servicios externos",
            message: `Los datos han sido procesados y estan listos para ser cargados`,
            buttons: {
              confirm: {
                label: '<i class="fa fa-check"></i> Continuar',
                className: "btn-success",
              },
              cancel: {
                label: '<i class="fa fa-times"></i> Cancelar',
                className: "btn-info",
              },
            },
            callback: function (result) {
              if (result == true) {
                uploadServiciosF(serviciosF);
              } else {
                $.notify(
                  {
                    icon: "nc-icon nc-bell-55",
                    message: `Proceso cancelado`,
                  },
                  {
                    type: "info",
                    timer: 8000,
                  }
                );
              }
            },
          });
        }
      } else {
        $.dialog({
          title: "Peligro",
          content:
            "<b>Este archivo no cumple los formatos indicados:</b> <br>" +
            "No se encontró la hoja 'Servicios Externos' en el archivo Excel",
          type: "red",
        });
      }
      $("#form-serviciosExternos")[0].reset();
      clearFile(fileInput);
    } else {
      $.dialog({
        title: "Peligro",
        content:
          "Este Archivo no cumple los formatos indicados <br>" +
          bugsToString(errorsServiciosF),
        type: "red",
      });
      $("#form-serviciosExternos")[0].reset();
      clearFile(fileInput);
    }
  };
  if (file) {
    reader.readAsArrayBuffer(file);
  }
});

function bugsToString(bugs) {
  let string = "";
  bugs.forEach((bug) => {
    string += `<p style="color:red">${bug.type}  <b>fila: ${bug.row}</b> </p>`;
  });
  return string;
}

function verifyErrorsServiciosF(jsonObj) {
  let errors = [];
  for (let index = 0; index < jsonObj.length; index++) {
    let servicioExterno = jsonObj[index];
    if (servicioExterno.Servicio == undefined) {
      errors.push({
        type: "El nombre del servicio no puede ser vacio",
        row: servicioExterno.__rowNum__ + 1,
      });
    }
    if (servicioExterno.Producto == undefined) {
      errors.push({
        type: "El nombre del producto no puede ser vacio",
        row: servicioExterno.__rowNum__ + 1,
      });
    }
    if (servicioExterno.Costo == undefined) {
      errors.push({
        type: "El costo no puede ser vacio",
        row: servicioExterno.__rowNum__ + 1,
      });
    } else if (isNaN(parseFloat(servicioExterno.Costo))) {
      errors.push({
        type: "El costo del servicio debe ser numérico",
        row: servicioExterno.__rowNum__ + 1,
      });
    }
  }
  return errors;
}
let products;
$.get("/app/products/api/get_products.php", (dataProducts, status, xhr) => {
  products = dataProducts;
});

function uploadServiciosF(serviciosF) {
  loadingSpinner();

  let criticalError = false;
  serviciosF.forEach((servF) => {
    const product = products.find((prod) => prod.name === servF.Producto);
    if (!product) {
      criticalError = true;
      $.notify(
        {
          icon: "nc-icon nc-bell-55",
          message: `No se encontró el producto con nombre ${servF.Producto}`,
        },
        {
          type: "danger",
          timer: 8000,
        }
      );
    }
    servF.Producto = product.id;
  });

  $.post(
    "api/upload_servicios_externos.php",
    { serviciosExternos: JSON.stringify(serviciosF) },
    (data, status) => {
      if (status == "success") {
        let countSuccess = 0;
        for (let index = 0; index < data.length; index++) {
          if (data[index]) {
            countSuccess++;
          } else {
            $.notify(
              {
                icon: "nc-icon nc-bell-55",
                message: `Algo ha salido mal con el servicio ${serviciosF[index].Servicio}`,
              },
              {
                type: "danger",
                timer: 8000,
              }
            );
          }
        }
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: `Se ${
              countSuccess > 1 ? "han" : "ha"
            } cargado ${countSuccess} ${
              countSuccess > 1 ? "servicios" : "servicio"
            }`,
          },
          {
            type: "success",
            timer: 8000,
          }
        );
      }
    }
  );
  completeSpinner();
}

function clearFile(input) {
  $(input).val("");
  $(input).siblings("label").text("Seleccionar Archivo");
}

function generateFileServiciosF() {
  loadingSpinner();
  // creacion del libro de excel
  var wb = XLSX.utils.book_new();
  // configuración de del libro
  wb.Props = {
    Title: "ServiciosExternos",
    Subject: "Tezlik",
    Author: "Tezlik",
    CreatedDate: new Date(),
  };
  // agregado de los nombres de las hojas del libro
  wb.SheetNames.push("Servicios Externos");
  // creacion de variables para cargar la información de los materiales
  let ws_data = [];
  $.get("api/get_servicios_externos.php", (data, status) => {
    data.forEach((servicioF) => {
      const productName = products.find(
        (prod) => prod.id === servicioF.idProducto
      ).name;
      ws_data.push({
        Servicio: servicioF.nombreServicio,
        Producto: productName,
        Costo: servicioF.costo,
      });
    });
    // se verifica que hayan datos
    if (ws_data.length <= 0) {
      saveAs(
        "/formatos/formato-servicios-externos.xlsx",
        "formato-servicios-externos.xlsx"
      );
    } else {
      // parseo de objetos a las hojas de excel
      var ws = XLSX.utils.json_to_sheet(ws_data);
      // asignacion de hojas de excel
      wb.Sheets["Servicios Externos"] = ws;
      var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      var wopts = { bookType: "xlsx", bookSST: false, type: "array" };
      var wbout = XLSX.write(wb, wopts);

      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "ServiciosExternos.xlsx"
      );
    }
  });
  completeSpinner();
}

$("#download_serviciosExternos").click(generateFileServiciosF);
