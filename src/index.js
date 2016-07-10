const path = require('path');
const fs = require('fs');
const JSON5 = require('json5');

const INFINITY = 1 / 0;
const BABELRC_FILENAME = '.babelrc';
const PACKAGE_FILENAME = 'package.json';

module.exports = function findBabelConfig(start, depth = INFINITY) {
    if (!start) {
        return null;
    }

    let dir = path.isAbsolute(start)
        ? start
        : path.join(process.cwd(), start);
    let loopLeft = depth;

    // eslint-disable-next-line no-cond-assign
    do {
        const babelrc = path.join(dir, BABELRC_FILENAME);
        if (fs.existsSync(babelrc)) {
            const babelrcContent = fs.readFileSync(babelrc, 'utf8');
            return {
                file: babelrc,
                config: JSON5.parse(babelrcContent)
            };
        }

        const packageFile = path.join(dir, PACKAGE_FILENAME);
        if (fs.existsSync(packageFile)) {
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
            return null;
        }
    } while (dir !== (dir = path.dirname(dir)));

    return null;
};
