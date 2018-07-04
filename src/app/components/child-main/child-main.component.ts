import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { Subscriber } from 'rxjs';
import { WishList } from '../../models/wishList';
import { WishListService } from '../../services/wish-list.service';
import { ChildService } from '../../services/child.service';
import { Child } from '../../models/child';


@Component({
    selector: 'app-child-main',
    templateUrl: './child-main.component.html',
    styleUrls: ['./child-main.component.css']
})
export class ChildMainComponent implements OnInit {

    public childId: number;
    tasks: Task[] = new Array<Task>();
    public user: Child;
    public img;
    public childBalance;
    public currentRoute: String;
    public wishListData: WishList[];
    public first_name;
    public noTasks: Boolean;


    constructor(private route: ActivatedRoute,
        private router: Router,
        private taskService: TaskService,
        private wishListService: WishListService,
        private childService: ChildService) {

        this.taskService.tasksUpdated.subscribe((data) => {
            this.tasks = data;
            if (typeof this.tasks[0] == 'undefined') {
                this.noTasks = true;
                // console.log(this.noTasks)
                return
            } else {
                // console.log(this.noTasks)
                this.noTasks = false
                this.tasks = data;
            }
        });
    }

    ngOnInit() {

        this.childService.childUpdated.subscribe((data) => {
            this.childBalance = data.balance;
            console.log(this.childBalance);
        });

        this.route.params.subscribe((params: Params) => {
            this.childId = params.id;
            this.childService.getChildById(this.childId);

            this.childService.childUpdated.subscribe((resp) => {
                this.user = resp;
                this.img = this.user.user_img;
                // this.childBalance = resp.balance;
                console.log(this.childBalance);
                this.first_name = this.user.first_name;
            })
            this.taskService.getTasks(this.childId);
        });

        this.currentRoute = this.router.url.slice(1, 11);

        this.wishListService.getWishList(this.childId);
        this.wishListService.WishListUpdated.subscribe((data) => {
            this.wishListData = data;
            for (let i = 0; i < this.wishListData.length; i++) {
                this.wishListData[i].progress = this.childBalance / this.wishListData[i].price * 100;
            }
        })       
    }

    addTask(newTask) {
        newTask.user_id = this.childId;
        this.taskService.addTask(newTask);
    }

    // Change task status_id to 2 complete with a put request
    taskComplete(task) {
        // newTask.user_id = this.childId;
        this.taskService.taskComplete(task);
    }

    // Change back the task status_id to 1 outstanding / incomplete with a put request
    taskIncomplete(task) {
        // console.log(task);
        this.taskService.taskIncomplete(task);
    }

    taskApprove(task) {
        console.log("child-main approveTask");
        console.log(task);
        // debugger;
        this.taskService.approveTask(task);
    }
    taskUnApprove(task) {
        console.log("child-main unApproveTask");
        console.log(task);

        this.taskService.unApproveTask(task);
    }
}
