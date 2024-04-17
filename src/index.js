const path = require('path');
const fs = require('fs');
const fsAsync = require('fs').promises;
const JSON5 = require('json5');
const pathExists = require('path-exists');

const INFINITY = 1 / 0;

const babelFiles= [
    '.babelrc',
    '.babelrc.js',
    'babel.config.js',
    'babel.config.json',
    'babel.config.cjs',
    '.babelrc.cjs',
    '.babelrc.json',
    'babel.config.mjs',
    '.babelrc.mjs',
    // always at the end
    'package.json',
];

const nullConf = { file: null, config: null };

function getBabelJsConfig(file) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const configModule = require(file);

    if (typeof configModule === 'function') {
        return configModule();
    }

    // eslint-disable-next-line no-underscore-dangle
    return configModule && configModule.__esModule ? configModule.default : configModule;
}

async function asyncFind(dir, depth) {
    if (depth < 0) {
        return nullConf;
    }

    for (const babelFile of babelFiles) {
        const file = path.join(dir, babelFile);

        const exists = await pathExists(file)
        if (exists) {
            let config;
            if (file.endsWith('js')) {
                config = getBabelJsConfig(file);
            } else if (babelFile === 'package.json') {
                const content = await fsAsync.readFile(file, 'utf8');
                config = JSON5.parse(content).babel;
            } else {
                const content = await fsAsync.readFile(file, 'utf8');
                config = JSON5.parse(content);
            }

            if (config != null) {
                return {
                    file,
                    config,
                };
            }
        }
    }

    const nextDir = path.dirname(dir);
    if (nextDir === dir) {
        return nullConf;
    }

    return asyncFind(nextDir, depth - 1);
}

module.exports = function findBabelConfig(start, depth = INFINITY) {
    if (!start) {
        return new Promise((resolve) => resolve(nullConf));
    }

    const dir = path.isAbsolute(start)
        ? start
        : path.join(process.cwd(), start);

    return new Promise((resolve) => {
        resolve(asyncFind(dir, depth));
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

    do {
        for (const babelFile of babelFiles) {
            const file = path.join(dir, babelFile);
            if (pathExists.sync(file)) {
                let config;
                if (file.endsWith('js')) {
                    config = getBabelJsConfig(file);
                } else if (babelFile === 'package.json') {
                    const content = fs.readFileSync(file, 'utf8');
                    config = JSON5.parse(content).babel;
                } else {
                    const content = fs.readFileSync(file, 'utf8');
                    config = JSON5.parse(content);
                }

                if (config != null) {
                    return {
                        file,
                        config,
                    };
                }
            }
        }

        if (loopLeft === 0) {
            return nullConf;
        }

        loopLeft -= 1;
    } while (dir !== (dir = path.dirname(dir)));

    return nullConf;
};
