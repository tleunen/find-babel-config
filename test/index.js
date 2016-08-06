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
    describe('async', () => {
        describe('babelrc', () => {
            it('should return the config in the specified directory', () =>
                findBabelConfig('test/data/babelrc').then(({ file, config }) => {
                    expect(file).to.equal(path.join(process.cwd(), 'test/data/babelrc/.babelrc'));
                    expect(config).to.eql({ presets: ['fake-preset-babelrc'] });
                })
            );

            it('should return the config in the parent directory', () =>
                findBabelConfig(path.join(process.cwd(), 'test/data/babelrc/dir1')).then(({ file, config }) => {
                    expect(file).to.equal(path.join(process.cwd(), 'test/data/babelrc/.babelrc'));
                    expect(config).to.eql({ presets: ['fake-preset-babelrc'] });
                })
            );

            it('should return the first config found in the parents', () =>
                findBabelConfig('test/data/babelrc/dir1/dir2/dir3/dir4/dir5').then(({ file, config }) => {
                    expect(file).to.equal(path.join(process.cwd(), 'test/data/babelrc/dir1/dir2/dir3/.babelrc'));
                    expect(config).to.eql({ presets: ['fake-preset-dir3-babelrc'] });
                })
            );
        });

        describe('package.json', () => {
            it('should return the config in the specified directory', () =>
                findBabelConfig('test/data/packagejson').then(({ file, config }) => {
                    expect(file).to.equal(path.join(process.cwd(), 'test/data/packagejson/package.json'));
                    expect(config).to.eql({ presets: ['fake-preset-packagejson'] });
                })
            );

            it('should return the config in the parent directory', () =>
                findBabelConfig(path.join(process.cwd(), 'test/data/packagejson/dir1')).then(({ file, config }) => {
                    expect(file).to.equal(path.join(process.cwd(), 'test/data/packagejson/package.json'));
                    expect(config).to.eql({ presets: ['fake-preset-packagejson'] });
                })
            );

            it('should not return the package.json if no babel config is found inside', () =>
                findBabelConfig('test/data/packagejson/dir1/dir2/dir3/dir4/dir5').then(({ file, config }) => {
                    expect(file).to.equal(path.join(process.cwd(), 'test/data/packagejson/dir1/dir2/dir3/package.json'));
                    expect(config).to.eql({ presets: ['fake-preset-dir3-packagejson'] });
                })
            );

            it('should return the first config found in the parents', () =>
                findBabelConfig('test/data/packagejson/dir1/dir2/dir3/dir4/dir5').then(({ file, config }) => {
                    expect(file).to.equal(path.join(process.cwd(), 'test/data/packagejson/dir1/dir2/dir3/package.json'));
                    expect(config).to.eql({ presets: ['fake-preset-dir3-packagejson'] });
                })
            );
        });

        describe('both files', () => {
            it('should return the first babel config in package.json', () =>
                findBabelConfig('test/data/both/dir1/dir2/dir3').then(({ file, config }) => {
                    expect(file).to.equal(path.join(process.cwd(), 'test/data/both/dir1/package.json'));
                    expect(config).to.eql({ presets: ['fake-preset-packagejson'] });
                })
            );

            it('should return the first babel config in babelrc', () =>
                findBabelConfig('test/data/both/dir1/dir2/dir3/dir4/dir5').then(({ file, config }) => {
                    expect(file).to.equal(path.join(process.cwd(), 'test/data/both/dir1/dir2/dir3/dir4/.babelrc'));
                    expect(config).to.eql({ presets: ['fake-preset-dir5-babelrc'] });
                })
            );
        });

        describe('no config found...', () => {
            it('should return null when the path is empty', () =>
                findBabelConfig('').then(({ file, config }) => {
                    expect(file).to.equal(null);
                    expect(config).to.equal(null);
                })
            );

            it('should return null when no config is found until / is reached', () =>
                findBabelConfig('/sth/else/that/doesnt/exist').then(({ file, config }) => {
                    expect(file).to.equal(null);
                    expect(config).to.equal(null);
                })
            );

            it('should return null when depth is found without finding a babelrc file', () =>
                findBabelConfig('test/data/babelrc/dir1/dir2/dir3/dir4/dir5', 1).then(({ file, config }) => {
                    expect(file).to.equal(null);
                    expect(config).to.equal(null);
                })
            );

            it('should return null when depth is found without finding package.json', () =>
                findBabelConfig('test/data/packagejson/dir1/dir2/dir3/dir4/dir5/dir6/dir7/dir8', 3).then(({ file, config }) => {
                    expect(file).to.equal(null);
                    expect(config).to.equal(null);
                })
            );
        });
    });

    describe('sync', () => {
        describe('babelrc', () => {
            it('should return the config in the specified directory', () => {
                const { file, config } = findBabelConfig.sync('test/data/babelrc');
                expect(file).to.equal(path.join(process.cwd(), 'test/data/babelrc/.babelrc'));
                expect(config).to.eql({ presets: ['fake-preset-babelrc'] });
            });

            it('should return the config in the parent directory', () => {
                const { file, config } = findBabelConfig.sync(path.join(process.cwd(), 'test/data/babelrc/dir1'));
                expect(file).to.equal(path.join(process.cwd(), 'test/data/babelrc/.babelrc'));
                expect(config).to.eql({ presets: ['fake-preset-babelrc'] });
            });

            it('should return the first config found in the parents', () => {
                const { file, config } = findBabelConfig.sync('test/data/babelrc/dir1/dir2/dir3/dir4/dir5');
                expect(file).to.equal(path.join(process.cwd(), 'test/data/babelrc/dir1/dir2/dir3/.babelrc'));
                expect(config).to.eql({ presets: ['fake-preset-dir3-babelrc'] });
            });
        });

        describe('package.json', () => {
            it('should return the config in the specified directory', () => {
                const { file, config } = findBabelConfig.sync('test/data/packagejson');
                expect(file).to.equal(path.join(process.cwd(), 'test/data/packagejson/package.json'));
                expect(config).to.eql({ presets: ['fake-preset-packagejson'] });
            });

            it('should return the config in the parent directory', () => {
                const { file, config } = findBabelConfig.sync(path.join(process.cwd(), 'test/data/packagejson/dir1'));
                expect(file).to.equal(path.join(process.cwd(), 'test/data/packagejson/package.json'));
                expect(config).to.eql({ presets: ['fake-preset-packagejson'] });
            });

            it('should not return the package.json if no babel config is found inside', () => {
                const { file, config } = findBabelConfig.sync('test/data/packagejson/dir1/dir2/dir3/dir4/dir5');
                expect(file).to.equal(path.join(process.cwd(), 'test/data/packagejson/dir1/dir2/dir3/package.json'));
                expect(config).to.eql({ presets: ['fake-preset-dir3-packagejson'] });
            });

            it('should return the first config found in the parents', () => {
                const { file, config } = findBabelConfig.sync('test/data/packagejson/dir1/dir2/dir3/dir4/dir5');
                expect(file).to.equal(path.join(process.cwd(), 'test/data/packagejson/dir1/dir2/dir3/package.json'));
                expect(config).to.eql({ presets: ['fake-preset-dir3-packagejson'] });
            });
        });

        describe('both files', () => {
            it('should return the first babel config in package.json', () => {
                const { file, config } = findBabelConfig.sync('test/data/both/dir1/dir2/dir3');
                expect(file).to.equal(path.join(process.cwd(), 'test/data/both/dir1/package.json'));
                expect(config).to.eql({ presets: ['fake-preset-packagejson'] });
            });

            it('should return the first babel config in babelrc', () => {
                const { file, config } = findBabelConfig.sync('test/data/both/dir1/dir2/dir3/dir4/dir5');
                expect(file).to.equal(path.join(process.cwd(), 'test/data/both/dir1/dir2/dir3/dir4/.babelrc'));
                expect(config).to.eql({ presets: ['fake-preset-dir5-babelrc'] });
            });
        });

        describe('no config found...', () => {
            it('should return null when the path is empty', () => {
                const { file, config } = findBabelConfig.sync('');
                expect(file).to.equal(null);
                expect(config).to.equal(null);
            });

            it('should return null when no config is found until / is reached', () => {
                const { file, config } = findBabelConfig.sync('/sth/else/that/doesnt/exist');
                expect(file).to.equal(null);
                expect(config).to.equal(null);
            });

            it('should return null when depth is found without finding a babelrc file', () => {
                const { file, config } = findBabelConfig.sync('test/data/babelrc/dir1/dir2/dir3/dir4/dir5', 1);
                expect(file).to.equal(null);
                expect(config).to.equal(null);
            });

            it('should return null when depth is found without finding package.json', () => {
                const { file, config } = findBabelConfig.sync('test/data/packagejson/dir1/dir2/dir3/dir4/dir5/dir6/dir7/dir8', 3);
                expect(file).to.equal(null);
                expect(config).to.equal(null);
            });
        });
    });
});
