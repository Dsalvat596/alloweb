import { Component, OnInit, Input } from '@angular/core';
import { ParentService } from '../../services/parent.service';
import { ChildService } from '../../services/child.service';
import { UserService } from '../../services/user.service';
import { Parent } from '../../models/parent';
import { Child } from '../../models/child';
import { MatDialog } from '@angular/material';
import { AddChildComponent } from '../add-child/add-child.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-parent-main',
    templateUrl: './parent-main.component.html',
    styleUrls: ['./parent-main.component.css']
})


export class ParentMainComponent implements OnInit {

    public children: Child[];
    public parent: Parent;

    private _currentParentId = sessionStorage.getItem("currentUser");
    public _currentParent: Parent = new Parent();

    constructor(private parentService: ParentService, 
        private userService: UserService, 
        private childService: ChildService, 
        public dialog: MatDialog, 
        private route: ActivatedRoute, 
        private router: Router) {
    }

    ngOnInit() {
        if (sessionStorage.getItem("loggedIn") == "true" && sessionStorage.getItem("isParent") == "parent") {
            this.userService.getParentById(this._currentParentId);

            this.userService.dataUpdated.subscribe((resp) => {
                this._currentParent = resp[0];

                this.childService.getAllChildren(this._currentParentId);

                this.childService.dataUpdated.subscribe((res) => {

                    this.children = res;
                });
            });
        } else {
            this.router.navigate(['']);
        }


        if (sessionStorage.getItem("loggedIn") == "true") {
            this.parentService.dataUpdated.subscribe((data) => {
                // console.log(data)
                this.parent = data[0];
            });
        }
    }

    openDialog(parent: Parent): void {
        let dialogRef = this.dialog.open(AddChildComponent, {
            data: this._currentParent
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed');
        });
    }




    // logOut() {
    //     sessionStorage.clear();
    //     this.parent = undefined;
    //     this.router.navigate(['']);
    // }

    // navigateToChildTasks(userId) {
    //     this.router.navigate(['child-tasks/' + userId]);
    // }

    // navigateToChildWishList(userId) {
    //     console.log(userId);
    //     this.router.navigate(['/wish-list/' + userId]);

    // }
}
