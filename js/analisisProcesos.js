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
            $("#form-data-process")[0].reset();
            $('#cargaTabla').empty()
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
                    '</thead><tbody id=cuerpo_tabla></tbody></table><div class="row mb-4"><div class="col"></div><div class="col"><button class="btn btn-primary" id="btnModificarDatos">Modificar</button><button class="btn btn-primary" id="btnAnalisisDatos">Analisis</button></div><div class="col"></div></div>')
                    $('#encabezado_tabla').empty()
                    $('#encabezado_tabla').append("<th>nombre</th><th>valor</th>")
                    //boton
                    $( "#btnAnalisisDatos" ).click(function() {
                        $('#modal').hide()
                        $('#cargaTabla').empty()
                        $('#title2').empty()
                        //$('#modal').modal({backdrop:'static', keyboard:false})
                        $('#title2').append('<p>Por favor digite estos datos</p><hr>')
                        $('#modal2').show()
                    })
                    $( "#btnModificarDatos" ).click(function() {
                        $("#input-procesosA").attr('disabled','disabled');
                        $('#title').empty()
                        $('#title').append('<p>Cargue los nuevos datos<br> digitelos</p><hr>')
                        $('#cargaTabla').hide()
                        $('#modal').show()
                        $('#tiempo_aislamiento').val(processJSON[0].tiempo_aislamiento)
                        $('#tiempo_operacion').val(processJSON[0].tiempo_operacion)
                        $('#numero_maquinas').val(processJSON[0].numero_maquinas)
                        $('#porcentaje_rechazo').val(processJSON[0].porcentaje_rechazo)
                        $('#numero_turnos').val(processJSON[0].numero_turnos)
                        $('#distancia').val(processJSON[0].distancia)
                        $('#disponibilidad').val(processJSON[0].disponibilidad)
                        $('#mantenimiento_correctivo').val(processJSON[0].mantenimiento_correctivo)
                        $('#paradas_menores').val(processJSON[0].paradas_menores)
                        
                    });
                    var i =-1;
                    datos[0]={nombre:"Tiempo de alistamiento",valor:processJSON[0].tiempo_aislamiento}
                    datos[1]={nombre:"Tiempo de operacion",valor:processJSON[0].tiempo_operacion}
                    datos[2]={nombre:"Numero de maquinas",valor:processJSON[0].numero_maquinas}
                    datos[3]={nombre:"Porcentaje de rechazo",valor:processJSON[0].porcentaje_rechazo}
                    datos[4]={nombre:"Numero de turnos",valor:processJSON[0].numero_turnos}
                    datos[5]={nombre:"Distancia",valor:processJSON[0].distancia}
                    datos[6]={nombre:"Disponibilidad",valor:processJSON[0].disponibilidad}
                    datos[7]={nombre:"Mantenimiento correctivo",valor:processJSON[0].mantenimiento_correctivo}
                    datos[8]={nombre:"Paradas menores",valor:processJSON[0].paradas_menores}
                    datos[8]={nombre:"Tiempo  total del ciclo",valor:(parseInt(processJSON[0].tiempo_aislamiento)+parseInt(processJSON[0].tiempo_operacion))}
                    console.log(datos)
                    /*for (var key in processJSON[0]){
                        i+=1
                        console.log(key)
                        datos[i]={nombre:key,valor:processJSON[0][key]}
                    }*/
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
                    $('#title').empty()
                    //$('#modal').modal({backdrop:'static', keyboard:false})
                    $('#title').append('<p>El producto no cuenta con datos para el analisis<br> digitelos</p><hr>')
                    $('#modal').show()
                }
           })

        })
    })
})
$('#form-data-process').submit(function (e) {
    $("#input-procesosA").removeAttr('disabled');
    $("#input-procesosA").show()
    $('#cargaTabla').empty()
    datos=[];
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
    setTimeout(2000);  
    $('#cargaTabla').append('<table class="table" id="tableAnalisisProcesos"><thead class=text-primary id="encabezado_tabla">'+
                    '</thead><tbody id=cuerpo_tabla></tbody></table><div class="row mb-4"><div class="col"></div><div class="col"><button class="btn btn-primary" id="btnModificarDatos">Modificar</button></div><div class="col"></div></div>')
                    $('#encabezado_tabla').empty()
                    $('#encabezado_tabla').append("<th>nombre</th><th>valor</th>")
    $('#cargaTabla').show()

    datos[0]={nombre:"Tiempo de alistamiento",valor:$('#tiempo_aislamiento').val()}
    datos[1]={nombre:"Tiempo de operacion",valor:$('#tiempo_operacion').val()}
    datos[2]={nombre:"Numero de maquinas",valor:$('#numero_maquinas').val()}
    datos[3]={nombre:"Porcentaje de rechazo",valor:$('#porcentaje_rechazo').val()}
    datos[4]={nombre:"Numero de turnos",valor:$('#numero_turnos').val()}
    datos[5]={nombre:"Distancia",valor:$('#distancia').val()}
    datos[6]={nombre:"Disponibilidad",valor:$('#disponibilidad').val()}
    datos[7]={nombre:"Mantenimiento correctivo",valor:$('#mantenimiento_correctivo').val()}
    datos[8]={nombre:"Paradas menores",valor:$('#paradas_menores').val()}
    datos[8]={nombre:"Tiempo  total del ciclo",valor:(parseInt($('#tiempo_aislamiento').val())+parseInt($('#tiempo_operacion').val()))}

    console.log(datos)
    $( "#btnModificarDatos" ).click(function() {
        $("#input-procesosA").attr('disabled','disabled');
        $('#title').empty()
        $('#title').append('<p>Cargue los nuevos datos<br> digitelos</p><hr>')
        $('#cargaTabla').hide()
        $('#modal').show()
        $('#tiempo_aislamiento').val(datos[0].valor)
        $('#tiempo_operacion').val(datos[1].valor)
        $('#numero_maquinas').val(datos[2].valor)
        $('#porcentaje_rechazo').val(datos[3].valor)
        $('#numero_turnos').val(datos[4].valor)
        $('#distancia').val(datos[5].valor)
        $('#disponibilidad').val(datos[6].valor)
        $('#mantenimiento_correctivo').val(datos[7].valor)
        $('#paradas_menores').val(datos[8].valor)
        
    });
    tabla=$('#tableAnalisisProcesos').DataTable({
        responsive: true,
        info: false,
        data: datos,
        columns: [
            { data:'nombre', "defaultContent": '<p >Sin registro </p>'},
            { data:'valor', "defaultContent": '<p >Sin registro </p>'}
        ]
    });
})
$( "#btnValidarDatos" ).click(function() {
    var datosAnalisis = []
    
    alert($('#input-procesosA').val())
    $.get('api/get_processes.php?dataTable=true&id='+$('#input-procesosA').val(), (_process, status, xhr) => {
        processJSON=_process.data
        datosAnalisis[0]={nombre:"distancia",valor:processJSON[0].distancia}
        datosAnalisis[1]={nombre:"veces al dia",valor:$('#veces_dia').val()}
        let dTotal=parseFloat(processJSON[0].distancia)*parseFloat($('#veces_dia').val())
        datosAnalisis[2]={nombre:"distancia total dia",valor:dTotal}
        datosAnalisis[3]={nombre:"tiempo de espera",valor:$('#tiempo_espera').val()}
        let tTiempodia=parseFloat($('#tiempo_espera').val())*dTotal
        datosAnalisis[4]={nombre:"Total tiempo de espera dia",valor:tTiempodia}
        let tTiempoMes=tTiempodia*(parseFloat($('#turnos_dia').val())*26)
        datosAnalisis[5]={nombre:"Total tiempo de espera mes",valor:tTiempoMes}
        datosAnalisis[6]={nombre:"Costo minuto operario",valor:$('#costo_minuto').val()}
        let cTiempoEspera=tTiempoMes*parseFloat($('#costo_minuto').val())
        datosAnalisis[7]={nombre:"Costo tiempo espera",valor:cTiempoEspera}
        console.log(datosAnalisis)
        $('#modal2').hide()
        $('#cargaTabla').empty()
        $('#cargaTabla').append('<h1>Analisis</h1> <div class ="row"><div class="col-md-5 col-sm-12 col-12 col-xs-12 mb-5"><table class="table" id="tableAnalisisProcesos"><thead class=text-primary id="encabezado_tabla">'+
        '</thead><tbody id=cuerpo_tabla></tbody></table></div><div class="col-md-7 col-sm-15 col-15 col-xs-15 " id="cargaxd">'+
        '<div class="form-group row my-2"><label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Veces al dia</label>'+
        '<div class="col-md-5 col-3 text-left px-0  mt-16"><input type="number" id="veces_dia2" class="form-control"></div>'+  
        '</div><div class="form-group row my-2"><label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Tiempo de espera</label>'+
        '<div class="col-md-5 col-3 text-left px-0 "><input type="number" id="tiempo_espera2" class="form-control"></div>'+ 
        '</div><div class="form-group row my-2"><label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Turnos al dia</label>'+
        '<div class="col-md-5 col-3 text-left px-0 "><input type="number" id="turnos_dia2" class="form-control"></div>'+ 
        '</div><div class="form-group row my-2"><label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Costo minuto operario</label>'+
        '<div class="col-md-5 col-3 text-left px-0 "><input type="number" id="costo_minuto2" class="form-control"></div>'+  
        '</div><div class="row mb-4"><div class="col"></div><div class="col"><button class="btn btn-primary" id="btnValidarDatos2">Validar</button>'+
        '</div><div class="col"></div></div></div></div> ')
        $('#encabezado_tabla').empty()
        $('#encabezado_tabla').append("<th>nombre</th><th>valor</th>")
        $('#cargaTabla').show()
        $( "#btnValidarDatos2" ).click(function() {
            datosAnalisis[0]={nombre:"distancia",valor:5}
            datosAnalisis[1]={nombre:"veces al dia",valor:$('#veces_dia2').val()}
            let dTotal=parseFloat(processJSON[0].distancia)*parseFloat($('#veces_dia2').val())
            datosAnalisis[2]={nombre:"distancia total dia",valor:dTotal}
            datosAnalisis[3]={nombre:"tiempo de espera",valor:$('#tiempo_espera2').val()}
            let tTiempodia=parseFloat($('#tiempo_espera2').val())*dTotal
            datosAnalisis[4]={nombre:"Total tiempo de espera dia",valor:tTiempodia}
            let tTiempoMes=tTiempodia*(parseFloat($('#turnos_dia2').val())*26)
            datosAnalisis[5]={nombre:"Total tiempo de espera mes",valor:tTiempoMes}
            datosAnalisis[6]={nombre:"Costo minuto operario",valor:$('#costo_minuto2').val()}
            let cTiempoEspera=tTiempoMes*parseFloat($('#costo_minuto2').val())
            datosAnalisis[7]={nombre:"Costo tiempo espera",valor:cTiempoEspera}
           $("#cargaxd").empty()
           $("#cargaxd").append('<table class="table" id="tableAnalisisProcesos2"><thead class=text-primary id="encabezado_tabla2">'+
           '</thead><tbody id=cuerpo_tabla></tbody></table>')
           $('#encabezado_tabla2').append("<th>nombre</th><th>valor</th>")
           var tabla2=$('#tableAnalisisProcesos2').DataTable({
            responsive: true,
            info: false,
            data: datosAnalisis,
            columns: [
                { data:'nombre', "defaultContent": '<p >Sin registro </p>'},
                { data:'valor', "defaultContent": '<p >Sin registro </p>'}
            ]
        });

        })
        tabla=$('#tableAnalisisProcesos').DataTable({
            responsive: true,
            info: false,
            data: datosAnalisis,
            columns: [
                { data:'nombre', "defaultContent": '<p >Sin registro </p>'},
                { data:'valor', "defaultContent": '<p >Sin registro </p>'}
            ]
        });
       
        $tabla.width('80%')
        
        
    })
})
