const express = require("express");
const router = express.Router();

const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

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

// router.get("/add", isLoggedIn, (req, res) => {
//   res.render("links/add.hbs");
// });

router.get("/add", isLoggedIn, (req, res) => {
  pool.query("SELECT * FROM art", function (err, art_tabla) {
    if (err) throw err;
      console.log(art_tabla);
      // res.send(art_tabla);
      res.render("links/add.hbs");
  });
});

function myFunction(val) {
  console.log("The input value has changed. The new value is: " + val);
}

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

