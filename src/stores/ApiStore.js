import { action, computed, observable } from 'mobx'

// Services
import apiCloudService from '../services/api-cloud'

class ApiStore {
  @observable _token = ''

  @computed get token () {
    return this._token
  }

  /* Calling Bbox Cloud API to set token */
  @action setToken = async () => {
    if (this._token) {
      return this._token
    }

    this._token = await apiCloudService.token()
    return this._token
  }
}

const observableApiStore = new ApiStore()
export default observableApiStore