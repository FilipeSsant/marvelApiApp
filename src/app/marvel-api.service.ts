import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class MarvelApiService {

  apikey = '8dbeadfeb883d20d14ede25776f311b9';
  timestamp = Number(new Date());
  hash = Md5.hashStr(this.timestamp + '32ab9c5768e14097e2630849d4b43f706786a8bd8dbeadfeb883d20d14ede25776f311b9');
  
  constructor(private http: HttpClient) { }

  getAllHeros(offset:number, limit:number){

    return new Promise((resolve, reject) => {

      var url = 'https://gateway.marvel.com:443/v1/public/characters?ts='+this.timestamp+'&orderBy=name&offset='+offset+'&limit='+limit+'&apikey='+this.apikey+'&hash='+this.hash;
      this.http.get(url)
      .subscribe((response:any) => {
        resolve(response);
      }),
      (error) => {
        reject(error.error);
      }
    });
  }

  getUniqueHero(id:number){
    return new Promise((resolve, reject) => {

      var url = 'https://gateway.marvel.com:443/v1/public/characters/'+id+'?ts='+this.timestamp+'&orderBy=name&apikey='+this.apikey+'&hash='+this.hash;

      this.http.get(url)
      .subscribe((response:any) => {
        resolve(response);
      }),
      (error) => {
        reject(error.error);
      }

    })
  }

  getFilterHero(stringFiltrada:string, offset:number, limit:number){
    return new Promise((resolve, reject) => {

      var url = 'https://gateway.marvel.com:443/v1/public/characters?nameStartsWith='+stringFiltrada+'&ts='+this.timestamp+'&orderBy=name&offset='+offset+'&limit='+limit+'&apikey='+this.apikey+'&hash='+this.hash;

      this.http.get(url)
      .subscribe((response:any) => {
        resolve(response);
      }),
      (error) => {
        reject(error.error);
      }

    })
  }

}
