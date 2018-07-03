
const express = require('express');
const router  = express.Router();
const user= require('../dataAccess/user-model');
const multer = require('multer'); 
const task = require('../dataAccess/task-model');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;







var store = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + file.originalname);
    }
});

var upload = multer({ storage: store }).single('file');



router.post('/upload', function (req, res, next) {
    // console.log(req.path);
    upload(req, res, function (err) {
        if (err) {
            return res, status(501).json({ error: err });
        }
        //do all database record saving activity
        return res.json({ originalname: req.file.originalname, uploadname: req.file.filename });
    });
});


// get parent by Email when login
router.get('/getByEmail/:email', async (req, res) =>{
  let pemail = req.params.email
  try{
      res.send(JSON.stringify(await user.getParent(pemail)));
  } catch (err) {
    alert(err);
  }
  })

// get parent by Id 
router.get('/getById/:id', async (req, res) =>{
   let parentId = req.params.id
   try{
       res.send(JSON.stringify(await user.getParentById(parentId)));
   } catch (err) {
     alert(err);
   }
   })

//get tasks by parentUserId 
router.get('/getTasksbyParent/:parentId', async (req, res) => {
  let parentId = req.params.parentId;
  try {
      res.send(JSON.stringify(await user.getAllTasks(parentId)));
   } catch (err) {
      console.log(err);
  }
})

// get kids by parent ID
router.get('/getKidsbyParent/:parentId', async (req, res) => {
    let parentId = req.params.parentId
    try {
        res.send(JSON.stringify(await user.getKids(parentId)));
        } catch (err) {
          console.log(err);
        }
        })

//add a new child
router.post('/addChild/', async (req, res) => {
  let newChild = req.body.newChild;
  let parentId = newChild.parent_id;
    await user.addChild(newChild);
   res.send(JSON.stringify(await user.getKids(parentId)));
})

router.post('/addUser/', async (req, res) => {
  let newParent = req.body.newParent;
    // await user.addParent(newParent);
    res.send(JSON.stringify(await user.addParent(newParent)));
})

module.exports = router;
