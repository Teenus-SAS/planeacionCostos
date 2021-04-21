const verifyErrorConfigNecesaria = () => {
  if ($("#configNecesaria").val() == "true") {
    setTimeout(
      () =>
        bootbox.dialog({
          title: "Debes configurar los valores de la empresa para continuar",
          message: "Configura los valores para continuar",
        }),
      500
    );
    $("#configNecesaria").val("false");
  }
};

$("#tabGenerales").click(() => {
  verifyErrorConfigNecesaria();
  $("#Generales").addClass("hide");
  setTimeout(() => {
    $("#Generales").removeClass("hide");
    $("#Generales").addClass("show");
  }, 1000);
});

$.get("/app/my-profile/api/get_company.php", (data, status) => {
  data = data.company;
  $("#my-input-sc").val(data.salesCommission);
  $("#my-input-mr").val(data.profitabilityMargin);
  $("#my-input-dl").val(data.bussinesDaysMonth);
  $("#my-input-wh").val(data.workHours);
});

$.validator.addMethod(
  "decimalInput",
  function (value) {
    return /^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/.test(value);
  },
  "Máximo dos decimales"
);

$("#form-factor-prestacional")
  .submit(function (e) {
    e.preventDefault();
  })
  .validate({
    rules: {
      SalesCommission: {
        required: true,
      },
      workHours: {
        required: true,
        max: 18,
        min: 1,
      },
      BussinesDayMonth: {
        required: true,
        max: 31,
        max: 1,
      },
      ProfitabilityMargin: {
        required: true,
      },
    },
    messages: {
      SalesCommission: {
        required: "Campo requerido",
      },
      workHours: {
        required: "Campo requerido",
        max: "Valor máximo permitido: <b>18</b> horas de trabajo",
        min: "Valor mínimo permitido: <b>1</b> hora de trabajo",
      },
      BussinesDayMonth: {
        required: "Campo requerido",
        max: "Valor máximo permitido: <b>31</b> días laborales",
        min: "Valor mínimo permitido: <b>1</b> día laborales",
      },
      ProfitabilityMargin: {
        required: "campo requerido",
      },
    },
    errorPlacement: function (error, element) {
      error.insertAfter(element.closest("div.form-group"));
    },
    submitHandler: function (form) {
      $.post("api/update_factor_prestacional.php", $(form).serialize()).always(
        function (xhr) {
          switch (xhr.status) {
            case 200:
              $.notify(
                {
                  icon: "nc-icon nc-bell-55",
                  message: `Informacion <b>Actualizada</b>`,
                },
                {
                  type: "primary",
                  timer: 8000,
                }
              );
              break;
            case 400:
              $.notify(
                {
                  icon: "nc-icon nc-bell-55",
                  message: `Por favor <b>Completa</b> todos los campos`,
                },
                {
                  type: "warning",
                  timer: 8000,
                }
              );
              break;
            case 500:
              $.notify(
                {
                  icon: "nc-icon nc-bell-55",
                  message: `Ha ocurrido un <b>error</b> al momento de actulizar los datos`,
                },
                {
                  type: "danger",
                  timer: 8000,
                }
              );
              break;
          }
        }
      );
    },
    errorClass: "is-invalid",
  });
