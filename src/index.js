const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const MySqlStore = require("express-mysql-session");
const passport = require("passport");

const { database } = require("./keys");

//Inicializador
const app = express();
require("./lib/passport");

//configuraciones

app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars"),
  })
);
app.set("views engine", ".hbs");

//Midlewares
app.use(
  session({
    secret: "estudio",
    resave: false,
    saveUninitialized: false,
    store: new MySqlStore(database),
  })
);
app.use(flash());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Globales
app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.message = req.flash("message");
  app.locals.user = req.user;
  next();
});

//Rutas
app.use(require("./routes"));
app.use(require("./routes/authentication"));
app.use("/links", require("./routes/links"));

//Publicos
app.use(express.static(path.join(__dirname, "public")));

//Start Server
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
