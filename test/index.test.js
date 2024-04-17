/* eslint-env jest */
const path = require('path');
const findBabelConfig = require('../src');

describe('find-babel-config', () => {
    describe('async', () => {
        describe('.babelrc', () => {
            it('should return the config in the direct directory', () => findBabelConfig('test/data/babelrc').then(({ file, config }) => {
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelrc/.babelrc'));
                expect(config).toEqual({ presets: ['fake-preset-babelrc'] });
            }));

            it('should return the config in the parent directory', () => findBabelConfig(path.join(process.cwd(), 'test/data/babelrc/dir1')).then(({ file, config }) => {
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelrc/.babelrc'));
                expect(config).toEqual({ presets: ['fake-preset-babelrc'] });
            }));

            it('should return the first config found in the parents', () => findBabelConfig('test/data/babelrc/dir1/dir2/dir3/dir4/dir5').then(({ file, config }) => {
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelrc/dir1/dir2/dir3/.babelrc'));
                expect(config).toEqual({ presets: ['fake-preset-dir3-babelrc'] });
            }));
        });

        describe('.babelrc.js', () => {
            it('should return the config in the direct directory', () => findBabelConfig('test/data/babelrcjs').then(({ file, config }) => {
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelrcjs/.babelrc.js'));
                expect(config).toEqual({ presets: ['@babel/preset-env'] });
            }));

            it('should return the config in the parent directory', () => findBabelConfig(path.join(process.cwd(), 'test/data/babelrcjs/dir1')).then(({ file, config }) => {
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelrcjs/.babelrc.js'));
                expect(config).toEqual({ presets: ['@babel/preset-env'] });
            }));

            it('should return the first config found in the parents', () => findBabelConfig('test/data/babelrcjs/dir1/dir2/dir3/dir4/dir5').then(({ file, config }) => {
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelrcjs/dir1/dir2/dir3/.babelrc.js'));
                expect(config).toEqual({ plugins: ['@babel/plugin-transform-arrow-functions'] });
            }));
        });

        describe('package.json', () => {
            it('should return the config in the direct directory', () => findBabelConfig('test/data/packagejson').then(({ file, config }) => {
                expect(file).toBe(path.join(process.cwd(), 'test/data/packagejson/package.json'));
                expect(config).toEqual({ presets: ['fake-preset-packagejson'] });
            }));

            it('should return the config in the parent directory', () => findBabelConfig(path.join(process.cwd(), 'test/data/packagejson/dir1')).then(({ file, config }) => {
                expect(file).toBe(path.join(process.cwd(), 'test/data/packagejson/package.json'));
                expect(config).toEqual({ presets: ['fake-preset-packagejson'] });
            }));

            it('should not return the package.json if no babel config is found inside', () => findBabelConfig('test/data/packagejson/dir1/dir2/dir3/dir4/dir5').then(({ file, config }) => {
                expect(file).toBe(path.join(process.cwd(), 'test/data/packagejson/dir1/dir2/dir3/package.json'));
                expect(config).toEqual({ presets: ['fake-preset-dir3-packagejson'] });
            }));

            it('should return the first config found in the parents', () => findBabelConfig('test/data/packagejson/dir1/dir2/dir3/dir4/dir5').then(({ file, config }) => {
                expect(file).toBe(path.join(process.cwd(), 'test/data/packagejson/dir1/dir2/dir3/package.json'));
                expect(config).toEqual({ presets: ['fake-preset-dir3-packagejson'] });
            }));
        });

        describe('both files', () => {
            it('should return the first babel config in package.json', () => findBabelConfig('test/data/both/dir1/dir2/dir3').then(({ file, config }) => {
                expect(file).toBe(path.join(process.cwd(), 'test/data/both/dir1/package.json'));
                expect(config).toEqual({ presets: ['fake-preset-packagejson'] });
            }));

            it('should return the first babel config in babelrc', () => findBabelConfig('test/data/both/dir1/dir2/dir3/dir4/dir5').then(({ file, config }) => {
                expect(file).toBe(path.join(process.cwd(), 'test/data/both/dir1/dir2/dir3/dir4/.babelrc'));
                expect(config).toEqual({ presets: ['fake-preset-dir5-babelrc'] });
            }));
        });

        describe('babel.config.js', () => {
            it('should return the config in the direct directory', () => findBabelConfig('test/data/babelconfigjs').then(({ file, config }) => {
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelconfigjs/babel.config.js'));
                expect(config).toEqual({ presets: ['fake-preset-babel-config-js'], plugins: ['fake-plugin-babel-config-js'] });
            }));

            it('should return the config in the parent directory', () => findBabelConfig(path.join(process.cwd(), 'test/data/babelconfigjs/dir1')).then(({ file, config }) => {
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelconfigjs/babel.config.js'));
                expect(config).toEqual({ presets: ['fake-preset-babel-config-js'], plugins: ['fake-plugin-babel-config-js'] });
            }));

            it('should return the first config found in the parents', () => findBabelConfig('test/data/babelconfigjs/dir1/dir2/dir3/dir4/dir5').then(({ file, config }) => {
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelconfigjs/dir1/dir2/dir3/babel.config.js'));
                expect(config).toEqual({ presets: ['fake-preset-dir3-babel-config-js'], plugins: ['fake-plugin-dir3-babel-config-js'] });
            }));
        });

        describe('with depth', () => {
            it('should check only the direct directory with a depth 0', () => findBabelConfig('test/data/babelrc/dir1/dir2/dir3/dir4', 0).then(({ file, config }) => {
                expect(file).toBe(null);
                expect(config).toBe(null);
            }));

            it('should return null when depth is reached without finding a babelrc file', () => findBabelConfig('test/data/babelrc/dir1/dir2/dir3/dir4/dir5', 1).then(({ file, config }) => {
                expect(file).toBe(null);
                expect(config).toBe(null);
            }));

            it('should return null when depth is reached without finding package.json', () => findBabelConfig('test/data/packagejson/dir1/dir2/dir3/dir4/dir5/dir6/dir7/dir8', 3).then(({ file, config }) => {
                expect(file).toBe(null);
                expect(config).toBe(null);
            }));
        });

        describe('edge cases...', () => {
            it('should return null when the path is empty', () => findBabelConfig('').then(({ file, config }) => {
                expect(file).toBe(null);
                expect(config).toBe(null);
            }));

            it('should return null when no config is found until / is reached', () => findBabelConfig('/sth/else/that/doesnt/exist').then(({ file, config }) => {
                expect(file).toBe(null);
                expect(config).toBe(null);
            }));
        });
    });

    describe('sync', () => {
        describe('.babelrc', () => {
            it('should return the config in the specified directory', () => {
                const { file, config } = findBabelConfig.sync('test/data/babelrc');
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelrc/.babelrc'));
                expect(config).toEqual({ presets: ['fake-preset-babelrc'] });
            });

            it('should return the config in the parent directory', () => {
                const { file, config } = findBabelConfig.sync(path.join(process.cwd(), 'test/data/babelrc/dir1'));
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelrc/.babelrc'));
                expect(config).toEqual({ presets: ['fake-preset-babelrc'] });
            });

            it('should return the first config found in the parents', () => {
                const { file, config } = findBabelConfig.sync('test/data/babelrc/dir1/dir2/dir3/dir4/dir5');
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelrc/dir1/dir2/dir3/.babelrc'));
                expect(config).toEqual({ presets: ['fake-preset-dir3-babelrc'] });
            });
        });

        describe('.babelrc.js', () => {
            it('should return the config in the specified directory', () => {
                const { file, config } = findBabelConfig.sync('test/data/babelrcjs');
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelrcjs/.babelrc.js'));
                expect(config).toEqual({ presets: ['@babel/preset-env'] });
            });

            it('should return the config in the parent directory', () => {
                const { file, config } = findBabelConfig.sync(path.join(process.cwd(), 'test/data/babelrcjs/dir1'));
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelrcjs/.babelrc.js'));
                expect(config).toEqual({ presets: ['@babel/preset-env'] });
            });

            it('should return the first config found in the parents', () => {
                const { file, config } = findBabelConfig.sync('test/data/babelrcjs/dir1/dir2/dir3/dir4/dir5');
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelrcjs/dir1/dir2/dir3/.babelrc.js'));
                expect(config).toEqual({ plugins: ['@babel/plugin-transform-arrow-functions'] });
            });
        });

        describe('package.json', () => {
            it('should return the config in the specified directory', () => {
                const { file, config } = findBabelConfig.sync('test/data/packagejson');
                expect(file).toBe(path.join(process.cwd(), 'test/data/packagejson/package.json'));
                expect(config).toEqual({ presets: ['fake-preset-packagejson'] });
            });

            it('should return the config in the parent directory', () => {
                const { file, config } = findBabelConfig.sync(path.join(process.cwd(), 'test/data/packagejson/dir1'));
                expect(file).toBe(path.join(process.cwd(), 'test/data/packagejson/package.json'));
                expect(config).toEqual({ presets: ['fake-preset-packagejson'] });
            });

            it('should not return the package.json if no babel config is found inside', () => {
                const { file, config } = findBabelConfig.sync('test/data/packagejson/dir1/dir2/dir3/dir4/dir5');
                expect(file).toBe(path.join(process.cwd(), 'test/data/packagejson/dir1/dir2/dir3/package.json'));
                expect(config).toEqual({ presets: ['fake-preset-dir3-packagejson'] });
            });

            it('should return the first config found in the parents', () => {
                const { file, config } = findBabelConfig.sync('test/data/packagejson/dir1/dir2/dir3/dir4/dir5');
                expect(file).toBe(path.join(process.cwd(), 'test/data/packagejson/dir1/dir2/dir3/package.json'));
                expect(config).toEqual({ presets: ['fake-preset-dir3-packagejson'] });
            });
        });

        describe('babel.config.js', () => {
            it('should return the config in the specified directory', () => {
                const { file, config } = findBabelConfig.sync('test/data/babelconfigjs');
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelconfigjs/babel.config.js'));
                expect(config).toEqual({ presets: ['fake-preset-babel-config-js'], plugins: ['fake-plugin-babel-config-js'] });
            });

            it('should return the config in the parent directory', () => {
                const { file, config } = findBabelConfig.sync(path.join(process.cwd(), 'test/data/babelconfigjs/dir1'));
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelconfigjs/babel.config.js'));
                expect(config).toEqual({ presets: ['fake-preset-babel-config-js'], plugins: ['fake-plugin-babel-config-js'] });
            });

            it('should return the first config found in the parents', () => {
                const { file, config } = findBabelConfig.sync('test/data/babelconfigjs/dir1/dir2/dir3/dir4/dir5');
                expect(file).toBe(path.join(process.cwd(), 'test/data/babelconfigjs/dir1/dir2/dir3/babel.config.js'));
                expect(config).toEqual({ presets: ['fake-preset-dir3-babel-config-js'], plugins: ['fake-plugin-dir3-babel-config-js'] });
            });
        });

        describe('both files', () => {
            it('should return the first babel config in package.json', () => {
                const { file, config } = findBabelConfig.sync('test/data/both/dir1/dir2/dir3');
                expect(file).toBe(path.join(process.cwd(), 'test/data/both/dir1/package.json'));
                expect(config).toEqual({ presets: ['fake-preset-packagejson'] });
            });

            it('should return the first babel config in babelrc', () => {
                const { file, config } = findBabelConfig.sync('test/data/both/dir1/dir2/dir3/dir4/dir5');
                expect(file).toBe(path.join(process.cwd(), 'test/data/both/dir1/dir2/dir3/dir4/.babelrc'));
                expect(config).toEqual({ presets: ['fake-preset-dir5-babelrc'] });
            });
        });

        describe('with depth', () => {
            it('should check only the direct directory with a depth 0', () => {
                const { file, config } = findBabelConfig.sync('test/data/babelrc/dir1/dir2/dir3/dir4', 0);
                expect(file).toBe(null);
                expect(config).toBe(null);
            });

            it('should return null when depth is reached without finding a babelrc file', () => {
                const { file, config } = findBabelConfig.sync('test/data/babelrc/dir1/dir2/dir3/dir4/dir5', 1);
                expect(file).toBe(null);
                expect(config).toBe(null);
            });

            it('should return null when depth is reached without finding package.json', () => {
                const { file, config } = findBabelConfig.sync('test/data/packagejson/dir1/dir2/dir3/dir4/dir5/dir6/dir7/dir8', 3);
                expect(file).toBe(null);
                expect(config).toBe(null);
            });
        });

        describe('edge cases...', () => {
            it('should return null when the path is empty', () => {
                const { file, config } = findBabelConfig.sync('');
                expect(file).toBe(null);
                expect(config).toBe(null);
            });

            it('should return null when no config is found until / is reached', () => {
                const { file, config } = findBabelConfig.sync('/sth/else/that/doesnt/exist');
                expect(file).toBe(null);
                expect(config).toBe(null);
            });
        });
    });
});
