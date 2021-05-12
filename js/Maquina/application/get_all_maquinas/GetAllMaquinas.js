export function GetAllMaquinas(cb) {
  $.get("/app/config-general/api/get_machines.php", (maquinas) => {
    cb(maquinas);
  });
}
