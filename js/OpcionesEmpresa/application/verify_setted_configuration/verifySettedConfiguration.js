function verifySettedConfiguration(tabIdentifier) {
  $(`#${tabIdentifier}`).click(() => {
    $.get("/app/my-profile/api/get_company.php", (data, status) => {
      data = data.company;
      if (
        !parseFloat(data.workHours) ||
        !parseFloat(data.bussinesDaysMonth) ||
        !parseFloat(data.profitabilityMargin)
      ) {
        $("#configNecesaria").val("true");
        $("#tabGenerales").trigger("click");
      }
    });
  });
}
