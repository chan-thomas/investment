const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({urlencoded:false}));

app.listen(port, ()=>{
    console.log(`server is up. Listening on port:${port}`);
})