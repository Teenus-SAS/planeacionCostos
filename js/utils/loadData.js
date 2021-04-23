export function loadDatafromEndpoint(endpoint, datacb = null, errorcb = null) {
  $.get(endpoint, (data, status) => {
    if (status == "success") {
      return datacb ? datacb(data) : data;
    } else {
      return errorcb ? errorcb() : [];
    }
  });
}
