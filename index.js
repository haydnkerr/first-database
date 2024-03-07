require('dotenv').config()
const express = require('express');
const nunjucks = require('nunjucks');

const app = express();
const port = process.env.PORT || 3000


const pg = require('pg')
const client = new pg.Client({
    connectionString: process.env.CONNECTION_STRING
})



// Configure Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    noCache: process.env.NODE_ENV !== 'production',
    express: app
});

client.connect()

app.get('/', async (req, res) => {

    
    let query = req.query.q
    let results = []

    if(query !== undefined) {
        query = query.toLowerCase()
        let likeQuery = `%${query}%`
        results = await client.query("SELECT t.name as song, a.title, art.name FROM track t INNER JOIN album a ON t.album_id = a.album_id INNER JOIN artist art ON a.artist_id = art.artist_id WHERE LOWER(t.name) LIKE $1", [likeQuery])
    }



    // Render index.njk using the variable "title" 
    res.render('search.njk', { title: "Search", query: query, rows: results.rows});
    
    

    // Render index.njk using the variable "title" 
    // res.render('index.njk', { title: "List of Artists", rows: results.rows });


    // res.render('seach.njk', { title: "List of Artists", query: query });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})