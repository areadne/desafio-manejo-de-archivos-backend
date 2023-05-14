import fs, { read } from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.format = "utf-8";
    this.array = [];
  }

  validateData = (argumentToValidate, stringToShow) => {
    if (argumentToValidate) {
      console.log(stringToShow);
      return;
    }
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    let id;

    const validateCode = this.array.find((el) => el.code === code);

    this.validateData(
      !title || !description || !price || !thumbnail || !stock || !code,
      "campos incompletos"
    );

    this.validateData(validateCode, "el code ya existe");

    id = this.array.length === 0 ? 1 : this.array[this.array.length - 1].id + 1;

    this.array.push({ id, title, description, price, thumbnail, code, stock });

    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.array, null, "\t")
      );
    } catch (error) {
      console.error("ha ocurrido un error con el archivo", error);
    }
  };


  getProduct = async () => {
    this.validateData(!fs.existsSync(this.path), "file not found");

    try {
      let readFile = JSON.parse(
        await fs.promises.readFile(this.path, this.format)
      );
      console.log(readFile);
    } catch (error) {
      console.error(error);
    }
  };

  getProductById = async (id) => {
    this.validateData(!fs.existsSync(this.path), "file not found");

    let readFile = JSON.parse(
      await fs.promises.readFile(this.path, this.format)
    );

    const search = readFile.find((el) => el.id === id);
    search ? console.log(search) : console.log("Not found");
  };

  updateProduct = async ( id, title, description, price, thumbnail, code, stock ) => {
    this.validateData(!fs.existsSync(this.path), "file not found");

    let readdFileToUpdate = await fs.promises.readFile(this.path, this.format);
    readdFileToUpdate = JSON.parse(readdFileToUpdate);

    const itemFounded = readdFileToUpdate.filter((item) => item.id === id);

    this.validateData(!itemFounded, "id not found");

    const nuevoItem = {
      id: id,
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    };

    const otherItemInArray = readdFileToUpdate.filter((item) => item.id != id);

    let newArray;

    if (otherItemInArray.length === 0) {
      newArray = [nuevoItem];

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(newArray, null, "\t")
      );

      this.getProduct();
    } else {
      newArray = [...otherItemInArray, nuevoItem];

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(newArray, null, "\t")
      );
      this.getProduct();
    }
  };

  deleteProduct = async (id) => {
    this.validateData(!fs.existsSync(this.path), "file not found");

    const readdFile = JSON.parse(
      await fs.promises.readFile(this.path, this.format)
    );

    const deleteItem = readdFile.find((item) => item.id === id);

    this.validateData(!deleteItem, "Not found");

    let newArray = readdFile.filter((item) => item.id != id);

    this.array.push(newArray);

    return await fs.promises.writeFile(
      this.path,
      JSON.stringify(newArray, null, "\t")
    );
  };
}

const manager = new ProductManager("./archivo.json");

manager.addProduct(
  "titulo 2",
  "descripcion 2",
  5000,
  "https://www.pexels.com/es-es/buscar/foto/",
  4,
  25
);
manager.addProduct(
  "titulo 3",
  "descripcion 3",
  3000,
  "https://www.pexels.com/es-es/buscar/foto/",
  3,
  35
);
manager.addProduct(
  "titulo 4",
  "descripcion 4",
  3000,
  "https://www.pexels.com/es-es/buscar/foto/",
  7,
  35
);

manager.getProduct();

manager.getProductById(2);

manager.deleteProduct(2);

manager.updateProduct(
  1,
  "p",
  "d",
  3000,
  "https://www.pexels.com/es-es/buscar/foto/",
  7,
  35
);
