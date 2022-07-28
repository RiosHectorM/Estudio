const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/calendario", isLoggedIn, async (req, res) => {
  const listadeclientes = await pool.query("SELECT * FROM cliente");
  const listadeeventos = await pool.query("SELECT * FROM eventos");
  res.render("links/calendario.hbs", { listadeclientes, listadeeventos,  dataclientes: JSON.stringify(listadeclientes), dataeventos: JSON.stringify(listadeeventos)});
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
  res.redirect("/linksart");
});

router.post("/addevento", isLoggedIn, async (req, res) => {
  const {
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

  const newEvento = {
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
  req.flash("success", "Evento Grabado correctamente");
  res.redirect("/linkseventos");
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

router.get("/art", isLoggedIn, async (req, res) => {
  const links_art = await pool.query("SELECT * FROM art");
  res.render("links/listart.hbs", { links_art });
});

router.get("/evento", isLoggedIn, async (req, res) => {
  const evento_clientes = await pool.query("SELECT * FROM cliente");
  res.render("links/evento.hbs", { evento_clientes });
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
  res.render("links/list.hbs", { links });
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM cliente WHERE id_cliente = ?", [id]);
  req.flash("success", "Cliente Eliminado correctamente");
  res.redirect("/links/");
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const links = await pool.query("SELECT * FROM cliente WHERE id = ?", [id]);
  res.render("links/edit.hbs", { link: links[0] });
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;
  const newLink = {
    title,
    description,
    url,
  };
  await pool.query("UPDATE links set ? WHERE id = ?", [newLink, id]);
  req.flash("success", "Link Editado correctamente");
  res.redirect("/links");
});

module.exports = router;

