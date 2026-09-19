import express from  "express";
import moment from "moment";

const app = express();

const HOST = '127.0.0.1'
const PORT = 8000

const products = [
  {
    id: 1,
    name: "Wireless Mouse",
    price: 25.99,
    category: "electronics"
  },
  {
    id: 2,
    name: "Cotton T-Shirt",
    price: 15.50,
    category: "apparel"
  },
  {
    id: 3,
    name: "Bluetooth Headphones",
    price: 59.99,
    category: "electronics"
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 89.95,
    category: "footwear"
  },
  {
    id: 5,
    name: "JavaScript Guide Book",
    price: 19.99,
    category: "books"
  }
];

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
        return res.status(404).json({ message: `Product with current id not found` });
    }
    return res.status(200).json(product);
});

app.listen(
    PORT, HOST, () => {
        console.log(`http://${HOST}:${PORT}`);
    }
);