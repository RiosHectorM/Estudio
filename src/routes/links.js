const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/calendario", isLoggedIn, async (req, res) => {
  const listadeeventos = await pool.query("SELECT * FROM eventos");
  res.render("links/calendario.hbs", { dataeventos: JSON.stringify(listadeeventos)});
});

router.get("/perfil/:id_cliente_evt", isLoggedIn, async (req, res) => {
  const { id_cliente_evt } = req.params;
  const clienteSelected = await pool.query("SELECT * FROM cliente WHERE id_cliente = ?", [id_cliente_evt]);
  const eventocli = await pool.query("SELECT * FROM eventos WHERE id_cliente_evt = ?", [id_cliente_evt]);
  console.log(eventocli)
  console.log(clienteSelected)
  res.render("links/perfil.hbs", { clienteSel: JSON.stringify(clienteSelected), eventocli, dataeventos: JSON.stringify(eventocli) });
});

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

router.post("/addevento/:id_cliente", isLoggedIn, async (req, res) => {
  const { id_cliente } = req.params;
  const {
    id_cliente_evt = id_cliente,
    nombre_cliente_evt,
    dni_evt,
    importante,  
    favorito,
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
  } = req.body;

  const newClienteEstado = {
    tipo,
    estado,
    importante,  
    favorito,
    finalizado,
    baja,
  };

  const newEvento = {
    id_cliente_evt,
    nombre_cliente_evt,
    dni_evt,
    importante,  
    favorito,
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
  };
  await pool.query("INSERT INTO eventos set ?", [newEvento]);
  console.log("nuevo estado", newClienteEstado)
  console.log(id_cliente);
  await pool.query("UPDATE cliente set ? WHERE id_cliente = ?", [newClienteEstado, id_cliente]);
  res.redirect("/links/calendario");
});

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

router.get("/evento/:id_cliente", isLoggedIn, async (req, res) => {
  const { id_cliente } = req.params;
  const evento_cliente = await pool.query("SELECT * FROM cliente WHERE id_cliente = ?", [id_cliente]);
  res.render("links/evento.hbs", { eventocli: evento_cliente[0] });
});

router.post("/add", isLoggedIn, async (req, res) => {
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
    art, 
    prestador,  
    historia_clinica, 
    estudios_medicos, 
    lugar_estudios, 
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
    art, 
    prestador,  
    historia_clinica, 
    estudios_medicos, 
    lugar_estudios, 
  };
  await pool.query("INSERT INTO cliente set ?", [newClient]);
  req.flash("success", "Cliente Grabado correctamente");
  res.redirect("/links");
});

router.get("/", isLoggedIn, async (req, res) => {
  const links = await pool.query("SELECT * FROM cliente");
  res.render("links/list.hbs", { links, dataCliArray: JSON.stringify(links)});
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const links = await pool.query("SELECT * FROM cliente WHERE id_cliente = ?", [id]);
  res.render("links/edit.hbs", { link: links[0] });
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { damnificado, domicilio, telefono } = req.body;
  const newLink = {
    damnificado,
    domicilio,
    telefono,
  };
  await pool.query("UPDATE links set ? WHERE id = ?", [newLink, id]);
  req.flash("success", "Link Editado correctamente");
  res.redirect("/links");
});

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

module.exports = router;

