const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({urlencoded:false}));

app.get('/totalsaving', (req, res)=>{
    res.json({"total":1500});
})
app.get('/login', (req, res) => {
    //redirect to login page
    res.redirect('/login.html');
});
app.post('/login', (req, res)=>{
    const {email, password} = req.body;
    console.log(`email:${email} password:${password}`);
    res.send(`Welcome: ${email}`);
})
app.get('/register', (req, res) => {
    //redirect to register page
    res.redirect('/register.html');
});
app.get('/profile', (req, res) => {
    //redirect to profile page
    res.redirect('/profile.html');
});

app.listen(port, ()=>{
    console.log(`server is up. Listening on port:${port}`);
})