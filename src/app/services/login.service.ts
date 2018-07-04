import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ParentService } from '../services/parent.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Parent } from '../models/parent';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})

export class LoginService {
    public Parent: Parent;
    public checkId: Parent;

    public dataUpdated: Observable<Parent>;
    private dataSubject: Subject<Parent>;

    constructor(private http: HttpClient) {
        this.dataSubject = new Subject<Parent>();
        this.dataUpdated = this.dataSubject.asObservable();
    }

    getParentById(id) {
        let parentId = '/parent/' + id;
        return this.http.get<Parent>(parentId).subscribe((data) => {
            this.checkId = data;
            this.dataSubject.next(this.checkId)
        })
    }


    addNewUser() {
        // console.log('login service works!');
    }

}
