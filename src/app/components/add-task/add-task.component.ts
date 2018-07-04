import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-add-task',
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
    inputFocus: boolean = false;
    newTask: Task = new Task();
    @Output() addTaskEmit: EventEmitter<Task> = new EventEmitter();

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
    }

    showAllAddTask() {
        // console.log("Trying to focus");
        this.inputFocus = true;
    }

    addTask() {
        if (sessionStorage.getItem("loggedIn") == "true" && sessionStorage.getItem("isParent") == "parent") {
        this.newTask.status_id = 1;
        // Default deadline - tommorow
        if (!this.newTask.deadline) { 
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            this.newTask.deadline = tomorrow;
        }

        // Default payment $10
        if (!this.newTask.payment) {
            this.newTask.payment = '10';
        }

        this.addTaskEmit.emit(this.newTask);
        this.newTask = new Task();
        this.inputFocus = false;
    } else {
        this.router.navigate(['']);
      }
      }

    cancel() {
        this.newTask = new Task();
        this.inputFocus = false;

    }
}
