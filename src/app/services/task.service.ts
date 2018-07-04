import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task';
import { Observable, Subject } from 'rxjs';
import { AllTasks } from '../models/alltasks';
import { ChildService } from './child.service';

@Injectable({
    providedIn: 'root'
})
export class TaskService implements OnInit {

    tasksArr: AllTasks[] = new Array<AllTasks>();
    public tasksSubject: Subject<Task[]> = new Subject<Task[]>();
    public tasksUpdated: Observable<Task[]>;

    // Parent view of all children tasks - not showing
    public allTasksSubject: Subject<AllTasks[]> = new Subject<AllTasks[]>();
    public allTasksUpdated: Observable<AllTasks[]>;
    public getAll: Task[];


    constructor(private http: HttpClient, private childService: ChildService) {
        this.tasksUpdated = this.tasksSubject.asObservable();
        this.allTasksUpdated = this.allTasksSubject.asObservable();
    }

    ngOnInit() { }

    getTasks(childId): void {
        this.http.get<any[]>('/child/' + childId).subscribe((data) => {
            this.tasksArr = data;
            // console.log(data);

            this.tasksSubject.next(this.tasksArr);
        })
    }

    addTask(task) {
        this.http.post<any[]>('/child', task).subscribe((data) => {
            this.tasksArr = data;
            this.tasksSubject.next(this.tasksArr);
        })
    }

    taskComplete(task: Task) {
        this.http.put<any>('/child/taskComplete', task).subscribe((data) => {
            this.tasksArr = data;
            // console.log(this.tasksArr);

            this.tasksSubject.next(this.tasksArr);
        });
    }

    taskIncomplete(task: Task) {
        // console.log(task);
        this.http.put<any>('/child/taskIncomplete', task).subscribe((data) => {
            this.tasksArr = data;
            // console.log(this.tasksArr);
            this.tasksSubject.next(this.tasksArr);
        });
    }

    // taskIncompleteUnpay(task: Task) {
    //     // console.log(task);
    //     this.http.put<any>('/child/taskIncompleteUnpay', task).subscribe((data) => {
    //         this.tasksArr = data;
    //         // console.log(this.tasksArr);
    //         this.tasksSubject.next(this.tasksArr);
    //     });
    // }

    approveTask(task: Task) {
        this.http.put<any>('/child/approveTask', task).subscribe((data) => {
            this.tasksArr = data;
            this.tasksSubject.next(this.tasksArr);
            this.childService.getChildById(task.user_id);
        });
    }

    unApproveTask(task: Task) {
        this.http.put<any>('/child/unApproveTask', task).subscribe((data) => {
            this.tasksArr = data;
            this.tasksSubject.next(this.tasksArr);
            this.childService.getChildById(task.user_id);
        });
    }


    //////////////////////////////////////////////////////////////////////////////
    // Parent view of all children tasks - not showing
    getAllTasks(parentId) {
        let getTasksRoute = '/parent/getTasksbyParent/' + parentId;
        return this.http.get<AllTasks[]>((getTasksRoute)).subscribe((data) => {
            this.tasksArr = data;
            this.allTasksSubject.next(this.tasksArr);
        })
    }
}
