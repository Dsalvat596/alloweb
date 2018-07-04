import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Child } from '../models/child';
import { WishList } from '../models/wishList';
import { Jsonp } from '@angular/http';




@Injectable({
    providedIn: 'root'
})
export class WishListService {
    public error: String
    ebayData: WishList[] = new Array<WishList>();
    wishData: WishList[] = new Array<WishList>();
    public WishListSubject: Subject<WishList[]> 
    public WishListUpdated: Observable<WishList[]>;
    public EbayDataSubject: Subject<WishList[]>;
    public EbayDataUpdated: Observable<WishList[]>;
    
    constructor(private http: HttpClient, private jsonp: Jsonp) {
        this.WishListSubject = new Subject<WishList[]>();
        this.WishListUpdated = this.WishListSubject.asObservable();
        this.EbayDataSubject = new Subject<WishList[]>();
        this.EbayDataUpdated = this.EbayDataSubject.asObservable();
       
    }

    getWishList(childId) {
        this.http.get<any[]>('/wishList/' + childId).subscribe((data) => {
            this.wishData = data;
            this.WishListSubject.next(this.wishData)
        })
    }

    findItemsByKeywords(keyword: string) {
        return this.jsonp.request('https://svcs.ebay.com/services/search/FindingService/'+
                'v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=hodo'+
                '-alloweb-PRD-d7141958a-c562edf1&GLOBAL-ID=EBAY-US&RESPONSE-DATA-FORMAT=JSON&REST-PAYL'+
            'OAD&keywords=' + keyword + '&paginationInput.entriesPerPage=5&callback=JSONP_CALLBACK')
        .subscribe((data) => {
            let arr = data.json().findItemsByKeywordsResponse[0].searchResult[0].item;
            if (typeof arr == 'undefined') {
                this.error = '*Email address not found';
               setTimeout(() => { this.error = ''; }, 4000);
             } else{
            
            
            this.ebayData = [];
            for (let i=0 ; i<arr.length;i++){
              this.ebayData.push(arr[i]);
              
                // console.log(arr.title[0], arr.subtitle[0], arr.galleryURL[0], arr.sellingStatus[0].currentPrice[0].__value__,arr.viewItemURL[0]);
            } }this.EbayDataSubject.next(this.ebayData)
            // console.log(this.ebayData)
    });
    }
    

    addToWishList(item:WishList){
        //console.log(item)
        this.http.post<WishList[]>('/wishList/addToWishList', {newitem: item}).subscribe((data) =>{
            this.wishData = data;
            this.WishListSubject.next(this.wishData)
        })
        
    }

    removeFromWishList(wish:WishList){
        // console.log(wish);
      return  this.http.delete<WishList[]>('/wishList/removeFromWishList/' + wish.goal_id + '/user/' + wish.user_id).subscribe((data)=>{
            this.wishData = data;
            // console.log(this.wishData);
            this.WishListSubject.next(this.wishData);
        })
    }
    
    

}

