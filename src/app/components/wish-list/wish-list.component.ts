import { Component, OnInit } from '@angular/core';
import { WishListService } from '../../services/wish-list.service';
import { WishList } from '../../models/wishList';
import { MatDialog } from '@angular/material';
import { WishListSearchComponent } from '../wish-list-search/wish-list-search.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ChildService } from '../../services/child.service';

@Component({
    selector: 'app-wish-list',
    templateUrl: './wish-list.component.html',
    styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {
    public childId: number;
    public wishListData: WishList[];
    public progress;
    public currentRoute: String;
    public balance;
    public noWish: Boolean;


    constructor(private wishListService: WishListService,
        private childService: ChildService,
        public dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute) {

        this.route.params.subscribe((params) => {
            this.childId = params.id;
            //   console.log(this.childId);
            this.childService.getChildById(this.childId)
            this.childService.childUpdated.subscribe((resp) => {
                this.balance = resp.balance
                // console.log(this.balance)
            })
        });
    }

    ngOnInit() {

        this.currentRoute = this.router.url.slice(1, 11);
        // console.log(this.currentRoute);
        this.wishListService.getWishList(this.childId);
        this.wishListService.WishListUpdated.subscribe((data) => {
            this.wishListData = data;
            if (typeof this.wishListData[0] == 'undefined') {
                this.noWish = true;
                // console.log(this.noWish);
                // return
            } else {
                this.noWish = false
                // console.log(this.noWish);
            }
            for (let i = 0; i < this.wishListData.length; i++) {
                if (Math.floor(this.balance / this.wishListData[i].price * 100) >= 100) {
                    this.wishListData[i].progress = 100
                } else {
                    this.wishListData[i].progress = Math.floor(this.balance / this.wishListData[i].price * 100);
                }
            }
        })
    }

    openDialog(): void {

        let dialogRef = this.dialog.open(WishListSearchComponent, {
            data: this.childId,
            height: '600px',
            width: '700px',
            panelClass: 'custom-dialog-container'
        });

        dialogRef.afterClosed().subscribe(result => {
            //window.location.reload();
            //   console.log('The dialog was closed');
        });
    }

    removeWish(wish) {

        this.wishListService.removeFromWishList(wish);
        this.wishListService.WishListUpdated.subscribe((resp) => {
            //   console.log(resp);
        })
    }

    buyItNow(wish: WishList) {
        window.open(wish.link, '', 'width=600px,height=600px,resizable=no');
        window.blur();
        this.childService.deductFromBalance(wish);
        this.wishListService.removeFromWishList(wish);
        this.wishListService.WishListUpdated.subscribe((resp) => {

        });
        // })

    }
}
