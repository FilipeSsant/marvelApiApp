import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HeroisFavoritosPage } from './herois-favoritos.page';

const routes: Routes = [
  {
    path: '',
    component: HeroisFavoritosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HeroisFavoritosPage]
})
export class HeroisFavoritosPageModule {}
