import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../products';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {

  products:Product[]=[];

  productForm:FormGroup;
  showEdit:boolean;
  showAdd:boolean;


  constructor(private productService:ProductService,private fb:FormBuilder){
    this.productForm = this.fb.group({
      name:['',Validators.required],
      price:[0,Validators.required],
      description:['']
    })

    this.showAdd = true;
    this.showEdit = false;

  }

  ngOnInit(){
    this.getProducts();
  }


  private getProducts():void{
    this.productService.getProducts().subscribe(res=>this.products = res);
  }


  add():void{

    if(this.productForm.invalid){
      alert('Faltan campos por rellenar');
      return;
    }

    const {name,price,description} = this.productForm.getRawValue();

    this.productForm.reset();

    this.productService.addNewProduct(name,price,description).subscribe(result=>{

      if(result){
        this.getProducts();
      }
    })

  }

  editProduct(index:number):void{
    this.showAdd = false;
    this.showEdit = true;
    this.productForm.patchValue({_id:this.products[index]._id});
    this.productForm.patchValue({name:this.products[index].name});
    this.productForm.patchValue({description:this.products[index].description});
    this.productForm.patchValue({price:this.products[index].price});

  }

  modify():void{
    this.showEdit = false;
    this.showAdd = true;
    const {_id,name,description,price} = this.productForm.getRawValue();

    this.productService.updateProduct(_id,name,description,price).subscribe(res=>{
      if(res){
        this.getProducts();
      }
    })
  }

  deleteProduct(index:number):void{
    this.productService.deleteProduct(this.products[index]._id).subscribe(result=>{

      if(result){
        this.getProducts();
      }
    })
  }

}
