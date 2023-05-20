import express, { json } from "express";
import "./archivo.json" assert { type: "json" };
import { ProductManager } from "./entrega-desafio-manejo-de-archivos.js";

const manager = new ProductManager("./archivo.json");

const app = express();

app.listen(8080, () => {
  console.log("en ejecucion");
});

app.get("/products", (request, response) => {
  const limit = Number(request.query.limit);

  const array = async () => {
    const readFile = await manager.readJSON();

    if (!limit) {
      response.send(readFile);
      return;
    }

    const limitFilter = readFile.slice(0, limit);

    response.send(limitFilter);
  };
  array();
});

app.get("/products/:pid", (request, response) => {
  const id = Number(request.params.pid);

  const productId = async () => {
    response.send(await manager.getProductById(id));
  };
  productId();
});
