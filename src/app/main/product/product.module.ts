import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { TypeComponent } from './type/type.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BangComponent } from './bang/bang.component';
import { GiangvienComponent } from './giangvien/giangvien.component';
import { HocvienComponent } from './hocvien/hocvien.component';
import { LopComponent } from './lop/lop.component';
import { TintucComponent } from './tintuc/tintuc.component';

@NgModule({
  declarations: [ 
    OrderComponent,TypeComponent, BangComponent, GiangvienComponent, HocvienComponent, LopComponent, TintucComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'type',
        component: TypeComponent,
      },
      {
        path: 'bang',
        component: BangComponent,
      },
      {
        path: 'giangvien',
        component: GiangvienComponent,
      },
      {
        path: 'hocvien',
        component: HocvienComponent,
      },
      {
        path: 'lop',
        component: LopComponent,
      },
      {
        path: 'tintuc',
        component: TintucComponent,
      },
  ]),  
  ]
})
export class ProductModule { }
