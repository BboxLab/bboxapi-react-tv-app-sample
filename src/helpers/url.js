import _ from 'lodash'

const url = {
    /**
     * [concatPath concatenate strings adding separator and trailing slashes to form an URI]
     * @param  {[string or array of strings]} path      [the base path]
     * @param  {[string or array of strings]} trail     [the trail(s) to add to the path]
     * @return {[string]}                               [formed URI path]
     */
    concatPath (path, trail) {
        return _([path, trail])
        .flattenDeep()
        .join(path.slice(-1) === '/' ? '' : '/')
    },

    isAbsolute (path) {
        return path ? path.indexOf('http') === 0 || path.match(/^\/\//) : false
      },

    /**
     * [path takes a path and make it begin by root url config if not absolute path]
     * @param  {[string]} relativePath
     * @param  {[string]} root         [like /mon-compte/]
     * @return {[string]}              [complete and absolute URL]
     */
    path (relativePath, root) {
        if (this.isAbsolute(relativePath)) {
        return relativePath
        }

        return this.concatPath(root, relativePath)
    },

    /**
     * [buildUrl add query params to a relative path, joining conditionnally a subpath before query]
     * @param  {[object]} options [data mostly from route config]
     * @return {[string]}         [absolute URL with query params like contractId]
     */
    buildUrl (options) {
        let path = options.path || options.url || ''
        const querySymbol = (options.queryType === 'hash' ? '#' : '?')
        const subPath = _.get(options, 'subPath')

        // if exists, add subpath before queries, may contain dynamics
        if (subPath) {
        path = this.concatPath(path, subPath)
        }

        // test if path contains query ?
        path = [path, options.query].join(path.indexOf(querySymbol) === -1 ? querySymbol : '&')

        return this.path(path, options.url)
    },

    buildQuery (params) {
        return _.chain(params)
          .toPairs()
          .map(pair => (!_.isNull(pair[1]) ? pair.join('=') : null))
          .compact()
          .value()
          .join('&')
      }
}

export default url
module.exports = url   