var fsima;
//variable donde se guarda la suma del valor de todos los materiales de un producto
var valorTotalMateriales = 0;
//Variable que guarda el valor total multiplicado por la cantidad de ordenes de producto
var total = 0;
var materialSeleccionado = "";
//Se ejecuta al cargar el dom
var ahorroMaterial;
var creada = false;
var arrPorcentaje = new Array();

$(document).ready(function () {
  $("#input-UnidadesFMes").attr("disabled", "disabled");
  $("#input-productoA").append(
    "<option selected disabled>Seleccione un producto</option>"
  );
  $.get("api/get_productosA.php?materials", (data, status, xhr) => {
    productsJSON = data;
    if (status == "success") {
      data.forEach((product) => {
        $("#input-productoA").append(
          `<option value="${product.id}">${product.name}</option>`
        );
      });
    }

    $("#input-productoA").change(function () {
      $("#input-UnidadesFMes").removeAttr("disabled");
      arrPorcentaje = new Array();
      if (creada == true) {
        $("#tableAnalisisMateriaPrimaAM").dataTable().fnDestroy();
        $("#tableAnalisisMateriaPrimaAM").empty();
        $("#tableAnalisisMateriaPrimaAM").append(
          '<thead class="text-primary"><th>Materia</th><th>Precio Actual</th>' +
            "<th>Precio a Negociar</th><th>Porcentaje a Negociar</th><th>Costo total</th><th>Costo mes </th><th>Costo proyectado </th></br></thead><tr></tr>" +
            "<tbody></tbody>"
        );
      }

      //se reinicia la variable que guardara el valor total
      valorTotalMateriales = 0;
      //Se captura el id del producto seleccionado
      let productSelected = data.filter(
        (product) => product.id == $(this).val()
      )[0];
      let idInputProducto = $("#input-productoA").val();
      //cambia el titulo de la tabla
      $("#Titulo").empty();
      $("#Titulo").append(productSelected.name);
      //Llamado de los materiales de la base de datos dependiendo del producto
      $.get(
        "api/get_materialesA.php?id=" + idInputProducto,
        (_material, status, xhr) => {
          materialsJSON = _material;

          //asigna a la variable creada arriba la suma del valor de los productos
          for (var i = 0; i < _material.length; i++) {
            valorTotalMateriales +=
              _material[i].quantity * _material[i].material.cost;
          }
          let inputCantidadOP = $("#input-cantidadOP").val();
          total = valorTotalMateriales * inputCantidadOP;
          const totalParsed = PriceParser.toString(total, false, 2);
          $("#Costo_total").val(totalParsed.strPrice);
          //Si el llamado es exitoso carga los datos en el input de los materiales
          if (status == "success") {
            creada = true;
            let productSelected = data.filter(
              (product) => product.id == $(this).val()
            )[0];
            $("#inputProductoA").val(productSelected.id);
            $("#title-products").text(productSelected.name);
            $("#input-materiaAM option[selected]").attr("selected", false);
            $("#input-materiaAM option[disabled]").attr("selected", "selected");
            $tableProductoMateriaA
              .api()
              .ajax.url(
                `api/get_materialesA.php?dataTable=true&id=${productSelected.id}`
              );
            $tableProductoMateriaA.api().ajax.reload();
            //Arreglo que guarda los datos de costo y descripcion de los materiales para ordenarlos
            let arregloMateriales = new Array();

            for (var i = 0; i < _material.length; i++) {
              arregloMateriales[i] = [
                _material[i].material.cost * _material[i].quantity,
                _material[i].material.description,
                _material[i].material.cost,
                _material[i].id,
                _material[i].quantity,
              ];
            }
            //variables para determinar y comparar el 80 % del costo de los productos
            var sumatoria = 0;
            var porcentaje = (80 * valorTotalMateriales) / 100;
            //Ordena el arreglo
            arregloMateriales = arregloMateriales.sort((a, b) => b[0] - a[0]);
            //Ciclo para validar los materiales que ocupan el 80% del costo del producto

            if (arregloMateriales != 0) {
              for (var i = 0; i < arregloMateriales.length; i++) {
                sumatoria += arregloMateriales[i][0];
                arrPorcentaje[i] = arregloMateriales[i];
                if (sumatoria >= porcentaje) break;
              }
            }
            $tableProductoMateriaAM = $(
              "#tableAnalisisMateriaPrimaAM"
            ).dataTable({
              aoColumnDefs: [
                {
                  bSortable: false,
                  aTargets: ["no-sort"],
                },
                {
                  asSorting: ["desc"],
                  aTargets: [5],
                },
              ],
              bFilter: false,
              bInfo: false,
              bPaginate: false,
              responsive: true,
              info: false,
              data: arrPorcentaje,
              columns: [
                { data: "1", defaultContent: "<p >Sin registro </p>" },
                {
                  data: "2",
                  defaultContent: "<p >Sin registro </p>",
                  render: (data, type, row) => {
                    const dataParsed = PriceParser.toString(data, true, 2);
                    return dataParsed.strPrice;
                  },
                },
                {
                  data: "0",
                  defaultContent: "<p >Sin registro </p>",
                  render: (data, type, row) => {
                    if (data != null)
                      return (
                        '<input type="text" class="input-precio-negociar form-control col-md-8"  style="margin-left:20%" value="0.00"  id="input-' +
                        row[3] +
                        '">'
                      );
                  },
                },
                {
                  data: "2",
                  render: (data, type, row) => {
                    if (data) {
                      const precio = parseFloat(
                        $(`#input-${row[3]}`).val() || 0
                      );
                      const porcentaje = 100 - precio / data;
                      return `${porcentaje}%`;
                    }
                    return 0;
                  },
                },
                {
                  data: "0",
                  render: (data, type, row) => {
                    if (data != null) {
                      const dataParsed = PriceParser.toString(
                        data * $("#input-UnidadesFMes").val(),
                        true,
                        2
                      );
                      return dataParsed.strPrice;
                    }
                  },
                },
                {
                  data: "0",
                  render: (data, type, row) => {
                    if (data != null) {
                      const dataParsed = PriceParser.toString(
                        data * $("#input-UnidadesFMes").val(),
                        true,
                        2
                      );
                      return dataParsed.strPrice;
                    }
                  },
                  className: "text-danger",
                },
                {
                  data: "1",
                  render: (data, type, row) => {
                    if (data != null) {
                      return "0.00";
                    }
                  },
                  className: "text-danger",
                },
              ],
            });
            $tableProductoMateriaAM.width("100%");
          }
          $(".input-precio-negociar").each(function () {
            const formatter = () => {
              const valParsed = PriceParser.fromString($(this).val(), false, 2);
              $(this).val(valParsed.strPrice);
            };
            $(this).keyup(formatter);
            $(this).change(formatter);
          });
        }
      );
    });
    $("#btnValidarNuevoPrecio").click(function () {
      let arr2 = new Array();

      for (var i = 0; i < arrPorcentaje.length; i++) {
        const precioParsed = PriceParser.fromString(
          $("#input-" + arrPorcentaje[i][3]).val(),
          true,
          2
        );
        arr2[i] = arrPorcentaje[i];
        if (arr2[i].length != 5) {
          arr2[i].pop();
        }
        arr2[i].push(precioParsed.price);
      }

      arr2 = arr2.sort((a, b) => b[0] - a[0]);

      $("#tableAnalisisMateriaPrimaAM").dataTable().fnDestroy();
      $("#tableAnalisisMateriaPrimaAM").empty();
      $("#tableAnalisisMateriaPrimaAM").append(
        '<thead class="text-primary"><th>Materia</th><th>Precio Actual</th>' +
          "<th>Precio Negociar</th></th><th>Porcentaje a Negociar</th><th>Costo total</th><th>Costo mes </th><th>Costo proyectado </th></br></thead><tr></tr>" +
          "<tbody></tbody> "
      );
      $tableProductoMateriaAM = $("#tableAnalisisMateriaPrimaAM").dataTable({
        bFilter: false,
        bInfo: false,
        bPaginate: false,
        responsive: true,
        info: false,
        data: arr2,
        columns: [
          { data: "1", defaultContent: "<p >Sin registro </p>" },
          {
            data: "2",
            defaultContent: "<p >Sin registro </p>",
            render: (data, type, row) => {
              const dataParsed = PriceParser.toString(data, true, 2);
              return dataParsed.strPrice;
            },
          },
          {
            data: "3",
            render: (data, type, row) => {
              if (data != null) {
                const precioParsed = PriceParser.toString(row[5], false, 2);
                return (
                  '<input type="text" class="input-precio-negociar form-control col-md-8"  style="margin-left:20%" value=' +
                  precioParsed.strPrice +
                  '  id="input-' +
                  row[3] +
                  '">'
                );
              } else {
                '<input type="text" class="input-precio-negociar form-control col-md-8"  style="margin-left:20%" value=0  id="input-' +
                  row[3] +
                  '">';
              }
            },
          },
          {
            data: "2",
            render: (data, type, row) => {
              if (data) {
                const precio = parseFloat(row[5]);
                const precioActual = parseFloat(data || 0);
                const porcentaje = (1 - precio / precioActual) * 100;
                return `${$.number(porcentaje, 2, ",", ".")}%`;
              }
            },
          },
          {
            data: "0",
            render: (data, type, row) => {
              const dataParsed = PriceParser.toString(data, true, 2);
              return dataParsed.strPrice;
            },
          },
          {
            data: "0",
            render: (data, type, row) => {
              if (data != null) {
                const dataParsed = PriceParser.toString(
                  data * $("#input-UnidadesFMes").val(),
                  true,
                  2
                );
                return dataParsed.strPrice;
              }
            },
            className: "text-danger",
          },
          {
            data: "5",
            render: (data, type, row) => {
              const dataParsed = PriceParser.toString(
                data * row[4] * $("#input-UnidadesFMes").val(),
                true,
                2
              );
              return dataParsed.strPrice;
            },
            className: "text-danger",
          },
        ],
      });

      $(".input-precio-negociar").each(function () {
        const formatter = () => {
          const valParsed = PriceParser.fromString($(this).val(), false, 2);
          $(this).val(valParsed.strPrice);
        };
        $(this).keyup(formatter);
        $(this).change(formatter);
      });
      $tableProductoMateriaAM.width("100%");
      var TotalMes = 0;
      var AhorroMes = 0;
      var AhorroMostrar = 0;
      for (var i = 0; i < arr2.length; i++) {
        if (arr2[i][5] == 0) {
          AhorroMes += arr2[i][0];
        }
        TotalMes += arr2[i][0];
        AhorroMes += arr2[i][5] * arr2[i][4];
      }

      if (AhorroMes != 0) {
        AhorroMostrar = TotalMes - AhorroMes;
      }
      const ahorroMesParsed = PriceParser.toString(
        AhorroMostrar * $("#input-UnidadesFMes").val(),
        true,
        2
      );
      const ahorroAnioParsed = PriceParser.toString(
        ahorroMesParsed.price * 12,
        true,
        2
      );
      $("#input-AhorroMes").val(ahorroMesParsed.strPrice);
      $("#input-AhorroAño").val(ahorroAnioParsed.strPrice);
    });
  });
  //evento al dar click al boton de vbalidar las ordenes de produccion
  $("#btnValidar").click(function () {
    let idInputProducto = $("#input-productoA").val();
    //Se consultan los productos de la base de datos
    $.get(
      "api/get_materialesA.php?id=" + idInputProducto,
      (_material, status, xhr) => {
        materialsJSON = _material;
        //Se cra un arreglo que guardara los productos que sumen el 80%
        let arrPorcentaje = [];
        //Se reinicia el valor de los materiales
        valorTotalMateriales = 0;
        //carga el valor de los materiales
        for (var i = 0; i < _material.length; i++) {
          valorTotalMateriales +=
            _material[i].quantity * _material[i].material.cost;
        }
        //Recarga la tabla de ordenes de produccion
        $tableProductoMateriaA.api().ajax.reload();
        //Guarda el numero de ordenes de produccion
        var inputCantidadOP = $("#input-cantidadOP").val();
        //multiplica  el valor de los materiales por el numero de ordenes de produccion
        total = valorTotalMateriales * inputCantidadOP;
        const totalParsed = PriceParser.toString(total, true, 2);
        $("#Costo_total").val(totalParsed.strPrice);
      }
    );
  });
});

//variable que guardara la cantidad del producto para dividirlo por el valor por kil
var cant;
var $tableProductoMateriaA = $("#tableAnalisisMateriaPrima").dataTable({
  bFilter: false,
  bInfo: false,
  bPaginate: false,
  order: [[5, "desc"]],
  language: {
    url: "/vendor/dataTables/Spanish.json",
    emptyTable: "Sin datos en la tabla",
  },
  responsive: true,
  ajax: {
    url: "api/get_materialesA.php?dataTable=true",
    dataSrc: "data",
  },
  columns: [
    {
      data: "material.description",
      defaultContent: "<p >Sin registro </p>",
    },
    {
      data: "quantity",
      defaultContent: "<p >Sin registro </p>",
      render: (data, type, row) => {
        cant = data;
        if (data != null) {
          if (parseFloat(data) < 1) {
            let sum = 0;
            for (let index = 0; index < data.toString().length; index++) {
              sum += data.toString().charAt(index) == "0" ? 1 : 0;
            }
            sum += 1;
            return $.number(data, sum, ",", ".");
          } else {
            return $.number(data, 2, ",", ".");
          }
        } else return data;
      },
    },
    {
      data: "material.cost",
      defaultContent: "<p >Sin registro </p>",
      render: (data, type, row) => {
        if (data != null) {
          return PriceParser.toString(data, true, 2).strPrice;
        }
      },
    },
    {
      data: "quantity",
      defaultContent: "<p>Sin registro </p>",
      render: (data, type, row) => {
        if (data != null) {
          let OP = $("#input-cantidadOP").val();
          if (parseFloat(data) < 1) {
            let sum = 0;
            for (let index = 0; index < data.toString().length; index++) {
              sum += data.toString().charAt(index) == "0" ? 1 : 0;
            }
            sum += 1;
            return $.number(data * OP, sum, ",", ".");
          } else {
            return $.number(data * OP, 2, ",", ".");
          }
        } else return data;
      },
    },
    {
      data: null,
      defaultContent: "<p>Sin registro </p>",
      render: (data, type) => {
        if (data !== "hola") {
          const OP = $("#input-cantidadOP").val();
          const { quantity, material: { cost } = {} } = data;
          const mul = parseFloat(cost) * quantity * OP;
          if (type === "display") {
            const mulParsed = PriceParser.toString(mul, true, 2);
            return mulParsed.strPrice;
          } else {
            return mul;
          }
        } else {
          return "<p>Sin registro </p>";
        }
      },
    },
    {
      data: null,
      defaultContent: "<p >Sin registro </p>",
      render: (data, type, row) => {
        if (data !== "hola") {
          const OP = $("#input-cantidadOP").val();
          const { quantity, material: { cost } = {} } = data;
          const mul = (quantity * parseFloat(cost) * OP * 100) / total;
          if (type === "display") {
            return mul.toFixed(5) + " %";
          }
          return mul;
        } else {
          return "<p >Sin registro </p>";
        }
      },
    },
  ],
  drawCallback: function () {
    const api = this.api();
    const totalParsed = PriceParser.toString(total, true, 2);
    $(api.column(0).footer()).html("Total: ");
    $(api.column(4).footer()).html(totalParsed.strPrice);
  },
});

$tableProductoMateriaA.width("100%");
$tableProductoMateriaA.on("click", "tr", function () {
  $(this).toggleClass("selected");
});
