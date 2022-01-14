import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Gif, SearchGIFResponse} from "../interfaces/gifs.interface";

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apikey: string = 'VhTDU5BG1hiTb90M64dw9GquMQlpnbnV';
  private servicioUrl: string = "https://api.giphy.com/v1/gifs"
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial(): string[] {
    return [...this._historial]; // para hacer una referencia del de arriba y si se modifica el get no modificar la propiedad
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem("historial")!) || [];
    this.resultados = JSON.parse(localStorage.getItem("resultado")!) || [];
    // if (localStorage.getItem("historial")) {
    //   this._historial = JSON.parse(localStorage.getItem("historial")!);
    // }
  }

  buscarGifs(query: string) {
    query = query.trim().toLowerCase();
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.slice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));

    }
    const params = new HttpParams()
      .set("api_key", this.apikey)
      .set("limit", "10")
      .set("q", query);
    this.http.get<SearchGIFResponse>(`${this.servicioUrl}/search?`, {params})
      .subscribe((respuesta) => {
        this.resultados = respuesta.data;
        localStorage.setItem('resultado', JSON.stringify(this.resultados));
      })
  }
}
