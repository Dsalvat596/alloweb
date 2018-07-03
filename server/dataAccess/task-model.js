const Sequelize = require('sequelize');
const dataAccess = require('./dataAccess');

class Task {
    constructor() {
        this.model = dataAccess.connection.define('Task', {
            task_id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.TEXT
            },
            description: {
                type: Sequelize.TEXT
            },
            payment: {
                type: Sequelize.INTEGER
            },
            deadline: {
                type: Sequelize.DATE
            },
            status_id: {
                type: Sequelize.TINYINT
            }
        });

    }

    // //getAllChildTasks
    getAllRows(userId) {
        console.log("++++++++++++++++++++++++++"); 
        return this.model.findAll({ where: { user_id: userId }, include: ["User" ] }); //, include: [User]
    }

    //getAllParentTasks
    //  getAllTasks(userId) {
    //     return this.model.findAll({ include: [user.model] }); 
    // }

    addTask(task) {
        return this.model.create(task);
    }


    taskComplete(updatedTaskId) {
        return this.model.update({ status_id: 2 }, { where: { task_id: updatedTaskId } });
    }

    taskIncomplete(updatedTaskId) {
        // console.log("++++++++++++++++++++++++++");
        // console.log("childApi - updatedTaskId");
        // console.log(updatedTaskId);
        return this.model.update({ status_id: 1 }, { where: { task_id: updatedTaskId } });
    }

    approveTask(updatedTaskId) {
        return this.model.update({ status_id: 3 }, { where: { task_id: updatedTaskId } });
    }
    unApproveTask(updatedTaskId) {
        return this.model.update({ status_id: 1 }, { where: { task_id: updatedTaskId } });
    }
}


const task = new Task();

module.exports = task;
