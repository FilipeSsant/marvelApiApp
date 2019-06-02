import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-herois-favoritos',
  templateUrl: './herois-favoritos.page.html',
  styleUrls: ['./herois-favoritos.page.scss'],
})
export class HeroisFavoritosPage implements OnInit {

  favoritesList = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private storage: Storage,
    private navCtrl: NavController) { 
      if(localStorage.getItem('heroisFavoritos')){
        this.favoritesList.push(...JSON.parse(localStorage.getItem('heroisFavoritos')));
        console.log(this.favoritesList);
      }else{
        
      }
  }

  heroDetails(id:number){
    this.navCtrl.navigateForward(`/hero-details/${id}`);
  }

  ngOnInit() {
  }

}
