import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LokiShopComponent } from './loki-shop/loki-shop.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PhoneDetailComponent }  from './phone-detail/phone-detail.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { ProductsComponent } from './administrator/products/products.component';
import { ProductUpdateComponent } from './administrator/product-update/product-update.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { SignupComponent } from './signup/signup.component';
import { ShoppingCartComponent } from './cart/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { BuySuccessfulComponent } from './buy-successful/buy-successful.component';
import { PopupCartComponent } from './popup-cart/popup-cart.component';
import { NewProductsComponent } from './new-products/new-products.component';
import { PopularProductsComponent } from './popular-products/popular-products.component';
import { AuthGuard } from './core/auth.guard';
import { ProductAddComponent } from './administrator/product-add/product-add.component';
import { SearchComponent } from './search/search.component';
import { OrdersComponent } from './administrator/orders/orders.component';
import { OrderDetailComponent } from './administrator/order-detail/order-detail.component';
import { UsersComponent } from './administrator/users/users.component';
import { VouchersComponent } from './administrator/vouchers/vouchers.component';
import { VoucherAddComponent } from './administrator/voucher-add/voucher-add.component';
import { VoucherUpdateComponent } from './administrator/voucher-update/voucher-update.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:cat/:id', component: PhoneDetailComponent },
  { path: 'phones', component: LokiShopComponent },
  { path: 'admin', component: AdministratorComponent, canActivate: [AuthGuard] /*AdministratorComponent*/ },
  { path: 'admin/products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'admin/orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'admin/customers', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'admin/discounts', component: VouchersComponent, canActivate: [AuthGuard] },
  { path: 'admin/order-detail/:id', component: OrderDetailComponent, canActivate: [AuthGuard] },
  { path: 'admin/discounts/:id', component: VoucherUpdateComponent, canActivate: [AuthGuard] },
  { path: 'admin/products/:cat/:id', component: ProductUpdateComponent, canActivate: [AuthGuard] },
  { path: 'admin/new-products', component: ProductAddComponent, canActivate: [AuthGuard] },
  { path: 'admin/new-voucher', component: VoucherAddComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'account/login', component: LoginComponent },
  { path: 'account/logout', component: LoginComponent },
  { path: 'account/signup', component: SignupComponent },
  { path: 'cart', component: ShoppingCartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'buy-successful/:orderID', component: BuySuccessfulComponent },
  { path: 'popup-cart', component: PopupCartComponent},
  { path: 'san-pham-moi', component: NewProductsComponent },
  { path: 'san-pham-noi-bat', component: PopularProductsComponent },
  { path: 'tim-kiem/:q', component: SearchComponent },
  // Trường hợp error #404
  { path: '**', component: DashboardComponent }
  ];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
