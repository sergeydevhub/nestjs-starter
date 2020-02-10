const path = require('path');

const resolvePath = (dir = '') => path.resolve(process.cwd(), dir);

const paths = {};

paths.dotEnvDev = resolvePath('./configs/.env.dev');
paths.dotEnv = resolvePath('./configs/.env');
paths.public = resolvePath('../public');
paths.key = resolvePath('./configs/key.pem');
paths.cert = resolvePath('./configs/cert.pem');
paths.disk = '/some/disk/path';

module.exports = paths;