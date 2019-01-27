const { getCategoriesByIdsLoader } = require('./types/category');

const loaders = () => ({
    getCategoriesByIdsLoader: getCategoriesByIdsLoader()
});

module.exports = loaders;