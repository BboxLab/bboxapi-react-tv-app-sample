import { map, extend, get, join } from 'lodash'

const format = {
    live (data) {
      return map(data, item => {
          return extend({}, item, {
              type: 'live',
              title: get(item, 'programInfo.longTitle'),
              coverUrlPortrait: '',
              coverUrlLandscape: '',
              summaryShort: get(item, 'programInfo.shortSummary'),
              summaryLong: get(item, 'programInfo.longSummary'),
              genres: join(get(item, 'programInfo.genre')),
              publicRating: get(item, 'programInfo.publicRank'),
              actors: get(item, 'programInfo.characterDisplay'),
              languages: join(map(get(item, 'audioInfo'), lang => lang.language), ', '),
              year: get(item, 'programInfo.productionDate')
          })
      })      
    }
}

export default format  