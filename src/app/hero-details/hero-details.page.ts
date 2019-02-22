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

  constructor(private marvelProvider: MarvelApiService,
    private activatedRoute: ActivatedRoute) { 
    }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getHero();
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

}
