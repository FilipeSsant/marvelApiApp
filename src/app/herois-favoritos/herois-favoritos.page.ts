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
      this.storage.length().then(tamanho =>{
        if(tamanho != 0){
          this.storage.get('heroisFavoritos')
          .then((dados) => {
            dados.forEach(heroi => {
              this.favoritesList.push(heroi);
            });
          }),
          (err) =>{
            console.log(err);
          };
        }
      })
  }

  heroDetails(id:number){
    this.navCtrl.navigateForward(`/hero-details/${id}`);
  }

  ngOnInit() {
  }

}
