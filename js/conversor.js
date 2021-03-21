let unitLongitude = [
  {
    name: "kilometros",
    code: "km",
  },
  {
    name: "Metros",
    code: "m",
  },
  {
    name: "Centímetros",
    code: "cm",
  },
  {
    name: "Milimetro",
    code: "mm",
  },
  {
    name: "Milla",
    code: "mi",
  },
  {
    name: "Yarda",
    code: "yd",
  },
  {
    name: "Pie",
    code: "ft",
  },
  {
    name: "Pulgada",
    code: "in",
  },
];

let unitMass = [
  {
    name: "Toneladas",
    code: "tonne",
  },
  {
    name: "Kilogramos",
    code: "kg",
  },
  {
    name: "Gramos",
    code: "g",
  },
  {
    name: "Miligramos",
    code: "mg",
  },
  {
    name: "Libras",
    code: "lb",
  },
  {
    name: "onzas",
    code: "oz",
  },
];

let unitVolume = [
  {
    name: "Galones",
    code: "gal",
  },
  {
    name: "Cuartos",
    code: "qt",
  },
  {
    name: "Pintas",
    code: "pt",
  },
  {
    name: "Cuartos",
    code: "qt",
  },
  {
    name: "Cucharadas",
    code: "tablespoon",
  },
  {
    name: "Cucharaditas",
    code: "teaspoon",
  },
  {
    name: "Copas",
    code: "cp",
  },
  {
    name: "Metros Cubicos",
    code: "m3",
  },
  {
    name: "Litros",
    code: "l",
  },
  {
    name: "Mililitro",
    code: "ml",
  },
];

fillFileds(unitLongitude);

$("#select-type-conversor").change(function () {
  $(".input-unit").val("1");
  switch ($(this).val()) {
    case "longuitud":
      fillFileds(unitLongitude);
      break;
    case "masa":
      fillFileds(unitMass);
      break;
    case "volumen":
      fillFileds(unitVolume);
      break;
  }
});

function fillFileds(units) {
  $(".units").html("");
  units.forEach((unit) => {
    $(".units").append(`<option value="${unit.code}">${unit.name}</option>`);
  });
}

// evento de cambio para calcular
$(".input-unit").keyup(function () {
  let id = $(this).attr("id").substring(5, $(this).attr("id").length);
  calculateConversion(id);
});
$(".input-unit").change(function () {
  let id = $(this).attr("id").substring(5, $(this).attr("id").length);
  calculateConversion(id);
});
$(".units").change(function () {
  let id = $(this).attr("id").substring(12, $(this).attr("id").length);
  calculateConversion(id);
});

function calculateConversion(id) {
  let unit = $(`#select-unit-${id}`).val();
  let idConversor = id == 1 ? 2 : 1;
  let unitConversor = $(`#select-unit-${idConversor}`).val();
  let value = math.unit(`${$(`#unit-${id}`).val()} ${unit}`);
  $(`#unit-${idConversor}`).val(value.toNumber(unitConversor));
}
