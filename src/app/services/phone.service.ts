import { Injectable, NgZone } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { of } from "rxjs/observable/of";
import { catchError, map, tap } from "rxjs/operators";
import { Phone } from "../phone";
import { Laptop } from "../laptop";
import { Category } from "../category";
import { MessageService } from "./messages.service";

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import "rxjs/add/operator/map";
import { Brand } from "../brand";
import { Route, Router } from "@angular/router";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable()
export class PhoneService {
  public phoneUrl = "api/phones"; // URL to web api

  phoneCol: AngularFirestoreCollection<Phone[]>;
  accessoriesCol: AngularFirestoreCollection<Phone[]>;
  laptopCol: AngularFirestoreCollection<Laptop[]>;
  catCol: AngularFirestoreCollection<Category[]>;
  brandCol: AngularFirestoreCollection<Brand[]>;
  postDoc: AngularFirestoreDocument<Phone>;
  phonePosts: any;
  laptopPosts: any;
  catPosts: any;
  brandPosts: any;
  accessoriesPosts: any;
  masterPosts: Observable<Phone[]>;
  post: Observable<Phone>;
  posts: Observable<Phone[]>;
  listPhone: Phone[] = [];
  phones: Phone[] = [];
  mainImageUrl: string;
  constructor(
    public http: HttpClient,
    private messageService: MessageService,
    private angularFirestore: AngularFirestore,
    private route: Router
  ) { }
  /** Set main image of product in product-detail */
  setImage(imageUrl: string) {
    this.mainImageUrl = imageUrl;
  }
  /** GET categories from the serve */
  getCategories(): Observable<Category[]> {
    this.catCol = this.angularFirestore.collection("category");
    this.catPosts = this.catCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Category;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.catPosts.pipe(
      tap(phone => this.log(`fetched categories`)),
      catchError(this.handleError("getCategories", []))
    );
  }
  /** GET category by id */
  getCategoryByID(id: string): Observable<Category[]> {
    this.catCol = this.angularFirestore.collection("category", ref => ref.where("id", "==", id));
    this.catPosts = this.catCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Category;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.catPosts.pipe(
      tap(phone => this.log(`fetched categories`)),
      catchError(this.handleError("getCategories", []))
    );
  }
  getCategoryByName(name: string): Observable<Category[]> {
    this.catCol = this.angularFirestore.collection("category", ref => ref.where("name", "==", name));
    this.catPosts = this.catCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Category;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.catPosts.pipe(
      tap(phone => this.log(`fetched categories`)),
      catchError(this.handleError("getCategories", []))
    );
  }
  /**ADD new category */
  addCategory(
    id: string,
    sid: string,
    name: string,
    description: string
  ) {
    this.angularFirestore
      .collection("category").doc(id)
      .set({ id: sid, description: description, name: name });
    this.angularFirestore
      .collection("category").doc(id).collection(id + "-list").doc("placeholder").set({ name: "placeholder" });
  }
  /** GET brands */
  getBrands(): Observable<Brand[]> {
    this.brandCol = this.angularFirestore.collection("brands", ref =>
      ref.orderBy("name".toLowerCase(), "asc")
    );
    this.brandPosts = this.brandCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Brand;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.brandPosts.pipe(
      tap(phone => this.log(`fetched phone`)),
      catchError(this.handleError("getPhones", []))
    );
  }
  /** ADD new brand */
  addBrand(
    id: string,
    name: string,
    active: boolean,
    imageUrl: string
  ) {
    this.angularFirestore
      .collection("brands").doc(id)
      .set({ id: id, imageUrl: imageUrl, name: name, active: active });
  }
  /** GET most sold phones */
  getPopularPhones(): Observable<Phone[]> {
    this.phoneCol = this.angularFirestore.collection(
      "category/phones/phone-list",
      ref => ref.orderBy("sold", "desc")
    );
    this.phonePosts = this.phoneCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Phone;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.phonePosts.pipe(
      tap(phone => this.log(`fetched phone`)),
      catchError(this.handleError("getPhones", []))
    );
  }
  /** GET phones from the server */
  getPhones(): Observable<Phone[]> {
    this.phoneCol = this.angularFirestore.collection(
      "category/phones/phone-list",
      ref => ref.orderBy("postDate", "desc")
    );
    this.phonePosts = this.phoneCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Phone;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.phonePosts.pipe(
      tap(phone => this.log(`fetched phone`)),
      catchError(this.handleError("getPhones", []))
    );
  }
  /** GET phones by brand */
  getPhonesByBrand(brand: string): Observable<Phone[]> {
    this.phoneCol = this.angularFirestore.collection(
      "category/phones/phone-list",
      ref => ref.where("brand", "==", brand).orderBy("postDate", "desc")
    );
    this.phonePosts = this.phoneCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Phone;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.phonePosts.pipe(
      tap(phone => this.log(`fetched phone`)),
      catchError(this.handleError("getPhones", []))
    );
  }
  /** GET popular laptops from server */
  getPopularLaptops(): Observable<Phone[]> {
    this.laptopCol = this.angularFirestore.collection(
      "category/laptops/laptop-list",
      ref => ref.orderBy("sold", "desc")
    );
    this.laptopPosts = this.laptopCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Phone;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.laptopPosts.pipe(
      tap(phone => this.log(`fetched laptop`)),
      catchError(this.handleError("getLaptops", []))
    );
  }
  /** GET laptops from server */
  getLaptops(): Observable<Phone[]> {
    this.laptopCol = this.angularFirestore.collection(
      "category/laptops/laptop-list",
      ref => ref.orderBy("postDate", "desc")
    );
    this.laptopPosts = this.laptopCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Phone;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.laptopPosts.pipe(
      tap(phone => this.log(`fetched laptop`)),
      catchError(this.handleError("getLaptops", []))
    );
  }
  /** GET laptops by brand */
  getLaptopsByBrand(brand: string): Observable<Laptop[]> {
    this.laptopCol = this.angularFirestore.collection(
      "category/laptops/laptop-list",
      ref => ref.where("brand", "==", brand).orderBy("postDate", "desc")
    );
    this.laptopPosts = this.laptopCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Phone;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.laptopPosts.pipe(
      tap(phone => this.log(`fetched laptop`)),
      catchError(this.handleError("getLaptops", []))
    );
  }
  /** GET popular accessories from server */
  getPopularAccessories(): Observable<Phone[]> {
    this.laptopCol = this.angularFirestore.collection(
      "category/accessories/accessories-list", ref => ref.orderBy("sold", "desc")
    );
    this.laptopPosts = this.laptopCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Phone;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.laptopPosts.pipe(
      tap(phone => this.log(`fetched accessories`)),
      catchError(this.handleError("getAccessories", []))
    );
  }
  /** GET accessories from server */
  getAccessories(): Observable<Phone[]> {
    this.laptopCol = this.angularFirestore.collection(
      "category/accessories/accessories-list"
    );
    this.laptopPosts = this.laptopCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Phone;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.laptopPosts.pipe(
      tap(phone => this.log(`fetched accessories`)),
      catchError(this.handleError("getAccessories", []))
    );
  }
  /** GET accessories by brand */
  getAccessoriesByBrand(brand: string): Observable<Phone[]> {
    this.laptopCol = this.angularFirestore.collection(
      "category/accessories/accessories-list",
      ref => ref.where("brand", "==", brand).orderBy("postDate", "desc")
    );
    this.laptopPosts = this.laptopCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Phone;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.laptopPosts.pipe(
      tap(phone => this.log(`fetched accessories`)),
      catchError(this.handleError("getAccessories", []))
    );
  }
  getBanners(): Observable<Phone[]> {
    this.laptopCol = this.angularFirestore.collection(
      "banners/slider-banners/list"
    );
    this.laptopPosts = this.laptopCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Phone;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.laptopPosts.pipe(
      tap(phone => this.log(`fetched banners`)),
      catchError(this.handleError("getBanners", []))
    );
  }
  getSliders(): Observable<Phone[]> {
    this.laptopCol = this.angularFirestore.collection("banners/sliders/list");
    this.laptopPosts = this.laptopCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Phone;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.laptopPosts.pipe(
      tap(phone => this.log(`fetched sliders`)),
      catchError(this.handleError("getSliders", []))
    );
  }
  getLaptopAccessories(): Observable<Phone[]> {
    this.laptopCol = this.angularFirestore.collection(
      "category/accessories/accessories-list",
      ref => ref.where("tag", "==", "laptops")
    );
    this.laptopPosts = this.laptopCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Phone;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.laptopPosts.pipe(
      tap(phone => this.log(`fetched accessories`)),
      catchError(this.handleError("getAccessories", []))
    );
  }
  getPhoneAccessories(): Observable<Phone[]> {
    this.laptopCol = this.angularFirestore.collection(
      "category/accessories/accessories-list",
      ref => ref.where("tag", "==", "phones")
    );
    this.laptopPosts = this.laptopCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Phone;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
    return this.laptopPosts.pipe(
      tap(phone => this.log(`fetched successfull`)),
      catchError(this.handleError("getPhoneAccessories", []))
    );
  }

  /** GET hero by id. Return `undefined` when id not found */
  getPhoneNo404<Data>(id: number): Observable<Phone> {
    const url = "detail/id=${id}";
    return this.http.get<Phone[]>(url).pipe(
      map(phones => phones[0]), // returns a {0|1} element array
      tap(h => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`${outcome} phone id=${id}`);
      }),
      catchError(this.handleError<Phone>(`getPhone id=${id}`))
    );
  }

  /** GET phone by id. Will 404 if id not found */
  getPhone(id: string, category: string): Observable<Phone> {
    if(category == 'phone' || category == 'laptop'){
      category = category+"s";
    }
    var list = '';
    if(category!='accessories'){
    list = category.replace(category[category.lastIndexOf('s')], '') + "-list";
    }else{
    list = category+'-list';
    }
	this.postDoc = this.angularFirestore
      .collection("category")
      .doc(category)
      .collection(list)
      .doc(id);
    this.post = this.postDoc.valueChanges();
    return this.post.pipe(
      tap(_ => this.log(`fetched phone id=${id}`)),
      catchError(this.handleError<Phone>(`getPhone id=${id}`))
    );
  }

  /* GET heroes whose name contains search term 
  searchPhone(term: string): Observable<Phone[]> {
    if (!term.trim()) {
      // if not search term, return empty phone array.
      return of([]);
    }
	this.postsCol = this.angularFirestore.collection('posts', ref => ref.where('name', '==', 'Dell Venue'));
	this.posts = this.postsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Phone;
          const id = a.payload.doc.id;
          return { id, data };
        });
      });
	  return this.posts
	  .pipe(
      tap(_ => this.log(`found phones matching "${term}"`)),
      catchError(this.handleError<Phone[]>('searchPhones', []))
    );
    /*return this.http.get<Phone[]>(`api/phones/?name=${term}`).pipe(
      tap(_ => this.log(`found phones matching "${term}"`)),
      catchError(this.handleError<Phone[]>('searchPhones', []))
    );
  }*/
  //////// Save methods //////////

  /** POST: add a new hero to the server 
  addPhone (phone: Phone): Observable<Phone> {
    return this.http.post<Phone>(this.phoneUrl, phone, httpOptions).pipe(
      tap((phone: Phone) => this.log(`added phone w/ id=${phone.id}`)),
      catchError(this.handleError<Phone>('addPhone'))
    );
  }*/
  addPhone(phone: Phone, category: string) {
    if(category == 'phone' || category == 'laptop'){
      category = category+"s";
    }
    var list = '';
    if(category!='accessories'){
    list = category.replace(category[category.lastIndexOf('s')], '') + "-list";
    }else{
    list = category+'-list';
    }
    console.log(list + " - " + phone.id);
    this.angularFirestore
      .collection("category").doc(category).collection(list).doc(phone.id)
      .set({
        'id': phone.id, 'name': phone.name, 'snippet': phone.snippet,
        'price': phone.price, 'sale_price': phone.sale_price,
        'inStock': phone.inStock, 'colors': phone.colors, 'brand': phone.brand,
        'category': phone.category,'category_id': phone.category_id, 'postDate': new Date(), 'sold': 0,
        'imageUrl': new Array, 'thumb': ''
      }).then(t => {
        console.log("Product Added ");
        this.route.navigate(['/admin/products']);
      })
      .catch(function (error) {
        console.error("Error adding product: ", error);
      });
  }

  /** DELETE: delete the hero from the server */
  deletePhone(phone: Phone, category: string) {
    if(category == 'phone' || category == 'laptop'){
      category = category+"s";
    }
    var list = '';
    if(category!='accessories'){
    list = category.replace(category[category.lastIndexOf('s')], '') + "-list";
    }else{
    list = category+'-list';
    }
    this.angularFirestore.collection("category")
    .doc(category).collection(list).doc(phone.id).delete()
    .then( t => {
      console.log("Product Removed ");
      this.route.navigate(['/admin/products']);
    })
    .catch(function (error) {
      console.error("Error removing product: ", error);
    });
  }

  /** PUT: update the hero on the server */
  updatePhone(phone: Phone, category: string) {
    if(category == 'phone' || category == 'laptop'){
      category = category+"s";
    }
    var list = '';
    if(category!='accessories'){
    list = category.replace(category[category.lastIndexOf('s')], '') + "-list";
    }else{
    list = category+'-list';
    }
    console.log(list + " - " + phone.id);
    this.angularFirestore
      .collection("category").doc(category).collection(list).doc(phone.id)
      .update({
        name: phone.name, snippet: phone.snippet,
        price: phone.price, sale_price: phone.sale_price,
        inStock: phone.inStock, colors: phone.colors, brand: phone.brand
      });
  }
/** UPDATE instock when buying successfully */
  updateInStock(phone: Phone, category: string){
    if(category == 'phone' || category == 'laptop'){
      category = category+"s";
    }
    var list = '';
    if(category!='accessories'){
    list = category.replace(category[category.lastIndexOf('s')], '') + "-list";
    }else{
    list = category+'-list';
    }
    console.log(list + " - " + phone.id);
    this.angularFirestore
      .collection("category").doc(category).collection(list).doc(phone.id)
      .update({
        inStock: (phone.inStock - phone.qtyinCart),
        sold: (phone.sold + phone.qtyinCart)
      });
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  public handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  public log(message: string) {
    this.messageService.add("PhoneService: " + message);
  }
}
