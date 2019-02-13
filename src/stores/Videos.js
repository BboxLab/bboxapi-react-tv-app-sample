import { get, delay, compact, concat } from 'lodash'
import { action, computed, observable } from 'mobx'
import { Dialogflow_V2 } from 'react-native-dialogflow-text'

//Helpers
import formatHelper from '../helpers/format'

// Service
import apiCloudService from '../services/api-cloud'

class VideosStore {
  @observable _search = ''
  @observable _actor = ''
  @observable _title = ''
  @observable _category = ''
  @observable _botResponse = ''
  @observable _searchTextResults = ''
  @observable _vodResults = ''
  @observable _liveResults = ''
  @observable _liveRecommandation = ''
  @observable _vodRecommandation = ''
  @observable _voiceState = false
  @observable _globalSearch = []

  @computed get liveRecommandation () {
    return this._liveRecommandation
  }

  @computed get live () {
    return this._liveResults
  }

  @computed get vod () {
    return this._vodResults
  }

  @computed get actor () {
    return this._actor
  }

  @computed get title () {
    return this._title
  }

  @computed get category () {
    return this._category
  }

  @computed get botResponse () {
    return this._botResponse
  }

  @computed get searchTextResults () {
    return this._searchTextResults
  }

  @computed get search () {
    return this._search
  }

  @computed get voiceState () {
    return this._voiceState
  }

  @action setActor (actor) {
    this._actor = actor
  }

  @action setTitle (tile) {
    this._title = tile
  }

  @action setCategory (category) {
    this._category = category
  }

  @action setVoiceState (state) {
    this._voiceState = state
  }

  @action setBotResponse (message) {
    this._botResponse = message
  }

  @action async setSearch (search) {
    this._search = search
    await this.senDialogFlowRequest(search)
  }

  @computed get globalSearch () {
    return this._globalSearch
  }

  /* Configurate DialogFLow */
  async configurateDialogFlow () {
    Dialogflow_V2.setConfiguration(
      "dialogflow-vpaqgi@hackathon2018-acostructibles.iam.gserviceaccount.com",
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCcn7RuObetOw72\nydHm+gWLfwpghT6ZPiZz2Ur7nzUkekNDXtPHkZ0WDXA8cI0uCDm25NKbEcWGXIXI\nHx4hm4QNzVjAH4sp1NQ7YT5A/qghvpNqH2/Jaiyvk48S5fFvCITxP4vQk90aMiHM\n0PdcEi4IDhzGOFH99XCDnp8vRChFwJgimHVB5VkGYKCJLYwz0rFLlf1qr7xr/zpu\n4qqBUD6SAFKOWDWSgkEApZWGSUxwDNkJN/644l63j55647A9Fk7mBw2KhGFU9uSU\nOglww/e8A8kf8tpMA9iMnmq+HEAhcEhz7Y96tPoy7C4qS9Nb3RcnXyIIQurrVVcy\naqtH/cvLAgMBAAECggEASIUmHTd6VaqX1itClolD0gBjxKdNgdUmJtQBBRsFlztJ\nM8OPmcNRkeltA381z4+dcZLn9Uc4R2tFwpCt+e+xKFbhdivk2tyh3FC9a4i+Psmo\nJiYiM4eG41EWmTCBJuEx9SZwTYZ5hOybe+Nx9V6xk6c9KYbgaA+iJj9nA5KydwDp\njtvDqilkUTxTtYS9EPgPPdImnIKZzU1oDfHXkGnJvAwzqi6TmH/abYHcoRF1kFSL\n5MUnDwEC+MzzgbQ2U1C5B3RHr1yEbojkihhN9ymPURRA2wCLfLJVzukfzQmrnkYJ\n7whAFM0oZSon+BwqQY4P9CyLYroj2e5Y2OTo0Z5i0QKBgQDRuTUwO4tPSOqxvKP5\nfm4gv5rq+kDP2tQhtrLsnsnLPm3jSIkR6AVwcczB5eWIHNcVenJLm/CmtKs2d3cv\nFcwN7d3Y/zFK6JWjh8a8Y2bYVVdTjU+SDG/CVWf1DZo+MFInC5Cl8DImB8tYO0IB\nx7cEbQqQxQLVJGil21GJiv1a6QKBgQC/LwXKdEbD9UDGqzF8DRQugD4WIxzYM96P\nLeQOJVRUP5qR12r8Ob2oJR7hdEiuVVXE9sIF2umewSpf4A+poGBHMaKNUpawhUoj\nUbSW0L6RBkANnCRlWgLM/INvYt1Mw5b8xs5SGa6G+TS4DNFCLjoWlvYKz5NYvEji\n/GSY2J7YkwKBgQCZBxc0Vn5UH9SAVDEhv4sEAks74dag0/+tie4MkeCUmLz99tNt\naWtunNrXMLTHGKQoW+xCF0sFmRbE627fwHvgPgx+ZdbF3egyJsRweed1OvA5WwcQ\nflqd5kuwl3hQoFmRe/LT4ev1rAJIIxUKz3tPk3D+KYLjm2lwfBOG1RAA4QKBgGeQ\n44QuxP72Zqa4qk/XDe26zudTEhcU0iWh6H65Pht9cRA8L9p+tPzXTwk24wB9fb77\nJVPiqNe1MG1LhXCQTleCzdncuYDaU7UaV8ezQOhzCFPXF+hHgGjnCZRXbCZfdfVt\nBOt4uhCoAyUI3HsLa7A9CwAEPn+9T4aWzy/1eOc9AoGBAImYjry9gUfO7VTHnt5i\nsifJHp2NqCk1cROXwsZHoWmBy/7kfObY1cpY2FFIoz8B/issQdIgZOa/AWUKXrHm\n7Xo2h7nFcxqZBNYdPWBhByPAP9ZzfKtI9i/20wWBkdbEFQWRisby3E9aiUH5uq7S\nrBnk1AgKT2n64dR8Mb9wYoMq\n-----END PRIVATE KEY-----\n",
      Dialogflow_V2.LANG_FRENCH,
      "hackathon2018-acostructibles"
    )
  }

  async senDialogFlowRequest (text) {
    console.log(`recherche de ${text}`)
    Dialogflow_V2.requestQuery(
      text,
      result => {
        console.log({ result })
        this._search = ''
        delay(() => { 
          this._botResponse = get(result, 'queryResult.fulfillmentText')
        }, 50000)
        this._actor = get(result, 'queryResult.parameters.actor')
        this._category = get(result, 'queryResult.parameters.genres')
        this.searchVod()
      },
      error => console.log(error)
    );
  }

  @action searchVod = async () => {
    const params = apiCloudService.getSearchVodParams(this._actor, this._category)
    let results = await apiCloudService.vod(params)
    results = JSON.parse(JSON.stringify(results.data))
    this._vodResults = results
    console.log({results})
    return this._vodResults
  }

  @action setGlobalSearch = async () => {

    const searchVod = await this.searchVod()

    const searchLive = await this.searchLive()
console.log({ searchLive })
    const formatedLive = formatHelper.live(searchLive) || {}

    this._globalSearch = compact(concat(JSON.parse(JSON.stringify(searchVod)), JSON.parse(JSON.stringify(formatedLive))))
  }

  @action searchLive = async () => {
    const params = apiCloudService.getSearchLiveParams(this._actor, this._category)
    let results = await apiCloudService.live(params)
    results = JSON.parse(JSON.stringify(results.data))
    this._liveResults = results
    return this._liveResults
  }

  @action setLiveRecommandation = async (search) => {
    this._liveRecommandation = await apiCloudService.liveRecommandation(search)
    return this._liveRecommandation
  }

  @action setVodRecommandation = async (search) => {
    this._vodRecommandation = await apiCloudService.vodRecommandation(search)
    return this._vodRecommandation
  }
}

const observableVideosStore = new VideosStore()
export default observableVideosStore