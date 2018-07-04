import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Child } from '../models/child';
import { WishList } from '../models/wishList';



@Injectable({
    providedIn: 'root'
})
export class ChildService implements OnInit  {

    
    public childData: Child
    public Children: Child[];
    public getKids: Child[];

    public dataUpdated: Observable<Child[]>;
    private dataSubject: Subject<Child[]> = new Subject<Child[]>();

    public childUpdated: Observable<Child>;
    private childSubject: Subject<Child> = new Subject<Child>();

    constructor(private http: HttpClient) {
        // this.dataSubject = new Subject<Child[]>();
        this.dataUpdated = this.dataSubject.asObservable();

        // this.childSubject = new Subject<Child>();
        this.childUpdated = this.childSubject.asObservable();

    }

    ngOnInit() {}

    getAllChildren(parentId) {
        let getKidsRoute = '/parent/getKidsbyParent/' + parentId;
        return this.http.get<Child[]>(getKidsRoute).subscribe((data) => {
            this.Children = data;
            this.dataSubject.next(this.Children);
        });
    }


    addNewChild(child: Child) {
        // console.log(child);
        return this.http.post<Child[]>('/parent/addChild', { newChild: child }).subscribe((resp) => {
            this.Children = resp;
            this.dataSubject.next(this.Children);
        })
    }

    getChildById(childId): void {
        // console.log(childId)
        this.http.get<any>('/child/getChildById/' + childId).subscribe((resp) => {
            console.log("child-service get child obj by id:");
            console.log(resp);
            
            this.childData = resp;
            this.childSubject.next(this.childData);
        })
    }

    // Daniel - buy wish - header change
    deductFromBalance(wish: WishList): void  {
        // console.log(wish.user_id)
        this.http.put<any>('/wishList/deductFromBalance/', { wish: wish }).subscribe((resp) => {
            console.log(resp);
            
            this.childData = resp;
            this.childSubject.next(this.childData);
        })
    }



    // taskComplete(task: Task) {
    //     this.http.put<any>('/child/taskComplete', task).subscribe((data) => {
    //         this.tasksArr = data;
    //         // console.log(this.tasksArr);

    //         this.tasksSubject.next(this.tasksArr);
    //     });
    // }

    /*
    deductFromBalance(wish: WishList) {
        console.log(wish.user_id)
        this.http.put<Child>('/wishList/deductFromBalance/', { wish: wish }).subscribe((resp) => {
            this.childData = resp;
            this.childSubject.next(this.childData);
        })
    }
    */

    
}

