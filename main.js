import express from  "express";
import moment from "moment";

const app = express();
app.use(express.json());

const HOST = '127.0.0.1'
const PORT = 8000

const products = [
  {
    id: 1,
    name: "Wireless Mouse",
    price: 25.99,
    category: "electronics",
    image:""
  },
  {
    id: 2,
    name: "Cotton T-Shirt",
    price: 15.50,
    category: "apparel",
    image:""
  },
  {
    id: 3,
    name: "Bluetooth Headphones",
    price: 59.99,
    category: "electronics",
    image:""
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 89.95,
    category: "footwear",
    image:""
  },
  {
    id: 5,
    name: "JavaScript Guide Book",
    price: 19.99,
    category: "books",
    image:""
  }
];

function addProduct(newProduct, fail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        return reject(new Error("Database save error"));
      }
      
      products.push(newProduct);
      resolve(newProduct);
    }, 200); 
  });
}

app.get(
    '/timestamp',  
    (req, res) => {
        const timestamp = moment().format('dddd, MMMM D, YYYY');
        res.json(
            {
                timestamp: timestamp
            }
        );
    }
);


app.get('/products',  (req, res) => {
    const {take, category} = req.query;
    let productsList = [];

    if(!take && !category){
        productsList = [...products];
    }
    else if(!take){
        productsList = [...products.filter(product => product.category === category)];
    }
    else if(!category){
        productsList = [...products.slice(0, take)];
    }
    else{
        productsList = [...products.filter(product => product.category === category).slice(0, take)];
    }
    return res.status(200).json(
        {
            products: productsList
        }
    );

});

app.get('/products/:id',  (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(product => product.id === productId);
    if (!product) {
        return res.status(404).json({ message: `Product with current id is not found` });
    }
    return res.status(200).json(product);
});

app.post('/products', async (req, res) => {
  try {
    const { name, price, category, image } = req.body;

    if (
      typeof name !== 'string' || name.trim() === '' ||
      typeof price !== 'number' || price <= 0 ||
      typeof category !== 'string' || category.trim() === ''
    ) {
      return res.status(422).json({ message: "Invalid product input data" });
    }

    const isDuplicate = products.some(product => product.name.toLowerCase() === name.trim().toLowerCase());
    if (isDuplicate) {
      return res.status(409).json({ message: "Product name already exists" });
    }

    const productImage = (typeof image === 'string') ? image.trim() : "";

    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
      id: newId,
      name: name.trim(),
      price: price,
      category: category.trim(),
      image: productImage
    };

    const fail = req.query.fail === 'true';
    const savedProduct = await addProduct(newProduct, fail);
    res.status(201).json(savedProduct);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to save product", error: error.message });
  }
});

app.listen(
    PORT, HOST, () => {
        console.log(`http://${HOST}:${PORT}`);
    }
);