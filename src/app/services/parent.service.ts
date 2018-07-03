import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Parent } from '../models/parent';

@Injectable()

export class ParentService {
    public Parent: Parent;
    public checkEmail: Parent;
    public dataUpdated: Observable<Parent>;
    private dataSubject: Subject<Parent> = new Subject<Parent>();

    constructor(private http: HttpClient) {
        // this.dataSubject = new Subject<Parent>();
        this.dataUpdated = this.dataSubject.asObservable();
    }

    checkParent(email) {
        let parentEmail = '/parent/getByEmail/' + email;
        return this.http.get<Parent>(parentEmail).subscribe((data) => {
            this.checkEmail = data;
            this.dataSubject.next(this.checkEmail)
        })
    }
    addNewParent(parent: Parent) {

        return this.http.post<Parent>('/parent/addUser', { newParent: parent }).subscribe((resp) => {
        })
    }

    ValidateEmail(mail) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (mail.match(mailformat)) {
            return true;
        } else {
            return false;
        }
    }

}
