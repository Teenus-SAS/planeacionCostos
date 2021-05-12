export function GetAllNominas(cb) {
  $.get("/app/config-general/api/get_rosters.php", (nominas) => {
    cb(nominas);
  });
}
