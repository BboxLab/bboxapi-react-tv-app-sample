import {
    get,
    extend
} from 'lodash'
import axios from 'axios'

// helpers
import urlHelper from '../helpers/url'

// Stores
import ApiStore from '../stores/ApiStore'

// Constantes
const ENDPOINT = 'https://api.bbox.fr/v1.3'
const appId = 'xxxxxxxx'
const appSecret = 'xxxxxxxxxxx'

const apiCloud = {
    /**
     * hello
     * @param {String} query 
     */
    async hello(query) {
        const url = `${ENDPOINT}/hello?name=${query}`
        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            })

            return get(res, '_bodyText', res)
        } catch (e) {
            throw Error(e)
        }
    },

    /**
     * token - get Token from Bbox API
     *
     */
    async token() {
        const url = `${ENDPOINT}/security/token`
        try {
            const options = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    appId,
                    appSecret
                })
            }
            const res = await fetch(url, options)
            return get(res, 'headers.map[\'x-token\']', res)
        } catch (e) {
            throw Error
        }
    },

    /**
     * vod - Get the list of all VODs, optionaly by genre.
     * @param {Object} params // { title, actor, genres }
     */
    async vod(params) {
        console.log({
            params
        })
        const token = await ApiStore.setToken()
        console.log({
            token
        })
        try {
            return axios.get(urlHelper.buildUrl({
                url: ENDPOINT,
                path: 'media/vod',
                query: urlHelper.buildQuery(extend({}, params, {
                    limit: 20
                }))
            }), {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-token': token
                }
            })
        } catch (e) {
            throw Error(e)
        }
    },

    /**
     * live - Get the list of all programs, optionaly by channels (EPG: Electronic Program Guide).
     *       Some parameters can be added in the URL to have more details:
     * @param {Object} params search by 
     * period {0: now, 1: for day; Use "startTime/endTime" instead to be more specific}
     * startTime (IsoString UTC) ex 2016-05-31T22:25:00.000Z
     * endTime (IsoString UTC) ex 2016-06-31T22:25:00.000Z
     * title
     * actor
     * genres            
     */
    async live(params) {
        const token = await ApiStore.setToken()
        try {
            return axios.get(urlHelper.buildUrl({
                url: ENDPOINT,
                path: 'media/live',
                query: urlHelper.buildQuery(extend({}, params, {
                    limit: 10,
                    page: 1
                }))
            }), {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-token': token
                }
            })
        } catch (e) {
            throw Error(e)
        }
    },


    /*
        Get some Spideo recommandations for a specified user (Only for some partners)
        params :
        user: {string}
        moment: now, tonight or week or a mix of them, coma separated (ex. "now,tonight")
        limit: {int}
    */

    /**
     * Get some Spideo recommandations for a specified user (Only for some partners)
     * @param {String} params 
     *  user: {string}
     *  moment: now, tonight or week or a mix of them, coma separated (ex. "now,tonight")
     *  limit: {int}
     */
    async liveRecommandation(params) {
        console.log({
            params
        })
        const token = await ApiStore.setToken()
        console.log({
            token
        })
        try {
            return axios.get(urlHelper.buildUrl({
                url: ENDPOINT,
                path: '/media/live/recommendations',
                query: urlHelper.buildQuery(params)
            }), {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-token': token
                }
            })
        } catch (e) {
            throw Error(e)
        }
    },

    /**
     * Get some Spideo recommandations for a specified user (Only for some partners)
     *
     * @param {String} params
     * params :
     * user: {string}
     * limit: {int}
     */
    async vodRecommandation(params) {
        console.log({
            params
        })
        const token = await ApiStore.setToken()
        console.log({
            token
        })
        try {
            return axios.get(urlHelper.buildUrl({
                url: ENDPOINT,
                path: '/media/vod/recommendations',
                query: urlHelper.buildQuery(params)
            }), {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-token': token
                }
            })
        } catch (e) {
            throw Error(e)
        }
    },

    getSearchVodParams (actor, genres) {
        let params = {}
        if (actor) params = extend({}, params, {
            actor
        })
        if (genres) params = extend({}, params, {
            genres
        })

        return params
    },

    getSearchLiveParams (character, genres) {
        let params = {}
        if (character) params = extend({}, params, {
            character
        })
        if (genres) params = extend({}, params, {
            genres
        })

        return params
    }
}

export default apiCloud
module.exports = apiCloud