const express = require('express')
const router = express.Router()
const path = require('path')

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})
//url localhost:3000/student/
router.get('/', (req, res)=>{
  console.log('in student route');
    res.json( {user: req.user, Student: req.user.username})
})

router.get('/registration', (req, res)=>{
  let file = path.join(__dirname, 'data', 'myData.txt')  
  console.log(file);
  res.sendFile(file)
})
module.exports = router
