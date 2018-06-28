const express = require('express');
const router = express.Router();
const user = require('../dataAccess/user-model');
const task = require('../dataAccess/task-model')

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// get parent by Email when login
router.get('/:email', async (req, res) => {
    let pemail = req.params.email
    try {
        res.send(JSON.stringify(await user.getParent(pemail)));
    } catch (err) {
        alert(err);
    }
})


// get kids by parent ID
router.get('/getKidsbyParent/:parentId', async (req, res) => {
    let parentId = req.params.parentId
    try {
        res.send(JSON.stringify(await user.getKids(parentId)));
    } catch (err) {
        alert(err);
    }
})
//add a new child
router.post('/addChild/', async (req, res) => {
    let newChild = req.body.newChild;
    let parentID = newChild.parent_id;
    console.log(newChild);
    await user.addChild(newChild);
    res.send(JSON.stringify(await user.getKids(parentID)));
})


module.exports = router;
/*
const express = require('express');
const router  = express.Router();
const user= require('../dataAccess/user-model');
const task = require('../dataAccess/task-model')

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// get parent by Email when login
router.get('/parents/:email', (req, res) =>{
    user.model.findAll({
        where: {email: req.params.email} }
    ).then(data =>{
        res.send(JSON.stringify(data))
    }, err => {
        res.send(err);
    })
})

// get kids by parent ID
router.get('/getKidsbyParent/:parentId', (req, res) => {
    user.model.findAll({where: {parent_id: req.params.parentId}}).then(data=>{
        res.send(JSON.stringify(data))
    },
err =>{
    console.error(err)
});
})

module.exports = router;
*/