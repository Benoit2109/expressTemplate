const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const connection = require('./db');
const { request } = require('express');

app.use(express.json())

app.get('/api/passeport',(req,res)=>{
    connection.query('SELECT * FROM User_Passeport', (err, results)=> {
        if(err){
            res.status(500).json({
                error: err.message,
                sql: err.sql,
            });
        } else {
            res.json(results);
        }
    })
})



app.get('/api/passeport/countries',(req,res) =>{
    connection.query("SELECT country_name FROM User_Passeport",
    [req.params.id],(err,results)=>{
        if(err){
            res.status(500).send("Error retrieving data")
        } else {
            res.status(200).send(results)
        }
    })
})

app.get('/api/passeport/contains',(req,res) =>{
    connection.query("SELECT * FROM User_Passeport WHERE country_name LIKE ?",
    [`%${req.query.country}%`],(err,results)=>{
        if(err){
            res.status(500).send("Error retrieving data")
        } else if(results.length === 0) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(results)
        }
    })
})

app.get('/api/passeport/startWith',(req,res) =>{
    connection.query("SELECT * FROM User_Passeport WHERE country_name LIKE ?",
    [`${req.query.country}%`],(err,results)=>{
        if(err){
            res.status(500).send("Error retrieving data")
        } else if(results.length === 0) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(results)
        }
    })
})

app.get('/api/passeport/numberVisit/:numberVisit',(req,res) =>{
    connection.query("SELECT * FROM User_Passeport WHERE visit_times > ?",
    [req.params.numberVisit],(err,results)=>{
        if(err){
            res.status(500).send("Error retrieving data")
        } else if(results.length === 0) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(results)
        }
    })
})

app.get('/api/passeport/visit/order/:value',(req,res) =>{
    let order = 'asc';
    if (req.params.value === 'desc') {
        order = 'desc';
    }
    connection.query(`SELECT * FROM User_Passeport ORDER BY visit_times ${order}`,
    [req.params.orderVisit],(err,results)=>{
        if(err){
            res.status(500).send("Error retrieving data")
        } else if(results.length === 0) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(results)
        }
    })
})

app.get('/api/passeport/:id',(req,res) =>{
    connection.query("SELECT * FROM User_Passeport WHERE id=?",
    [req.params.id],(err,results)=>{
        if(err){
            res.status(500).send("Error retrieving data")
        } else if(results.length === 0) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(results[0])
        }
    })
})


app.post('/api/passeport',(req,res)=>{
    const {country_name, visited, last_visit, visit_times} = req.body;
  return connection.query('INSERT INTO User_Passeport(country_name, visited, last_visit, visit_times) VALUES(?,?,?,?)', [country_name, visited, last_visit, visit_times], (err,results)=> {
      if(err){
          return res.status(500).json({
              error: err.message,
              sql: err.sql,
          });
      } else {
          res.status(201).send('Country successfully inserted')
      }
  })  
})

app.put('/api/passeport/:id', (req,res) => {
    const idCountry = req.params.id;
    const newCountry = req.body;
    return connection.query('UPDATE User_Passeport SET ? WHERE id = ?', [newCountry, idCountry], (err, results)=> {
        if(err) {
            return res.status(500).json({
                error: err.message,
                sql: err.sql,
            })
        } else { 
            return res.status(200).send(results)
        }
    })
})

app.put('/api/passeport/visited/:id', (req,res) => {
    return connection.query('UPDATE User_Passeport SET visited = !visited WHERE id = ?', [req.params.id], (err, results)=> {
        if(err) {
            return res.status(500).json({
                error: err.message,
                sql: err.sql,
            })
        } else { 
            return res.status(200).send('toggle visited')
        }
    })
})

app.delete('/api/passeport/:id', (req,res) => {
    const idCountry = req.params.id;
    return connection.query('DELETE * FROM User_Passeport WHERE id = ?', [idCountry], (err, results)=> {
        if(err) {
            return res.status(500).json({
                error: err.message,
                sql: err.sql,
            })
        } else { 
            return res.status(200).send('userCountry correctly deleted')
        }
    })
})

app.delete('/api/passeport/delete/visited/:value', (req,res) => {
    return connection.query('DELETE * FROM User_Passeport WHERE visited = ?', [req.params.value], (err, results)=> {
        if(err) {
            return res.status(500).json({
                error: err.message,
                sql: err.sql,
            })
        } else { 
            return res.status(200).send('userCountry correctly deleted')
        }
    })
})

app.listen(process.env.PORT, (err) => {
    if(err) {
        throw new Error('Something bad happenned...');
    }
    console.log(`Server is listening on ${process.env.PORT}`);
})