import fs from "fs";
import csv from "csv-parser";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database.db");

fs.createReadStream("productos_otc.csv")
  .pipe(csv({ separator: ";" }))
  .on("data", (row) => {
    const { nombre, descripcion, precio, presentacion, imagen, categoria } = row;
    db.run(
      `INSERT INTO productos (nombre, descripcion, precio, presentacion, imagen, categoria)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, precio, presentacion, imagen, categoria]
    );
  })
  .on("end", () => console.log("Productos cargados desde CSV ✅"));
