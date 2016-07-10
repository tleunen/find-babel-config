/* eslint-env mocha */
/*
eslint import/no-extraneous-dependencies: [2, {
  devDependencies: true,
  optionalDependencies: false,
}]
*/
const path = require('path');
const expect = require('chai').expect;

const findBabelConfig = require('../src');

describe('find-babel-config', () => {
    describe('babelrc', () => {
        it('should return the config in the specified directory', () => {
            const c = findBabelConfig('test/data/babelrc');
            expect(c.file).to.equal(path.join(process.cwd(), 'test/data/babelrc/.babelrc'));
            expect(c.config).to.eql({ presets: ['fake-preset-babelrc'] });
        });

        it('should return the config in the parent directory', () => {
            const c = findBabelConfig(path.join(process.cwd(), 'test/data/babelrc/dir1'));
            expect(c.file).to.equal(path.join(process.cwd(), 'test/data/babelrc/.babelrc'));
            expect(c.config).to.eql({ presets: ['fake-preset-babelrc'] });
        });

        it('should return the first config found in the parents', () => {
            const c = findBabelConfig('test/data/babelrc/dir1/dir2/dir3/dir4/dir5');
            expect(c.file).to.equal(path.join(process.cwd(), 'test/data/babelrc/dir1/dir2/dir3/.babelrc'));
            expect(c.config).to.eql({ presets: ['fake-preset-dir3-babelrc'] });
        });
    });

    describe('package.json', () => {
        it('should return the config in the specified directory', () => {
            const c = findBabelConfig('test/data/packagejson');
            expect(c.file).to.equal(path.join(process.cwd(), 'test/data/packagejson/package.json'));
            expect(c.config).to.eql({ presets: ['fake-preset-packagejson'] });
        });

        it('should return the config in the parent directory', () => {
            const c = findBabelConfig(path.join(process.cwd(), 'test/data/packagejson/dir1'));
            expect(c.file).to.equal(path.join(process.cwd(), 'test/data/packagejson/package.json'));
            expect(c.config).to.eql({ presets: ['fake-preset-packagejson'] });
        });

        it('should not return the package.json if no babel config is found inside', () => {
            const c = findBabelConfig('test/data/packagejson/dir1/dir2/dir3/dir4/dir5');
            expect(c.file).to.equal(path.join(process.cwd(), 'test/data/packagejson/dir1/dir2/dir3/package.json'));
            expect(c.config).to.eql({ presets: ['fake-preset-dir3-packagejson'] });
        });

        it('should return the first config found in the parents', () => {
            const c = findBabelConfig('test/data/packagejson/dir1/dir2/dir3/dir4/dir5');
            expect(c.file).to.equal(path.join(process.cwd(), 'test/data/packagejson/dir1/dir2/dir3/package.json'));
            expect(c.config).to.eql({ presets: ['fake-preset-dir3-packagejson'] });
        });
    });

    describe('both files', () => {
        it('should return the first babel config in package.json', () => {
            const c = findBabelConfig('test/data/both/dir1/dir2/dir3');
            expect(c.file).to.equal(path.join(process.cwd(), 'test/data/both/dir1/package.json'));
            expect(c.config).to.eql({ presets: ['fake-preset-packagejson'] });
        });

        it('should return the first babel config in babelrc', () => {
            const c = findBabelConfig('test/data/both/dir1/dir2/dir3/dir4/dir5');
            expect(c.file).to.equal(path.join(process.cwd(), 'test/data/both/dir1/dir2/dir3/dir4/.babelrc'));
            expect(c.config).to.eql({ presets: ['fake-preset-dir5-babelrc'] });
        });
    });

    describe('no config found...', () => {
        it('should return null when the path is empty', () => {
            const c = findBabelConfig('');
            expect(c).to.equal(null);
        });

        it('should return null when no config is found until / is reached', () => {
            const c = findBabelConfig('/sth/else/that/doesnt/exist');
            expect(c).to.equal(null);
        });

        it('should return null when depth is found without finding a babelrc file', () => {
            const c = findBabelConfig('test/data/babelrc/dir1/dir2/dir3/dir4/dir5', 1);
            expect(c).to.equal(null);
        });

        it('should return null when depth is found without finding package.json', () => {
            const c = findBabelConfig('test/data/packagejson/dir1/dir2/dir3/dir4/dir5/dir6/dir7/dir8', 3);
            expect(c).to.equal(null);
        });
    });
});
