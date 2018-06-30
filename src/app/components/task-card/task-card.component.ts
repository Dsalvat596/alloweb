import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Task } from '../../models/task';
// import { TaskService } from '../../services/task.service';
import { ParentTasksComponent } from '../parent-tasks/parent-tasks.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material';

/** Custom options the configure the tooltip's default show/hide delays. */
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
    showDelay: 1000,
    hideDelay: 0,
    touchendHideDelay: 1000
};

@Component({
    selector: 'app-task-card',
    templateUrl: './task-card.component.html',
    styleUrls: ['./task-card.component.css'],
    providers: [
        { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }
    ],
    encapsulation: ViewEncapsulation.None
})
export class TaskCardComponent implements OnInit {

    color = 'accent';
    @Input() _isParent: Boolean;
    // _isParent: Boolean = true;
    taskCompletedCheck = false;
    taskCompletedDisabled = false;
    checked = true;

    taskApprovedCheck = false
    taskApprovalDisabled = true;

    paidChecked = false;
    indeterminate = false;
    labelPosition = 'after';
    paidDisabled = true;
    taskCompletionCheck: Boolean = false;


    @Input() task: Task;
    @Input() currentRoute: String;
    @Output() taskCompleteEmit: EventEmitter<Task> = new EventEmitter();
    @Output() taskIncompleteEmit: EventEmitter<Task> = new EventEmitter();
    @Output() approveTaskEmit: EventEmitter<Task> = new EventEmitter();

    tasks: Task[] = new Array<Task>();


    constructor() { }

    ngOnInit() { }

    taskStatusChange(task: Task) {
        // console.log("task-card taskStatusChange - task");
        // console.log(task);
        if (task.status_id == 1) {
            this.taskCompleteEmit.emit(task);
            // this.taskCompletionCheck = true;
        } else if (task.status_id > 2) {
            this.taskIncompleteEmit.emit(task);
            // this.taskCompletionCheck = false;
        }
    }

    approveTask(task) {
        console.log("task-card approveTask - task");
        console.log(task);
        this.approveTaskEmit.emit(task);
    }
}
