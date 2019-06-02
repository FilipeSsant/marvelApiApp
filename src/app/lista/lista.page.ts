import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController, IonInfiniteScroll, AlertController, ModalController, IonItemSliding, LoadingController } from '@ionic/angular';
import { MarvelApiService } from '../marvel-api.service';
import { HeroDetailsPage } from '../hero-details/hero-details.page';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit {
  herosList = [];
  favoriteHeroes = [];
  filtredHeroes = [];
  searchTerm: string = '';
  obj: any;
  offset: number;
  dataIsLoading: boolean;
  limit: number;
  modificador: number;
  @ViewChild(IonItemSliding) itemSlider: IonItemSliding;

  page: number;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private navCtrl: NavController,
    private marvelProvider: MarvelApiService,
    private alertCtrl: AlertController,
    private storage: Storage,
    private loading: LoadingController
  ) {

  }

  async ngOnInit() {
    this.offset = 0;
    this.limit = 10;
    await this.getHero();
  }

  filtro(term) {
    //FILTRAR NA API
    this.dataIsLoading = true;
    this.offset = 0;
    this.limit = 10;
    if (term != '') {


      this.filtredHeroes = [];
      this.marvelProvider.getFilterHero(term, this.offset, this.limit)
        .then((data: any) => {

          var results = data.data.results;
          results.forEach(obj => {
            let img = obj.thumbnail.path + '.' + obj.thumbnail.extension
            this.filtredHeroes.push({ id: obj.id, name: obj.name, img: img });
          });


          this.dataIsLoading = false;

        })
        .catch((error: any) => {
          console.log(error);
          this.dataIsLoading = false;
        })
    } else {
      this.infiniteScroll.disabled = false;
      this.filtredHeroes = [];
      this.getHero();
    }

    //FILTRAR NUMA LISTA LOCAL
    // this.filtredHeroes = this.heroes;
    // console.log(heroi)
    // return this.heroes.filter((item) => {
    //   console.log(item.name)
    //   return item.name.toLowerCase().includes(heroi.toLowerCase());
    // })
  }


  async openAlert() {

    const alert = await this.alertCtrl.create({
      header: "Herói Repetido",
      message: "O herói já foi adicionado a lista de favoritos",
      buttons: ['Ok']
    });
    return alert.present();
  }

  getHero() {
    if (!this.infiniteScroll.complete) {
      this.dataIsLoading = true;
    }
    this.marvelProvider.getAllHeros(this.offset, this.limit)
      .then((data: any) => {

        this.herosList = [];
        this.obj = data.data.results;
        this.offset = data.data.offset;
        for (let i = 0; i < this.obj.length; i++) {
          let img = this.obj[i].thumbnail.path + '.' + this.obj[i].thumbnail.extension
          this.herosList.push({ id: this.obj[i].id, name: this.obj[i].name, img: img });
        }

        this.filtredHeroes.push(...this.herosList);
        this.infiniteScroll.complete();
        this.dataIsLoading = false;
        console.log("TODOS: ", this.herosList);
        console.log("TODOS 2: ", this.filtredHeroes);

      })
      .catch((error: any) => {
        console.log(error.error);
        this.dataIsLoading = false;
      })
  }

  loadMoreFiltredHeroes() {
    console.log("OFFSET DA PESQUISA", this.offset);

    this.marvelProvider.getFilterHero(this.searchTerm, this.offset, this.limit)
      .then((obj: any) => {

        let count = obj.data.count;
        if (count == 0) {
          this.infiniteScroll.disabled = true;
        }else{
          var results = obj.data.results;
          results.forEach(obj => {
            let img = obj.thumbnail.path + '.' + obj.thumbnail.extension
            this.filtredHeroes.push({ id: obj.id, name: obj.name, img: img });
          });
          this.herosList = this.herosList.concat(this.filtredHeroes);
        }



      })
      .catch((error: any) => {
      })

  }

  heroDetails(id: number) {
    this.navCtrl.navigateForward(`/hero-details/${id}`);
  }

  loadData(event) {
    if (this.infiniteScroll.complete) {
      console.log("OFFSET", this.offset = this.limit + this.offset);
      if (this.searchTerm == '') {
        this.getHero();
      } else {
        this.loadMoreFiltredHeroes();
      }
    }
  }


}