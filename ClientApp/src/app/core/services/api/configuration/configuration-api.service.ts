import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ConfigurationService {
  private configuration: IServerConfiguration;

  constructor(private http: HttpClient) { }

  loadConfig() {
    return this.http.get<IServerConfiguration>('/api/Configuration/')
      .toPromise()
      .then(result => {
        this.configuration = (result) as IServerConfiguration;
      }, error => console.error(error));
  }

  get apiAddress() {
    return this.configuration.apiServerAddress;
  }
}

export interface IServerConfiguration {
  apiServerAddress: string;
}
