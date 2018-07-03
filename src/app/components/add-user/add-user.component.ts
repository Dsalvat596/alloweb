import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Parent } from '../../models/parent';
import { ParentService } from '../../services/parent.service';
import { FileUploader } from 'ng2-file-upload';

const uri = '/parent/upload';


@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css']
})

export class AddUserComponent implements OnInit {
    private pwCheck: String;
    private error: String = '';
    newparent = new Parent;
    uploader: FileUploader = new FileUploader({ url: uri });
    attachmentList: any = [];
    private isButtonVisible: Boolean = true;


    constructor(private parentService: ParentService,
        private route: ActivatedRoute,
        private router: Router,
        public dialogRef: MatDialogRef<AddUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {


        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            this.newparent.user_img = JSON.parse(response).uploadname;
            this.attachmentList.push(JSON.parse(response));
            this.isButtonVisible = false;
        };
    }

    ngOnInit() {
        // this.route.params.subscribe((params) =>{
        //  this.newparent.parent_id = this.data.user_id;
        // })
    }

    addParent(parent: Parent) {
        if (this.newparent.user_img == null) {
            this.newparent.user_img = 'http://3.bp.blogspot.com/-qDc5kIFIhb8/UoJEpGN9DmI/AAAAAAABl1s/BfP6FcBY1R8/s1600/BlueHead.jpg'
        }
        this.newparent.parent_id = null;
        this.newparent.balance = null;

        this.newparent.is_parent = true;

        if (this.newparent.pw != this.pwCheck) {
            this.error = "Passwords don't match"
            setTimeout(() => {
                this.error = "";
            }, 3000);

        } else {
            this.parentService.addNewParent(parent);
            this.dialogRef.close();
        }
    }
}
