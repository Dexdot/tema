const contentful = require('contentful')

// Get keys
const space = process.env.VUE_APP_SPACE_ID
const accessToken = process.env.VUE_APP_ACCESS_TOKEN

// Client instance
const client = contentful.createClient({ accessToken, space })

export const fetchCase = slug =>
  new Promise(resolve => {
    // Get black
    client
      .getEntries({
        content_type: 'case',
        'fields.slug': slug
      })
      .then(({ items }) => {
        resolve(items[0] ? items[0].fields : null)
      })
  })

export const fetchCases = (ctx, options) =>
  new Promise(resolve => {
    client
      .getEntries({
        content_type: 'case',
        ...options
      })
      .then(({ items }) => {
        ctx.$store.dispatch('cases/addCases', items)
        resolve(items)
      })
  })

export const getCases = ctx =>
  new Promise(resolve => {
    const isStoreContainsCases =
      ctx.$store.getters['cases/cases'] &&
      ctx.$store.getters['cases/cases'].length > 0

    if (isStoreContainsCases) {
      resolve(ctx.$store.getters['cases/cases'])
    } else {
      fetchCases(ctx).then(cases => {
        resolve(cases)
      })
    }
  })

export const getCase = (ctx, slug) =>
  new Promise(resolve => {
    const projectFromStore = ctx.$store.getters['cases/cases'].find(
      el => el.fields.slug === 'slug'
    )

    if (projectFromStore) {
      resolve(projectFromStore)
    } else {
      fetchCase(slug).then(project => {
        resolve(project)
      })
    }
  })
