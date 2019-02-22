import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule, IonItemSliding } from '@ionic/angular';

import { ListaPage } from './lista.page';
import { HeroDetailsPage } from '../hero-details/hero-details.page';

const routes: Routes = [
  {
    path: '',
    component: ListaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaPage]
})
export class ListaPageModule {}
