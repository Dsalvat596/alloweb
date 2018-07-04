import { Component, OnInit, Inject } from '@angular/core';
import { WishListService } from '../../services/wish-list.service';
import { WishList } from '../../models/wishList';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-wish-list-search',
  templateUrl: './wish-list-search.component.html',
  styleUrls: ['./wish-list-search.component.css']
})

export class WishListSearchComponent implements OnInit {
    products: any[] = null;
    public childId: number;
    wishSearchData: any = new Array<any>();
    keyword : string ; 
    constructor(private wishListService: WishListService, private route: ActivatedRoute, private router: Router, public dialogRef: MatDialogRef<WishListSearchComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.wishListService.EbayDataUpdated.subscribe((data) => {
            this.wishSearchData = data;
            // console.log(data);

        })
     }

  ngOnInit() {
     // this.wishListService.getWishList(this.childId)
        this.childId = this.data;
        // console.log(this.childId);
    }

    getItems() { 
        this.wishListService.findItemsByKeywords(this.keyword);
        this.wishListService.EbayDataUpdated.subscribe((data)=>{
        
           this.wishSearchData = data;
            // console.log(this.wishSearchData);
            
        })
        
    }
    addToWishList(item){
        
        let itemToAdd = {
            user_id : this.childId,
            goal_id: null,
            title: item.title[0],
            description: "description",
            price: item.sellingStatus[0].currentPrice[0].__value__,
            goal_img: item.galleryURL[0],
            link: item.viewItemURL[0],
            status: false,
            progress: 0 
        }
        
        this.wishListService.addToWishList(itemToAdd);
        this.dialogRef.close();
        
    }

}

