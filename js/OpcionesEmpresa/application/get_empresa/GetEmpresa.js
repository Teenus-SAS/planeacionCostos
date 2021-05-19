export function GetEmpresa(cb) {
  $.get("/app/my-profile/api/get_company.php", (empresa) => {
    cb(empresa.company);
  });
}
