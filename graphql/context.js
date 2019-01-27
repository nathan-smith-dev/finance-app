const { getUserFromRequest } = require('./context.helper');
const loaders = require('./loaders');

const context = async ({ req }) => {
    const user = await getUserFromRequest(req);

    return { user, loaders: loaders() };
};

module.exports = context;