const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql')
const bcrypt = require('bcryptjs')
// const path = require('path');
// const dotenv=require('dotenv')



// dotenv.config({ path: './.env' });

const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: 'false' }))
app.use(express.json())

//database Connection
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Arya@12345',
  database: 'vivekdata',
  multipleStatements: true
});


db.connect(err => {
  if (err) {
    console.log(err, 'dberr');
  }
  console.log('database connected .....')
})


//Auth-signup 


app.post("/auth/signup", (req, res) => {
  const { name, email, password } = req.body

  db.query('SELECT email FROM login WHERE email = ?', [email], async (error, result) => {
    if (error) {
      console.log(error)
    }

    if (result.length > 0) {
      return res.status(400).send({
        message: 'This email is already in use'
      })
    }

    db.query('INSERT INTO login SET?', { name: name, email: email, password: password }, (err, result) => {
      if (error) {
        console.log(error)
      } else {
        return res.status(200).send({
          message: 'User signed up!'
        })
      }
    })
  })
})


app.get('/auth/getUser', (req, res) => {
  let qr = 'SELECT * FROM login';
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err, 'errs');
    }
    if (result.length > 0) {
      res.send({
        message: 'all users data',
        data: result
      })
    }
  },)
  console.log('get users')
})

//My APIs
app.get('/product', (req, res) => {
  let qr = 'SELECT * FROM products';
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err, 'errs');
    }
    if (result.length > 0) {
      res.send({
        message: 'all Product data',
        data: result
      })
    }
  },)
  console.log('get Products')
})

//get single data
app.get('/product/:id', (req, res) => {
  let gID = req.params.id;
  let qr = `SELECT * FROM products WHERE id = ${gID}`;
  db.query(qr, (err, result) => {
    if (err) { console.log(err); }
    if (result.length > 0) {
      res.send({
        message: 'get single data by id',
        data: result
      })
    }
    else {
      res.send({
        message: 'data not found'
      })
    }
  })
});

//create data
app.post('/product', (req, res) => {
  console.log(req.body, 'createdata');
  let id = req.body.id;
  let title = req.body.title;
  let price = req.body.price;
  let description = req.body.description;
  let category = req.body.category;
  let image = req.body.image;
  let rating_rate = req.body.rating_rate;
  let rating_count = req.body.rating_count;


  let qr = `INSERT INTO products (id,title, price, description, category, image, rating_rate, rating_count) VALUES ('${id}','${title}','${price}','${description}','${image}','${rating_count}','${rating_rate}','${category}')`


  db.query(qr, (err, result) => {
    if (err) { console.log(err); }
    if (result.length > 0) {
      res.send({
        message: 'data inserted succesfuly',

      })
    }
    else {
      res.send({
        message: 'wrong data inserted please verify once'
      })
    }
  })
})

app.put('/product/:id', (req, res) => {
  console.log(req.body, 'updateddata');
  let gID = req.body.id;
  let title = req.body.title;
  let price = req.body.price;
  let description = req.body.description;
  let category = req.body.category;
  let image = req.body.image;
  let rating_rate = req.body.rating_rate;
  let rating_count = req.body.rating_count;


  let qr = `UPDATE products set title='${title}', price='${price}', description=${description}, category='${category}', image='${image}', rating_rate='${rating_rate}', rating_count='${rating_count}' where id=${gID}`


  db.query(qr, (err, result) => {
    if (err) { console.log(err); }
    res.send({
      message: 'data Updated succesfuly',
    })
  })
})

app.delete('/product/id', (req, res) => {
  let qID = req.params.id;
  let qr = `delete from products where id = ${qID}`;

})



app.listen(3000, () => {

  console.log('server running');
})