import express from "express";
import path from "path";
import fs from "fs/promises";
/* const __dirname = import.meta.dirname */
const __dirname = path.resolve();
const router = express.Router();

router.get("/", (req, res) => {
  /* res.sendFile(path.join(__dirname, '../views/index.html')) */
  res.sendFile(__dirname + "/views/index.html");
});

router.get("/crear", (req, res) => {
  try {
    const date = new Date();
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const anio = date.getFullYear();
    const { file, content } = req.query;
    fs.writeFile(
      `uploads/${file}`,
      `${dia < 10 ? "0" + dia : dia}/${
        mes < 10 ? "0" + mes : mes
      }/${anio} - ${content}`
    );
    res.status(200).send("Archivo creado");
  } catch (error) {
    res.status(500).send("Error al crear el archivo");
  }
});

router.get("/leer", async (req, res) => {
  const { archivo } = req.query;

  try {
    const data = await fs.readFile(`uploads/${archivo}`, "utf-8");
    res.status(200).sendFile(data);
  } catch (error) {
    res.status(500).send("El archivo que intentas leer no existe");
  }
});

router.get("/renombrar", async(req, res) => {
    const { nombre, nuevoNombre } = req.query;
    try {
        await fs.rename(`uploads/${nombre}`, `uploads/${nuevoNombre}`);
        res.send(
          `Archivo ${nombre} fue renombrado con exito por ${nuevoNombre} `
        );
    } catch (error) {
        res.status(500).send("El archivo que consultas no existe");
    }
})

router.get("/eliminar", async(req, res) => {
    const { archivo } = req.query;
    try {
        await fs.unlink(`uploads/${archivo}`);
        res.send(`Archivo ${archivo} fue eliminado con exito`);
    } catch (error) {
        res.status(500).send("El archivo que intentas eliminar no existe");
    }
})

export default router;