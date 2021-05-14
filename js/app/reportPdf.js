let ctx = document.getElementById("chartCostPdf").getContext("2d");
charCostPdf = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "Materia Prima",
      "Costos Indirectos",
      "Mano de Obra",
      "Comisiones",
      "Gastos Generales",
    ],
    datasets: [
      {
        borderColor: "#fff",
        backgroundColor: color,
        borderWidth: 1,
        data: [0, 0, 0, 0, 0],
      },
    ],
  },
  options: {
    responsive: true,
    legend: {
      display: false,
    },
    plugins: {
      datalabels: {
        align: "end",
        anchor: "center",
        clamp: true,
        backgroundColor: "#fff",
        borderColor: function (context) {
          return context.dataset.backgroundColor;
        },
        borderWidth: 2,
        borderRadius: 2,
        color: function (context) {
          return context.dataset.backgroundColor;
        },
        font: function (context) {
          var w = context.chart.width;
          return {
            size: w < 512 ? 12 : 14,
          };
        },
        formatter: function (value, context) {
          return `$ ${$.number(value, 2, ",", ".")}`;
        },
      },
    },
  },
});

$("#downloaad-pdf").click(() => {
  let doc = new jsPDF("p", "pt", "letter");
  // titulo del documento
  doc.text("Reporte General", 300, 50, {
    align: "center",
  });

  charCostPdf.data.datasets[0].data = [
    $.number(consolidated.rawMaterialExpenses, 2, "."),
    $.number(consolidated.indirectExpenses, 2, "."),
    $.number(consolidated.laborCost, 2, "."),
    $.number(consolidated.salesCommission, 2, "."),
    $.number(consolidated.generalExpenses, 2, "."),
  ];
  charCostPdf.update({ duration: 0 });
  // tabla de contenido
  doc.text("Contenido", 30, 100);
  doc.setFontSize(11);

  doc.text("1. Listado de Productos", 45, 120);
  doc.text("pág. 2", doc.internal.pageSize.getWidth() - 60, 120);

  doc.text("2. Consolidado", 45, 140);
  doc.text("pág. 3", doc.internal.pageSize.getWidth() - 60, 140);

  doc.text("3. Detalle de Costeo por Producto e indicadores", 45, 160);
  doc.text("pág. 4", doc.internal.pageSize.getWidth() - 60, 160);

  let countPixeles = 180;
  let countPages = 4;
  // listado de productos
  productsReq.forEach((productReq, indx) => {
    let product = products.filter((product) => product.id == productReq.id)[0];
    doc.text(`${indexAlphabet(indx)}. ${product.name}`, 60, countPixeles);
    doc.text(
      `pág. ${countPages}`,
      doc.internal.pageSize.getWidth() - 60,
      countPixeles
    );
    countPixeles += 20;
    countPages += 2;
  });
  doc.addPage();

  doc.setFontSize(14);
  doc.text("Listado de Productos Cotizados", 300, 120, {
    align: "center",
  });

  // tabla de productos cotizados
  doc.autoTable({
    html: "#tableProducts",
    startY: 150,
    theme: "grid",
  });
  doc.addPage();
  doc.setFontSize(16);
  // datos de consolidado
  doc.text("Consolidado", 300, 50, {
    align: "center",
  });
  doc.setFontSize(11);
  doc.setTextColor(81, 203, 206);
  doc.text(`Productos Cotizados: ${productsReq.length}`, 30, 90);
  doc.setTextColor(0);
  let heightautotable = 110;
  let pageNumber = doc.internal.getNumberOfPages();
  // tabla de precio de venta
  doc.autoTable({
    head: [
      [
        {
          content: "Precio de Venta",
          colSpan: 2,
          styles: { halign: "center" },
        },
      ],
    ],
    body: [
      [
        { content: "COP", styles: { halign: "center" } },
        { content: "USD", styles: { halign: "center" } },
      ],
      [
        {
          content: `$ ${$.number(consolidated.salePrice, 2, ",", ".")}`,
          styles: { halign: "right" },
        },
        {
          content: `$ ${$.number(
            consolidated.salePrice / limInf,
            2,
            ",",
            "."
          )}`,
          styles: { halign: "right" },
        },
      ],
    ],
    startY: heightautotable,
    showHead: "firstPage",
    styles: { overflow: "hidden" },
    margin: { right: 320 },
    theme: "grid",
  });
  doc.setPage(pageNumber);

  // tabla de costos Totales
  doc.autoTable({
    head: [
      [{ content: "Costos Totales", colSpan: 2, styles: { halign: "center" } }],
    ],
    body: [
      [
        { content: "COP", styles: { halign: "center" } },
        { content: "USD", styles: { halign: "center" } },
      ],
      [
        {
          content: `$ ${$.number(consolidated.totalCost, 2, ",", ".")}`,
          styles: { halign: "right" },
        },
        {
          content: `$ ${$.number(
            consolidated.totalCost / limInf,
            2,
            ",",
            "."
          )}`,
          styles: { halign: "right" },
        },
      ],
    ],
    startY: heightautotable,
    showHead: "firstPage",
    styles: { overflow: "hidden" },
    margin: { left: 320 },
    theme: "grid",
  });

  // tabla de costos
  doc.autoTable({
    head: [[{ content: "Costos", colSpan: 3, styles: { halign: "center" } }]],
    body: [
      [
        { content: "Detalles", styles: { halign: "center" } },
        { content: "COP", styles: { halign: "center" } },
        { content: "USD", styles: { halign: "center" } },
      ],
      [
        { content: "Materia Prima", styles: { halign: "left" } },
        {
          content: `$ ${$.number(
            consolidated.rawMaterialExpenses,
            2,
            ",",
            "."
          )}`,
          styles: { halign: "right" },
        },
        {
          content: `$ ${$.number(
            consolidated.rawMaterialExpenses / limInf,
            2,
            ",",
            "."
          )}`,
          styles: { halign: "right" },
        },
      ],
      [
        { content: "Mano de Obra", styles: { halign: "lef" } },
        {
          content: `$ ${$.number(consolidated.laborCost, 2, ",", ".")}`,
          styles: { halign: "right" },
        },
        {
          content: `$ ${$.number(
            consolidated.laborCost / limInf,
            2,
            ",",
            "."
          )}`,
          styles: { halign: "right" },
        },
      ],
      [
        {
          content: "Costos Indirectos de fabricación",
          styles: { halign: "left" },
        },
        {
          content: `$ ${$.number(consolidated.indirectExpenses, 2, ",", ".")}`,
          styles: { halign: "right" },
        },
        {
          content: `$ ${$.number(
            consolidated.indirectExpenses / limInf,
            2,
            ",",
            "."
          )}`,
          styles: { halign: "right" },
        },
      ],
      [
        { content: "Total", styles: { halign: "left" } },
        {
          content: `$ ${$.number(consolidated.cost, 2, ",", ".")}`,
          styles: { halign: "right" },
        },
        {
          content: `$ ${$.number(consolidated.cost / limInf, 2, ",", ".")}`,
          styles: { halign: "right" },
        },
      ],
    ],
    startY: doc.autoTable.previous.finalY + 10,
    showHead: "firstPage",
    styles: { overflow: "hidden" },
    theme: "grid",
  });

  // tabla de gastos
  doc.autoTable({
    head: [[{ content: "Gastos", colSpan: 3, styles: { halign: "center" } }]],
    body: [
      [
        { content: "Detalles", styles: { halign: "center" } },
        { content: "COP", styles: { halign: "center" } },
        { content: "USD", styles: { halign: "center" } },
      ],
      [
        { content: "Gastos Generales", styles: { halign: "left" } },
        {
          content: `$ ${$.number(consolidated.generalExpenses, 2, ",", ".")}`,
          styles: { halign: "right" },
        },
        {
          content: `$ ${$.number(
            consolidated.generalExpenses / limInf,
            2,
            ",",
            "."
          )}`,
          styles: { halign: "right" },
        },
      ],
      [
        { content: "Comision de Ventas", styles: { halign: "lef" } },
        {
          content: `$ ${$.number(consolidated.salesCommission, 2, ",", ".")}`,
          styles: { halign: "right" },
        },
        {
          content: `$ ${$.number(
            consolidated.salesCommission / limInf,
            2,
            ",",
            "."
          )}`,
          styles: { halign: "right" },
        },
      ],
      [
        { content: "Rentabilidad", styles: { halign: "left" } },
        {
          content: `$ ${$.number(consolidated.profitability, 2, ",", ".")}`,
          styles: { halign: "right" },
        },
        {
          content: `$ ${$.number(
            consolidated.profitability / limInf,
            2,
            ",",
            "."
          )}`,
          styles: { halign: "right" },
        },
      ],
    ],
    startY: doc.autoTable.previous.finalY + 10,
    showHead: "firstPage",
    styles: { overflow: "hidden" },
    theme: "grid",
  });

  doc.addImage(
    charCostPdf.toBase64Image(),
    "PNG",
    150,
    doc.autoTable.previous.finalY + 40,
    300,
    200
  );
  let count = 0;

  productsReq.forEach((productReq, indexProduct) => {
    $.ajax({
      async: false,
      type: "get",
      url: "api/cost_product.php",
      data: {
        id: productReq.id,
        quantity: productReq.quantity,
      },
      success: function (data) {
        doc.addPage();
        let product = products.filter(
          (product) => product.id == productReq.id
        )[0];
        doc.setFontSize(16);

        if (indexProduct == 0) {
          doc.text("Detalle de Costeo por Producto e indicadores", 300, 80, {
            align: "center",
          });
          doc.text(product.name, 300, 120, {
            align: "center",
          });
        } else {
          doc.text(product.name, 300, 80, {
            align: "center",
          });
        }

        doc.setFontSize(11);
        let heightautotable = 150;
        let pageNumber = doc.internal.getNumberOfPages();
        // tabla de precio de venta
        doc.autoTable({
          head: [
            [
              {
                content: "Precio de Venta",
                colSpan: 2,
                styles: { halign: "center" },
              },
            ],
          ],
          body: [
            [
              { content: "COP", styles: { halign: "center" } },
              { content: "USD", styles: { halign: "center" } },
            ],
            [
              {
                content: `$ ${$.number(data.salePrice, 2, ",", ".")}`,
                styles: { halign: "right" },
              },
              {
                content: `$ ${$.number(data.salePrice / limInf, 2, ",", ".")}`,
                styles: { halign: "right" },
              },
            ],
          ],
          startY: heightautotable,
          showHead: "firstPage",
          styles: { overflow: "hidden" },
          margin: { right: 320 },
          theme: "grid",
        });
        doc.setPage(pageNumber);

        // tabla de costos Totales
        doc.autoTable({
          head: [
            [
              {
                content: "Costos Totales",
                colSpan: 2,
                styles: { halign: "center" },
              },
            ],
          ],
          body: [
            [
              { content: "COP", styles: { halign: "center" } },
              { content: "USD", styles: { halign: "center" } },
            ],
            [
              {
                content: `$ ${$.number(data.totalCost, 2, ",", ".")}`,
                styles: { halign: "right" },
              },
              {
                content: `$ ${$.number(data.totalCost / limInf, 2, ",", ".")}`,
                styles: { halign: "right" },
              },
            ],
          ],
          startY: heightautotable,
          showHead: "firstPage",
          styles: { overflow: "hidden" },
          margin: { left: 320 },
          theme: "grid",
        });

        // tabla de costos
        doc.autoTable({
          head: [
            [{ content: "Costos", colSpan: 3, styles: { halign: "center" } }],
          ],
          body: [
            [
              { content: "Detalles", styles: { halign: "center" } },
              { content: "COP", styles: { halign: "center" } },
              { content: "USD", styles: { halign: "center" } },
            ],
            [
              { content: "Materia Prima", styles: { halign: "left" } },
              {
                content: `$ ${$.number(data.rawMaterialExpenses, 2, ",", ".")}`,
                styles: { halign: "right" },
              },
              {
                content: `$ ${$.number(
                  data.rawMaterialExpenses / limInf,
                  2,
                  ",",
                  "."
                )}`,
                styles: { halign: "right" },
              },
            ],
            [
              { content: "Mano de Obra", styles: { halign: "lef" } },
              {
                content: `$ ${$.number(data.laborCost, 2, ",", ".")}`,
                styles: { halign: "right" },
              },
              {
                content: `$ ${$.number(data.laborCost / limInf, 2, ",", ".")}`,
                styles: { halign: "right" },
              },
            ],
            [
              {
                content: "Costos Indirectos de fabricación",
                styles: { halign: "left" },
              },
              {
                content: `$ ${$.number(data.indirectExpenses, 2, ",", ".")}`,
                styles: { halign: "right" },
              },
              {
                content: `$ ${$.number(
                  data.indirectExpenses / limInf,
                  2,
                  ",",
                  "."
                )}`,
                styles: { halign: "right" },
              },
            ],
            [
              { content: "Total", styles: { halign: "left" } },
              {
                content: `$ ${$.number(data.cost, 2, ",", ".")}`,
                styles: { halign: "right" },
              },
              {
                content: `$ ${$.number(data.cost / limInf, 2, ",", ".")}`,
                styles: { halign: "right" },
              },
            ],
          ],
          startY: doc.autoTable.previous.finalY + 10,
          showHead: "firstPage",
          styles: { overflow: "hidden" },
          theme: "grid",
        });

        // tabla de gastos
        doc.autoTable({
          head: [
            [{ content: "Gastos", colSpan: 3, styles: { halign: "center" } }],
          ],
          body: [
            [
              { content: "Detalles", styles: { halign: "center" } },
              { content: "COP", styles: { halign: "center" } },
              { content: "USD", styles: { halign: "center" } },
            ],
            [
              { content: "Gastos Generales", styles: { halign: "left" } },
              {
                content: `$ ${$.number(data.generalExpenses, 2, ",", ".")}`,
                styles: { halign: "right" },
              },
              {
                content: `$ ${$.number(
                  data.generalExpenses / limInf,
                  2,
                  ",",
                  "."
                )}`,
                styles: { halign: "right" },
              },
            ],
            [
              { content: "Comision de Ventas", styles: { halign: "lef" } },
              {
                content: `$ ${$.number(data.salesCommission, 2, ",", ".")}`,
                styles: { halign: "right" },
              },
              {
                content: `$ ${$.number(
                  data.salesCommission / limInf,
                  2,
                  ",",
                  "."
                )}`,
                styles: { halign: "right" },
              },
            ],
            [
              { content: "Rentabilidad", styles: { halign: "left" } },
              {
                content: `$ ${$.number(data.profitability, 2, ",", ".")}`,
                styles: { halign: "right" },
              },
              {
                content: `$ ${$.number(
                  data.profitability / limInf,
                  2,
                  ",",
                  "."
                )}`,
                styles: { halign: "right" },
              },
            ],
          ],
          startY: doc.autoTable.previous.finalY + 10,
          showHead: "firstPage",
          styles: { overflow: "hidden" },
          theme: "grid",
        });

        charCostPdf.data.datasets[0].data = [
          $.number(data.rawMaterialExpenses, 2, "."),
          $.number(data.indirectExpenses, 2, "."),
          $.number(data.laborCost, 2, "."),
          $.number(data.salesCommission, 2, "."),
          $.number(data.generalExpenses, 2, "."),
        ];
        charCostPdf.update({ duration: 0 });
        doc.addImage(
          charCostPdf.toBase64Image(),
          "PNG",
          150,
          doc.autoTable.previous.finalY + 40,
          300,
          200
        );

        // agregado de indicadores por producto
        doc.addPage();

        // aqui se cargaran los indicadores para cada producto
        $.ajax({
          async: false,
          type: "get",
          url: "api/indicators.php",
          data: {
            id: productReq.id,
            quantity: productReq.quantity,
          },
          success: function (data) {
            // actualización de datos del grafico de procesos
            let namesProcess = [];
            let valuesProcess = [];
            let colorsProcess = [];
            if (data.processes != undefined) {
              data.processes.forEach((process) => {
                namesProcess.push(process.name);
                valuesProcess.push(parseFloat(process.time));
                colorsProcess.push(
                  colors[Math.floor(Math.random() * (colors.length - 0)) + 0]
                );
              });
            }

            chartProcess.data.datasets[0].data = valuesProcess;
            chartProcess.data.datasets[0].backgroundColor = colorsProcess;
            chartProcess.data.labels = namesProcess;

            chartProcess.update({ duration: 0 });

            // actualización de datos del grafico de mano de obra
            let namesProcessLC = [];
            let valuesLaborCost = [];
            let colorsLaborCost = [];
            if (data.ManoObra != undefined) {
              data.ManoObra.forEach((ManoObra) => {
                namesProcessLC.push(ManoObra.process);
                valuesLaborCost.push(parseFloat(ManoObra.costo));
                colorsLaborCost.push(
                  colors[Math.floor(Math.random() * (colors.length - 0)) + 0]
                );
              });
            }

            chartLaborCost.data.datasets[0].data = valuesLaborCost;
            chartLaborCost.data.datasets[0].backgroundColor = colorsLaborCost;
            chartLaborCost.data.labels = namesProcessLC;

            chartLaborCost.update({ duration: 0 });

            // actualización de datos del grafico de costos de materiales
            let namesMaterials = [];
            let valuesMaterials = [];
            let colorsMaterials = [];
            let totalMaterial = data.rawMaterialExpenses;
            data.rawMaterials.sort(function (a, b) {
              return b.cost - a.cost;
            });
            if (data.rawMaterials != undefined) {
              data.rawMaterials.forEach((rawMaterial) => {
                namesMaterials.push(rawMaterial.material);
                valuesMaterials.push(parseFloat(rawMaterial.cost));
                colorsMaterials.push(
                  colors[Math.floor(Math.random() * (colors.length - 0)) + 0]
                );
              });
            }

            // formateo de labels del graficos
            chartMaterialCost.options.plugins.datalabels.formatter = function (
              value,
              context
            ) {
              return `valor: $ ${$.number(
                value,
                2,
                ",",
                "."
              )} \nporcenaje: ${$.number((value * 100) / totalMaterial, 2)} %`;
            };

            chartMaterialCost.data.datasets[0].data = valuesMaterials;
            chartMaterialCost.data.datasets[0].backgroundColor =
              colorsMaterials;
            chartMaterialCost.data.labels = namesMaterials;

            chartMaterialCost.update({ duration: 0 });

            // actualizacion de datos del grafico de gastos generales
            let valuesExpenses = [];
            let colorsExpenses = [];
            let names = [];
            if (data.expensesDescription == false) {
              valuesExpenses.push(data.totalExpenses);
              colorsExpenses.push(
                colors[Math.floor(Math.random() * (colors.length - 0)) + 0]
              );
              names.push("Gastos generales");
            } else {
              names = [
                "Gastos Operacionales de Administración",
                "Gastos Operacionales de Ventas",
                "Gastos No operacionales",
                "Costos indirectos de fabricación",
                "Contrato de servicios",
              ];
              for (let i = 0; i < names.length; i++) {
                colorsExpenses.push(
                  colors[Math.floor(Math.random() * (colors.length - 0)) + 0]
                );
              }
              valuesExpenses.push(data.expensesDescription["51"].value);
              valuesExpenses.push(data.expensesDescription["52"].value);
              valuesExpenses.push(data.expensesDescription["53"].value);
              valuesExpenses.push(data.expensesDescription["73"].value);
              valuesExpenses.push(data.expensesDescription["74"].value);
            }

            chartExpensesDescription.data.datasets[0].data = valuesExpenses;
            chartExpensesDescription.data.datasets[0].backgroundColor =
              colorsExpenses;
            chartExpensesDescription.data.labels = names;

            chartExpensesDescription.update({ duration: 0 });
          },
        });
        doc.text("Tiempo total de procesos", 100, 100);
        doc.text("Costos de Mano de Obra", 370, 100);
        doc.text("Gastos Generales", 100, 400);
        doc.text("Costos de materia Prima", 370, 400);
        doc.addImage(chartProcess.toBase64Image(), "PNG", 30, 120, 250, 200);
        doc.addImage(chartLaborCost.toBase64Image(), "PNG", 300, 120, 250, 200);
        doc.addImage(
          chartExpensesDescription.toBase64Image(),
          "PNG",
          30,
          420,
          250,
          200
        );
        doc.addImage(
          chartMaterialCost.toBase64Image(),
          "PNG",
          300,
          420,
          250,
          200
        );
        count++;
        // cargado de header y footer en el documento
        if (count >= productsReq.length) {
          $.ajax({
            async: false,
            type: "get",
            url: "/app/my-profile/api/get_company.php",
            success: function (data) {
              let logo = data.company.logo || "../upload/img/logo-empresa.png";
              logo = logo != "" ? logo : "../upload/img/logo-empresa.png";
              for (let page = 1; page <= doc.getNumberOfPages(); page++) {
                doc.setFontSize(10);
                doc.setPage(page);
                doc.text(
                  doc.internal.pageSize.getWidth() - 100,
                  doc.internal.pageSize.getHeight() - 20,
                  `Página ${page} de ${doc.getNumberOfPages()}`
                ); //print number bottom right
                doc.setTextColor(24, 79, 116);
                doc.setFontStyle("bold");
                doc.text(
                  data.company.tradename || data.company.bussinesReason,
                  90,
                  45
                );
                doc.setFontStyle("normal");
                doc.setTextColor(0);
              }
              toDataURL(logo, function (imgBase64) {
                if (imgBase64) {
                  doc.addImage(imgBase64, 30, 15, 50, 50);
                }
                doc.save();
              });
            },
          });
        }
      },
    });
  });
});

function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    var reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", url);
  xhr.responseType = "blob";
  try {
    xhr.send();
  } catch (error) {}
  callback();
}

function indexAlphabet(index) {
  let alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  if (index > alphabet.length) {
    let divison = Math.floor(index / 27);
    let word = alphabet[index - 27 * divison];
    let str = "";
    for (let i = 0; i < divison; i++) {
      str += word;
    }
    return str;
  } else {
    return alphabet[index];
  }
}
