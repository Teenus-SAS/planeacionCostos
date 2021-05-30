import { fetchData } from "../../../utils/fetchData.js";

export async function CreateReporteProductoProcesos(
  consecutivo,
  cliente,
  ciudad,
  productos,
  cantidad,
  pdfData,
  errorscb = () => {}
) {
  const { data, status } = await fetchData(
    "/app/reportes/api/add_reporte_costeo_procesos.php",
    {
      method: "POST",
      body: {
        consecutivo,
        cliente,
        ciudad,
        productos: JSON.stringify(productos),
        cantidad,
        pdfdata: JSON.stringify(pdfData),
      },
    }
  );

  if (status == 200) {
    return { error: null };
  } else if (status == 411) {
    return { error: `Reporte con consecutivo ${consecutivo} ya existe` };
  }
}
