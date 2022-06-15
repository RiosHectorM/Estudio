const express = require("express");
const router = express.Router();

const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/add", isLoggedIn, (req, res) => {
  res.render("links/add.hbs");
});

router.post("/add", isLoggedIn, async (req, res) => {
  // const { title, url, description } = req.body;
  // const newLink = {
  //   title,
  //   url,
  //   description,
  //   user_id: req.user.id,
  // };

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
    pedir_historia_clinica,
    pedir_estudios_medicos,
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
    pedir_historia_clinica,
    pedir_estudios_medicos,
    id_cliente: req.user.id,
  };

  await pool.query("INSERT INTO cliente set ?", [newClient]);
  req.flash("success", "Cliente Grabado correctamente");
  res.redirect("/links");

  // parametros art..........
  // domicilio_art,
  //     mail_art,
  //     telefono_art,
});
//  esto va a continuacion d ecliente ... WHERE id_cliente = ?", [
//     req.user.id,
//   ]
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
