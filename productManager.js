import fs, { read } from "fs";

export class ProductManager {
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

  readJSON = async () => {
    return JSON.parse(await fs.promises.readFile(this.path, this.format));
  };

  writeFileFunction = async (array) => {
    await fs.promises.writeFile(this.path, JSON.stringify(array, null, "\t"));
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
      this.writeFileFunction(this.array);
    } catch (error) {
      console.error("ha ocurrido un error con el archivo", error);
    }
  };

  getProduct = async () => {
    this.validateData(!fs.existsSync(this.path), "file not found");

    try {
      let readFile = await this.readJSON();
      console.log(readFile);
    } catch (error) {
      console.error(error);
    }
  };

  getProductById = async (id) => {
    this.validateData(!fs.existsSync(this.path), "file not found");

    let readFile = await this.readJSON();

    let search = readFile.find((el) => el.id === id);

    search ? search : search = "Not found";
    
    return search
  };

  updateProduct = async (
    id,
    title,
    description,
    price,
    thumbnail,
    code,
    stock
  ) => {
    this.validateData(!fs.existsSync(this.path), "file not found");

    let readdFileToUpdate = await this.readJSON();

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

      this.writeFileFunction(newArray);

      this.getProduct();
    } else {
      newArray = [...otherItemInArray, nuevoItem];

      this.writeFileFunction(newArray);

      this.getProduct();
    }
  };

  deleteProduct = async (id) => {
    this.validateData(!fs.existsSync(this.path), "file not found");

    const readFile = await this.readJSON();

    const deleteItem = readFile.find((item) => item.id === id);

    this.validateData(!deleteItem, "Not found");

    let newArray = readFile.filter((item) => item.id != id);

    this.array.push(newArray);

    this.writeFileFunction(newArray);
  };
}
