const path = require('path');
const fs = require('fs');
const JSON5 = require('json5');
const pathExists = require('path-exists');

const INFINITY = 1 / 0;
const BABELRC_FILENAME = '.babelrc';
const PACKAGE_FILENAME = 'package.json';

const nullConf = { file: null, config: null };

function asyncFind(resolve, dir, depth) {
    if (!depth) resolve(nullConf);

    const babelrc = path.join(dir, BABELRC_FILENAME);
    return pathExists(babelrc).then(exists => {
        if (exists) {
            fs.readFile(babelrc, 'utf8', (err, data) => {
                if (!err) {
                    resolve({
                        file: babelrc,
                        config: JSON5.parse(data)
                    });
                }
            });
        }
        return exists;
    }).then(exists => {
        if (!exists) {
            const packageFile = path.join(dir, PACKAGE_FILENAME);
            return pathExists(packageFile).then(ex => {
                if (ex) {
                    fs.readFile(packageFile, 'utf8', (err, data) => {
                        const packageJson = JSON.parse(data);
                        if (packageJson.babel) {
                            resolve({
                                file: packageFile,
                                config: packageJson.babel
                            });
                        }
                    });
                }
            });
        }
        return exists;
    }).then(exists => {
        if (!exists) {
            const nextDir = path.dirname(dir);
            if (nextDir === dir) {
                resolve(nullConf);
            } else {
                asyncFind(resolve, nextDir, depth - 1);
            }
        }
    });
}

module.exports = function findBabelConfig(start, depth = INFINITY) {
    if (!start) {
        return new Promise(resolve => resolve(nullConf));
    }

    const dir = path.isAbsolute(start)
        ? start
        : path.join(process.cwd(), start);

    return new Promise(resolve => {
        asyncFind(resolve, dir, depth);
    });
};


module.exports.sync = function findBabelConfigSync(start, depth = INFINITY) {
    if (!start) {
        return nullConf;
    }

    let dir = path.isAbsolute(start)
        ? start
        : path.join(process.cwd(), start);
    let loopLeft = depth;

    // eslint-disable-next-line no-cond-assign
    do {
        const babelrc = path.join(dir, BABELRC_FILENAME);
        if (pathExists.sync(babelrc)) {
            const babelrcContent = fs.readFileSync(babelrc, 'utf8');
            return {
                file: babelrc,
                config: JSON5.parse(babelrcContent)
            };
        }

        const packageFile = path.join(dir, PACKAGE_FILENAME);
        if (pathExists.sync(packageFile)) {
            const packageContent = fs.readFileSync(packageFile, 'utf8');
            const packageJson = JSON.parse(packageContent);
            if (packageJson.babel) {
                return {
                    file: packageFile,
                    config: packageJson.babel
                };
            }
        }

        if (loopLeft-- === 0) {
            return nullConf;
        }
    } while (dir !== (dir = path.dirname(dir)));

    return nullConf;
};
