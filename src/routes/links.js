const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/calendario", isLoggedIn, async (req, res) => {
  const listadeeventos = await pool.query("SELECT * FROM eventos");
  res.render("links/calendario.hbs", { dataeventos: JSON.stringify(listadeeventos)});
});

//MODULO DE PERFIL

router.get("/perfil/:id_cliente_evt", isLoggedIn, async (req, res) => {
  const { id_cliente_evt } = req.params;
  const clienteSelected = await pool.query("SELECT * FROM cliente WHERE id_cliente = ?", [id_cliente_evt]);
  const eventocli = await pool.query("SELECT * FROM eventos WHERE id_cliente_evt = ?", [id_cliente_evt]);
  console.log(eventocli)
  res.render("links/perfil.hbs", { clienteSel: JSON.stringify(clienteSelected), eventocli, dataeventos: JSON.stringify(eventocli) });
});

//MODULOS RUTAS EVENTOS

router.post("/addevento/:id_cliente", isLoggedIn, async (req, res) => {
  const { id_cliente } = req.params;
  const {
    id_cliente_evt = id_cliente,
    nombre_cliente_evt,
    dni_evt,
    fecha_evt,
    fecha_prox_contacto,
    importante,  
    regHonorarios,
    finalizado,
    baja,
    fecha_prox_legal,
    diag_leg,
    fecha_prox_med,
    diag_med,
    fecha_prox_psico,    
    diag_psico,
    tipo,
    estado,
    valor_inc_prop,
    valor_inc_art,
    telefono,
    conInc,
    conIncFechaVD,
    conIncFechaPend,
    sinInc,
    sinIncDDI,
    sinIncDDIJud,
    sinIncDDICerrar,
    sinIncDA,
    detInc,
    detIncDDI,
    detIncDDIJud,
    detIncDDICerrar,
    jud,
    judAbr,
    detalles,
    judOrd,
    trat,
    acord,
    cerrarSrt,
    fechaVD,
    fecha_accidente,
    fecha_pmi,
    notas,
    fechaTeams
        
  } = req.body;

  const newClienteEstado = {
    tipo,
    estado,
    importante,  
    regHonorarios,
    finalizado,
    baja,
    conInc,
    conIncFechaVD,
    conIncFechaPend,
    sinInc,
    sinIncDDI,
    sinIncDDIJud,
    sinIncDDICerrar,
    sinIncDA,
    detInc,
    detIncDDI,
    detIncDDIJud,
    detIncDDICerrar,
    jud,
    judAbr,
    judOrd,
    trat,
    acord,
    cerrarSrt,
  };

  const newEvento = {
    id_cliente_evt,
    nombre_cliente_evt,
    dni_evt,
    importante,  
    regHonorarios,
    finalizado,
    baja,
    fecha_prox_legal,
    diag_leg,
    fecha_prox_med,
    diag_med,
    fecha_prox_psico,
    diag_psico,
    notas,
    fecha_prox_contacto,
    tipo,
    estado,
    fecha_evt,
    valor_inc_prop,
    valor_inc_art,
    telefono,
    conInc,
    conIncFechaVD,
    conIncFechaPend,
    sinInc,
    sinIncDDI,
    sinIncDDIJud,
    sinIncDDICerrar,
    sinIncDA,
    detInc,
    detIncDDI,
    detIncDDIJud,
    detIncDDICerrar,
    jud,
    judAbr,
    detalles,
    judOrd,
    trat,
    acord,
    cerrarSrt,
    fechaVD,
    fecha_accidente,
    fecha_pmi,
    notas,
    fechaTeams,
  };
  console.log("elemento  ",newEvento )
  console.log("cliente  ",newClienteEstado )
 
  await pool.query("INSERT INTO eventos set ?", [newEvento]);
  await pool.query("UPDATE cliente set ? WHERE id_cliente = ?", [newClienteEstado, id_cliente]);
  res.redirect("/links/calendario");
});

router.get("/evento/:id_cliente", isLoggedIn, async (req, res) => {
  const { id_cliente } = req.params;
  const evento_cliente = await pool.query("SELECT * FROM eventos WHERE id_cliente_evt = ?", [id_cliente]);
  const indice = evento_cliente.length
  console.log(evento_cliente[indice-1])
  res.render("links/evento.hbs", { eventocli: evento_cliente[indice-1] });
});

//MODULOS RUTAS CLIENTES

router.get("/add", isLoggedIn,  function(req, res) {
  if(req.user) {
    pool.query("SELECT * FROM art",function (err,results) {
    if (err) throw err;
    res.render("links/add.hbs", {data: JSON.stringify(results)});
});
} else {
  res.redirect('../../login');
}
});

router.post("/add", isLoggedIn, async (req, res) => {

try {
  const {
    fecha_ingreso,
    damnificado,
    domicilio,  
    dni_cuil,  
    edad, 
    telefono, 
    empresa, 
    domicilio_empresa, 
    cuit_empresa,  
    rubro_empresa, 
    tareas_empresa,
    turno_empresa, 
    horario_inicio,
    horario_fin, 
    nombre_art, 
    prestador,  
    historia_clinica, 
    estudios_medicos, 
    lugar_estudios, 
    importante,
    regHonorarios,
    finalizado,
    baja,
    tipo,
    estado,
    conInc,
    conIncFechaVD,
    conIncFechaPend,
    sinInc,
    sinIncDDI,
    sinIncDDIJud,
    sinIncDDICerrar,
    sinIncDA,
    detInc,
    detIncDDI,
    detIncDDIJud,
    detIncDDICerrar,
    jud,
    judAbr,
    detalles,
    judOrd,
    trat,
    acord,
    cerrarSrt,
    fechaVD,
    fecha_accidente,
    fecha_pmi,
    notas,
    fecha_prox_contacto,
    fechaTeams,
  } = req.body;

  const newClient = {
    fecha_ingreso,
    damnificado,
    domicilio,  
    dni_cuil,  
    edad, 
    telefono, 
    empresa, 
    domicilio_empresa, 
    cuit_empresa,  
    rubro_empresa, 
    tareas_empresa,
    turno_empresa, 
    horario_inicio,
    horario_fin, 
    art: nombre_art,
    prestador,  
    historia_clinica, 
    estudios_medicos, 
    lugar_estudios, 
    estado,
    conInc,
    conIncFechaVD,
    conIncFechaPend,
    sinInc,
    sinIncDDI,
    sinIncDDIJud,
    sinIncDDICerrar,
    sinIncDA,
    detInc,
    detIncDDI,
    detIncDDIJud,
    detIncDDICerrar,
    jud,
    judAbr,
    judOrd,
    trat,
    acord,
    cerrarSrt
  };

  await pool.query("INSERT INTO cliente set ?", [newClient]);

  const ultID = await pool.query("SELECT * FROM cliente");
  const indice = ultID.length
  const id = ultID[indice-1].id_cliente

  const eventoInit = {
    id_cliente_evt: id,
    fechaVD,
    detalles,
    fecha_evt: fecha_ingreso,
    nombre_cliente_evt: damnificado,
    dni_evt: dni_cuil,
    importante,  
    regHonorarios,
    finalizado,
    baja,
    tipo,
    estado,
    conInc,
    conIncFechaVD,
    conIncFechaPend,
    sinInc,
    sinIncDDI,
    sinIncDDIJud,
    sinIncDDICerrar,
    sinIncDA,
    detInc,
    detIncDDI,
    detIncDDIJud,
    detIncDDICerrar,
    jud,
    judAbr,
    detalles,
    judOrd,
    trat,
    acord,
    cerrarSrt,
    fecha_accidente,
    fecha_pmi,
    notas,
    fecha_prox_contacto,
    fechaTeams
  }

  await pool.query("INSERT INTO eventos set ?", [eventoInit]);
  console.log(eventoInit)
  res.redirect("/links");
} catch (error) {
  console.log(error)
  res.redirect("/links");
}
  
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const links = await pool.query("SELECT * FROM cliente WHERE id_cliente = ?", [id]);
  const artresult = await pool.query("SELECT * FROM art")
  console.log(links[0])
  res.render("links/edit.hbs", { link: links[0], data: JSON.stringify(artresult) });
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { 
    fecha_ingreso,
    damnificado,
    domicilio,  
    dni_cuil,  
    edad, 
    telefono, 
    empresa, 
    domicilio_empresa, 
    cuit_empresa,  
    rubro_empresa, 
    tareas_empresa,
    turno_empresa, 
    horario_inicio,
    horario_fin, 
    nombre_art, 
    prestador,  
    historia_clinica, 
    estudios_medicos, 
    lugar_estudios 
  } = req.body;
  const newLink = {
    fecha_ingreso,
    damnificado,
    domicilio,  
    dni_cuil,  
    edad, 
    telefono, 
    empresa, 
    domicilio_empresa, 
    cuit_empresa,  
    rubro_empresa, 
    tareas_empresa,
    turno_empresa, 
    horario_inicio,
    horario_fin, 
    art: nombre_art, 
    prestador,  
    historia_clinica, 
    estudios_medicos, 
    lugar_estudios 
  };
  await pool.query("UPDATE cliente SET ? WHERE id_cliente = ?", [newLink, id]);
  res.redirect("/links");
});

//MODULOS DE RUTAS ART

router.get("/addart", isLoggedIn, (req, res) => {
  res.render("links/addart.hbs");
});

router.post("/addart", isLoggedIn, async (req, res) => {
  const {
    nombre_art,
    domicilio_art,
    telefono_art,  
    mail_art,
  } = req.body;

  const newART = {
    nombre_art,
    domicilio_art,
    telefono_art,  
    mail_art, 
  };

  await pool.query("INSERT INTO art set ?", [newART]);
  req.flash("success", "ART Grabada correctamente");
  res.redirect("/links/art");
});

router.get("/art", isLoggedIn, async (req, res) => {
  const links_art = await pool.query("SELECT * FROM art");
  res.render("links/listart.hbs", { links_art });
});

router.get("/deleteart/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM art WHERE id_art = ?", [id]);
  res.redirect("/links/art");
});

router.get("/editart/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const artDat = await pool.query("SELECT * FROM art WHERE id_art = ?", [id]);
  res.render("links/editart.hbs", { artDatos: artDat[0] });
});

router.post("/editart/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { nombre_art, domicilio_art, telefono_art, mail_art } = req.body;
  const artAct = {
    nombre_art,
    domicilio_art,
    telefono_art,
    mail_art,
  };
  await pool.query("UPDATE art set ? WHERE id_art = ?", [artAct, id]);
  res.redirect("/links/art");
});

// MODULO CHECK
router.get("/check/:id", isLoggedIn, async (req, res) => {
  console.log("entro");
  const { id } = 2;
  const { check } = true;
  const newCheck = {
    check,
  };
  await pool.query("UPDATE eventos set ? WHERE id_cliente_evt = ?", [newCheck, id]);
  req.flash("success", "Link Editado correctamente");
});

// RUTA INICIAL
router.get("/", isLoggedIn, async (req, res) => {
  const links = await pool.query("SELECT * FROM cliente");
  res.render("links/list.hbs", { links, dataCliArray: JSON.stringify(links)});
});

module.exports = router;