import { Component, OnInit } from '@angular/core';
import { MarvelApiService } from '../marvel-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.page.html',
  styleUrls: ['./hero-details.page.scss'],
})
export class HeroDetailsPage implements OnInit {

  hero: any;
  obj: any;
  seriesArray = [];
  img: any;
  id: any;
  isFavorite: boolean = false;
  heroisFavoritos: Array<any> = [];

  constructor(private marvelProvider: MarvelApiService,
    private activatedRoute: ActivatedRoute) { 
    }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getHero();
    if(localStorage.getItem("heroisFavoritos")){
      this.heroisFavoritos = JSON.parse(localStorage.getItem("heroisFavoritos"));
      console.log("HEROIS FAVORITOS", this.heroisFavoritos);
      this.heroisFavoritos.forEach(heroiFiltrado => {
        if(heroiFiltrado.id == this.id){
          this.isFavorite = true;
        }
      });
    }
  }

  getHero(){
    this.marvelProvider.getUniqueHero(this.id)
    .then((data:any) => {

      this.obj = data;

      this.hero = this.obj.data.results[0];

      this.img = this.hero.thumbnail.path +'.'+ this.hero.thumbnail.extension;

      var series = this.hero.series;

      for(var i = 0;i < series.items.length; i++){
        this.seriesArray.push(series.items[i].name)
      }
     
    })
    .catch((error:any) => {
      console.log(error);
    })
  }

  async favoritesList(hero){
    this.isFavorite = await true;
    console.log(hero);
    if(localStorage.getItem("heroisFavoritos")){
      await this.heroisFavoritos.push(hero);
      await localStorage.setItem("heroisFavoritos", JSON.stringify(this.heroisFavoritos));
    }else{
      await localStorage.setItem("heroisFavoritos", JSON.stringify([hero]));
    }  
  }

}
