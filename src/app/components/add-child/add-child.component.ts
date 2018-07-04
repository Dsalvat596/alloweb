import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Child } from '../../models/child';
import { ChildService } from '../../services/child.service';
import { FileUploader } from 'ng2-file-upload';

const uri = '/child/upload';


@Component({
    selector: 'app-add-child',
    templateUrl: './add-child.component.html',
    styleUrls: ['./add-child.component.css']
})

export class AddChildComponent implements OnInit {
    private pwCheck: String;
    private error: string = '';
    newChild = new Child;
    uploader: FileUploader = new FileUploader({ url: uri });
    attachmentList: any = [];
    private isButtonVisible: Boolean = true;


    constructor(private childService: ChildService,
        private route: ActivatedRoute,
        private router: Router,
        public dialogRef: MatDialogRef<AddChildComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {


        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            this.newChild.user_img = JSON.parse(response).uploadname;
            this.attachmentList.push(JSON.parse(response));
            this.isButtonVisible = false;
        };
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.newChild.parent_id = this.data.user_id
        })
    }

    addChild(child: Child) {
        if (this.newChild.user_img == null) {
            this.newChild.user_img = 'http://3.bp.blogspot.com/-qDc5kIFIhb8/UoJEpGN9DmI/AAAAAAABl1s/BfP6FcBY1R8/s1600/BlueHead.jpg'
        }
        this.newChild.parent_id = this.data.user_id
        this.newChild.is_parent = false;
        this.newChild.balance = 5;
        if (this.newChild.pw != this.pwCheck) {
            this.error = "Passwords don't match"
            setTimeout(() => {
                this.error = "";
            }, 3000);

        } else {
            this.childService.addNewChild(child);
            this.dialogRef.close();
        }
    }
}