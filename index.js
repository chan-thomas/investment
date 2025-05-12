const express = require('express');
const app = express();
const port = process.env.PORT || 3005; //PORT=5050 --watch node index
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))


const users = require('./db/users');
const student = require('./protected/student')
const passport = require('passport')
const login = require('connect-ensure-login');
const bcrypt = require('bcryptjs');
const { Strategy } = require('passport-local');

app.use(require('express-session')({
    secret: 'WhyPassportLocal!',
    resave: false,
    saveUninitialized: false
}))
passport.use(new Strategy(
    (username, password, cb) => {
        console.log(`in passport local strategy checking user ${username}`);
        users.findByUsername(username, (err, user) => {
            if (err) { return cb(err) }
            if (!user) { return cb(null, false) }
            let isMatched = bcrypt.compareSync(password, user.password)
            if (!isMatched) { return cb(null, false) }
            return cb(null, user)
        })
    }
))
passport.serializeUser((user, cb) => {
    cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
    users.findById(id, (err, user) => {
        if (err) { return cb(err) }
        cb(null, user)
    })
})
app.use(passport.initialize())
app.use(passport.session())

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => {
        console.log('we got a user login: success ');
        res.redirect('/')
})

app.get('/login', (req, res) => {
    res.redirect('/login.html')
})

app.get('/logout', (req, res, cb) => {
    req.logout((err) => {
        if (err) { return cb(err) }
    })
    res.redirect('/')
})

//Protected Students Route 
app.use('/students', login.ensureLoggedIn(), student)
//Protected Get request 
app.get('/test', login.ensureLoggedIn(), (req, res) => {
    res.send('This is protected');
})

app.listen(port, () => {
    // Use this to hash a password
    console.log(`"${bcrypt.hashSync("password12345", 10)}"`);
    console.log(`server is up, listening on port ${port}`);
})
