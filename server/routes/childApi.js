const express = require('express');
const router = express.Router();
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
const user = require('../dataAccess/user-model');
const task = require('../dataAccess/task-model')
const multer = require('multer'); 
var path = require('path');

// upload a photo for the child 



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



//get tasks by childuserID -- this will go in Child API
router.get('/:userId', async (req, res) => {
    let childId = req.params.userId;
    // console.log("++++++++++++++++++++++++++")
    // console.log(childId);
    try {
        res.send(JSON.stringify(await task.getAllRows(childId)));
    } catch (err) {
        console.log(err);
    }
})


// Add task
router.post('/', async (req, res) => {
    let newTask = req.body
    // console.log('++++++++++++' + newTask);
    try {
        await task.addTask(newTask);
        res.send(JSON.stringify(await task.getAllRows(newTask.user_id)));
    } catch (err) {
        console.log(err);
    }
})


// Task complete - status update
router.put('/taskComplete', async (req, res) => {
    let taskId = req.body.task_id;
    let userId = req.body.user_id;
    try {
        await task.taskComplete(taskId);
        res.send(JSON.stringify(await task.getAllRows(userId)));
    }
    catch (err) {
        console.log(err);
    }
})


// Task incomplete - status update
router.put('/taskIncomplete', async (req, res) => {
    let taskId = req.body.task_id;
    let userId = req.body.user_id;
    try {
        await task.taskIncomplete(taskId);
        res.send(JSON.stringify(await task.getAllRows(userId)));
    }
    catch (err) {
        console.log(err);
    }
})



// Task approve & pay - update
router.put('/approveTask', async (req, res) => {
    let taskId = req.body.task_id;
    let userId = req.body.user_id;
    let payment = req.body.payment;
    console.log("childApi - approveTask");
    console.log(payment);
    
    try {
        await user.taskPay(userId, payment);
        await task.approveTask(taskId);
        res.send(JSON.stringify(await task.getAllRows(userId)));     
    }
    catch (err) {
        console.log(err);
    }
})

router.put('/unApproveTask', async (req, res) => {
    let taskId = req.body.task_id;
    let userId = req.body.user_id;
    let payment = req.body.payment;
    console.log("childApi - unapproveTask");
    console.log(payment);
    try {
        await task.unApproveTask(taskId);
        await user.taskUnPay(userId, payment);
        res.send(JSON.stringify(await task.getAllRows(userId)));
    }
    catch (err) {
        console.log(err);
    }
})


/////////////////////////////////////////////////////////////////////////////////////
//add a new child
router.post('/addChild/', async (req, res) => {
    let newChild = req.body.newChild
    // console.log('++++++++++++' + newChild);
    res.send(JSON.stringify(await user.addChild(newChild)));
})


//get child data by childId
router.get('/getChildById/:childId', async (req, res) =>{
    let childId = req.params.childId;
    // console.log(childId);
    try {
         res.send(JSON.stringify(await user.getChildById(childId)));
    } 
    catch (err){
        console.log(err);
    }
})
module.exports = router;

