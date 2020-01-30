import { Component, OnInit, OnDestroy } from '@angular/core';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { Store, select } from '@ngrx/store';

import * as fromProduct from '../state/product.reducer';

import * as ProductActions from '../state/product.actions';
import { takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
    })
    export class ProductListComponent implements OnInit, OnDestroy {
    pageTitle = 'Products';
    errorMessage: string;

    displayCode: boolean;

    products: Product[];

    // Used to highlight the selected product in the list
    selectedProduct: Product | null;
    componentActive = true;
    products$: Observable<Product[]>;

    errorMessage$: Observable<string>;

    constructor(
        private productService: ProductService,
        private store: Store<fromProduct.State>
    ) { }

    ngOnInit(): void {

        // TODO: Unsubscribe
        this.store.pipe(select(fromProduct.getCurrentProduct)).subscribe(
            currentProduct => this.selectedProduct = currentProduct
        );
        // this.sub = this.productService.selectedProductChanges$.subscribe(
        // selectedProduct => this.selectedProduct = selectedProduct
        // );

        // this.productService.getProducts().subscribe({
        // next: (products: Product[]) => this.products = products,
        // error: (err: any) => this.errorMessage = err.error
        // });

        this.errorMessage$ = this.store.pipe(select(fromProduct.getError));

        this.store.dispatch(new ProductActions.Load());
        this.products$ = this.store.pipe(select(fromProduct.getProducts));
        // *** if you chose to unsubscribe in the component you would use the code below
        // takeWhile(() => this.componentActive))
        // .subscribe((products: Product[]) => this.products = products);

        this.store.pipe(select(fromProduct.getShowProductCode)).subscribe( // 'products' is slice of state
           showProductCode => this.displayCode = showProductCode
        );
    }

    ngOnDestroy(): void {
        this.componentActive = false;
    }

    checkChanged(value: boolean): void {
        this.displayCode = value;
        this.store.dispatch(new ProductActions.ToggleProductCode(value));
    }

    newProduct(): void {
        // this.productService.changeSelectedProduct(this.productService.newProduct());
        this.store.dispatch(new ProductActions.InitializeCurrentProduct());
    }

    productSelected(product: Product): void {
        // this.productService.changeSelectedProduct(product);
        this.store.dispatch(new ProductActions.SetCurrentProduct(product));
    }

}
