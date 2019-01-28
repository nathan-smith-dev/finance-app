const { getCategoriesByIdsLoader } = require('./types/category');
const { getUsersByIdsLoader } = require('./types/user');

const loaders = () => ({
    getCategoriesByIdsLoader: getCategoriesByIdsLoader(),
    getUsersByIdsLoader: getUsersByIdsLoader()
});

module.exports = loaders;