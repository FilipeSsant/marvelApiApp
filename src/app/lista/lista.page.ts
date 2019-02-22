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
  allHeros = [];
  favoriteHeroes = [];
  filtredHeroes = [];
  heroi : string = "";
  searchTerm : string = '';
  obj : any;
  offset: number;
  limit: number;
  modificador: number;
  @ViewChild(IonItemSliding) itemSlider : IonItemSliding;

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

  ngOnInit() {
    this.offset = 0;
    this.limit = 10;
    this.getHero();
    this.getStorageFavoriteHeroes();
  }

  filtro(){
    this.filtrarHerois(this.heroi);
  }

  filtrarHerois(heroi){

    //FILTRAR NA API
    if(heroi.length >= 3){

      this.offset = 0;

      this.herosList = [];
      this.filtredHeroes = [];
      this.marvelProvider.getFilterHero(heroi, this.offset, this.limit)
      .then((data:any) => {

        var results = data.data.results;
        results.forEach(obj => {
          let img = obj.thumbnail.path +'.'+ obj.thumbnail.extension
          this.filtredHeroes.push({id:obj.id, name: obj.name, img: img});
        });
        console.log("HEROIS ADICIONADOS NO FILTRO: ",this.filtredHeroes);
        this.herosList = this.herosList.concat(this.filtredHeroes);
        this.getHero();
      })
      .catch((error:any) => {
        console.log(error);
      })
    }else if(heroi.length == 0){
      this.herosList = [];
      this.filtredHeroes = [];
      this.offset = 0;
      this.herosList = this.herosList.concat(this.allHeros);
    }  

    //FILTRAR NUMA LISTA LOCAL
    // this.filtredHeroes = this.heroes;
    // console.log(heroi)
    // return this.heroes.filter((item) => {
    //   console.log(item.name)
    //   return item.name.toLowerCase().includes(heroi.toLowerCase());
    // })
  }

  async loadingCreateShow(){
    const loader = await this.loading.create({
      message: 'Carregando heróis...'
    });
    await loader.present();
  }

  async loadingDismiss(){
    await this.loading.dismiss();
  }

  getStorageFavoriteHeroes(){
    this.storage.length()
    .then(tamanho => {
      if(tamanho != 0){
        this.storage.get('heroisFavoritos')
        .then((dados) => {
          //limpa a array local de herois e popula com os que estão no storage
          this.favoriteHeroes = [];
          dados.forEach(heroi => {
            this.favoriteHeroes.push(heroi);
          });
        }),
        (err) =>{
          console.log(err);
        };
      }  
    })
  }
  

  favoritesList(hero:any){
      //Armazena os Id's dos herois da lista
      var idArray = [];
      //Se a lista estiver vazia não vai haver verificação de id's iguais
      if(this.favoriteHeroes.length == 0){
        console.log(hero.id);
        console.log(`Tamanho da Lista > ${this.favoriteHeroes.length}`);
        this.favoriteHeroes.push(hero);
      }else{
        //Se a lista ja estiver populada ele verifica se há heróis repetidos
        console.log(`Tamanho da Lista > ${this.favoriteHeroes.length}`);
        console.log(this.favoriteHeroes);
        //Percorre a lista de herois pegando os id's
        for(var i = 0; i < this.favoriteHeroes.length; i++){
          idArray.push(this.favoriteHeroes[i].id);
        } 
        //E verifica se há id's iguais
        //com o hero.id pegado da lista original
        var exists = idArray.includes(hero.id);
        if(exists == true){
          //se existe na array criada ele mostra um alerta
          this.openAlert();
          console.log("Existe? -> "+exists);
        }else{
          //se ainda não existe ele adiciona na lista
          this.favoriteHeroes.push(hero);
          console.log("Existe? -> "+exists);
        }
      }
      this.storage.set('heroisFavoritos',this.favoriteHeroes);
  }

  async openAlert(){

    const alert = await this.alertCtrl.create({
      header: "Herói Repetido",
      message: "O herói já foi adicionado a lista de favoritos",
      buttons: ['Ok']
    });
    return alert.present();
  }

  getHero(){
    console.log("TAMANHO DA LISTA DE HEROIS FILTRADOS: ",this.filtredHeroes.length);
    if(this.filtredHeroes.length == 0){
      this.marvelProvider.getAllHeros(this.offset, this.limit)
      .then((data:any) => {

        this.herosList = [];
        this.obj = data.data.results;
        this.offset = data.data.offset;
        for(let i = 0; i < this.obj.length; i++){
          let img = this.obj[i].thumbnail.path +'.'+ this.obj[i].thumbnail.extension
          this.allHeros.push({id:this.obj[i].id, name: this.obj[i].name, img: img});
        }
        
        this.herosList = this.herosList.concat(this.allHeros);
        this.infiniteScroll.complete();
        console.log("TODOS: ",this.herosList);
      })
      .catch((error:any) => {
        console.log(error.error);
      })
    }else{
      if(this.offset != 0){
        this.loadMoreFiltredHeroes();
      }
    }
  }

  loadMoreFiltredHeroes(){
    console.log("OFFSET DA PESQUISA",this.offset);
  
    this.loadingCreateShow();
    this.marvelProvider.getFilterHero(this.heroi, this.offset, this.limit)
      .then((data:any) => {

        this.herosList = [];

        var results = data.data.results;
        results.forEach(obj => {
          let img = obj.thumbnail.path +'.'+ obj.thumbnail.extension
          this.filtredHeroes.push({id:obj.id, name: obj.name, img: img});
        });
        this.herosList = this.herosList.concat(this.filtredHeroes);
        this.loadingDismiss();
      })
      .catch((error:any) => {
        this.loading.dismiss();
        console.log(error);
      })

    console.log("FILTRADOS: ",this.herosList);
  }

  heroDetails(id:number){
    this.navCtrl.navigateForward(`/hero-details/${id}`);
  }
  
  loadData(event){
    if(this.infiniteScroll.complete){
        console.log("OFFSET",this.offset = this.limit + this.offset);
        this.getHero();
    }
  }


}