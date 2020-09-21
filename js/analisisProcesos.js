var datos=[];
$(document).ready(function(){
    $('#input-procesosA').append(`<option >Seleccione un proceso</option>`)
    $.get('/app/config-general/api/get_processes.php', (_processes, status, xhr) => {   
        $('#selectProcess').append(`<option selected disabled>Selecciona un proceso</option>`)
        processesJSON = _processes
        console.log(processesJSON)
        _processes.forEach((process) => {
        $('#input-procesosA').append(`<option value="${process.id}">${process.name}</option>`)
        })
        $('#input-procesosA').change(function () {
            datos=[]
            let processesSelected = _processes.filter(process => process.id == $(this).val())[0]
            $('#encabezado_tabla').empty()
            $('#encabezado_tabla').append("<th>nombre</th><th>valor</th>")
            console.log(processesSelected.id)
            $.get('api/get_processes.php?dataTable=true&id='+processesSelected.id, (_process, status, xhr) => {
                processJSON=_process.data
                console.log(processJSON)
                if(processJSON!=null){
                    $('#modal').hide()
                    $('#cargaTabla').append('<table class="table" id="tableAnalisisProcesos"><thead class=text-primary id="encabezado_tabla">'+
                    '</thead><tbody id=cuerpo_tabla></tbody></table>')
                    $('#encabezado_tabla').empty()
                    $('#encabezado_tabla').append("<th>nombre</th><th>valor</th>")
                    var i =-1;
                    for (var key in processJSON[0]){
                        i+=1
                        console.log(key)
                        datos[i]={nombre:key,valor:processJSON[0][key]}
                    }
                    tabla=$('#tableAnalisisProcesos').DataTable({
                        responsive: true,
                        info: false,
                        data: datos,
                        columns: [
                            { data:'nombre', "defaultContent": '<p >Sin registro </p>'},
                            { data:'valor', "defaultContent": '<p >Sin registro </p>'}
                        ]
                    });
                }
                //$('#cuerpo_tabla').append("<tr><td>"+key+"</td><td>"+processJSON[key]+"</td></tr>")
                else{
                    $('#cargaTabla').empty()
                    //$('#modal').modal({backdrop:'static', keyboard:false})
                    $('#modal').show()
                    //$('#estorbo').hide()
                    if($('#myModal').is(':visible')){
                        console.log(aaa)
                    }
                }
           })

        })
    })

     
})
$('#form-data-process').submit(function (e) {
    e.preventDefault()
    console.log("xd")
    let serealize=$(this).serialize();
    let data=serealize+`&id_proceso=${$('#input-procesosA').val()}&tiempo_aislamiento=${$('#tiempo_aislamiento').val()}&tiempo_operacion=${$('#tiempo_operacion').val()}`+
    `&numero_maquinas=${$('#numero_maquinas').val()}&porcentaje_rechazo=${$('#porcentaje_rechazo').val()}&numero_turnos=${$('#numero_turnos').val()}`+
    `&distancia=${$('#distancia').val()}&disponibilidad=${$('#disponibilidad').val()}&mantenimiento_correctivo=${$('#mantenimiento_correctivo').val()}`+
    `&paradas_menores=${$('#paradas_menores').val()}`

    $.post('api/add_data_processes.php?',data,(_data, _status, xhr) => {
    })
    $('#modal').hide()
    $('#cargaTabla').append('<table class="table" id="tableAnalisisProcesos"><thead class=text-primary id="encabezado_tabla">'+
                    '</thead><tbody id=cuerpo_tabla></tbody></table>')
                    $('#encabezado_tabla').empty()
                    $('#encabezado_tabla').append("<th>nombre</th><th>valor</th>")
    $.get('api/get_processes.php?dataTable=true&id='+$('#input-procesosA').val(), (_process, status, xhr) => {
        processJSON=_process.data
       console.log(processJSON)
    })
    
})
