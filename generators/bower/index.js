'use strict';
const Generator = require('yeoman-generator');
const _s = require('underscore.string');

module.exports = class extends Generator {
  writing() {
    const bowerJson = {
      name: _s.slugify(this.appname),
      private: true,
      dependencies: {}
    };

    if (this.options.includeBootstrap) {
      // Bootstrap 4
      bowerJson.dependencies = {
        bootstrap: '~4.0.0',
        'popper.js-unpkg': 'https://unpkg.com/popper.js'
      };

      // Bootstrap 3
      if (this.options.legacyBootstrap) {
        if (this.options.includeSass) {
          bowerJson.dependencies = {
            'bootstrap-sass': '~3.3.5'
          };
          bowerJson.overrides = {
            'bootstrap-sass': {
              main: [
                'assets/stylesheets/_bootstrap.scss',
                'assets/fonts/bootstrap/*',
                'assets/javascripts/bootstrap.js'
              ]
            }
          };
        } else {
          bowerJson.dependencies = {
            bootstrap: '~3.3.5'
          };
          bowerJson.overrides = {
            bootstrap: {
              main: [
                'less/bootstrap.less',
                'dist/css/bootstrap.css',
                'dist/js/bootstrap.js',
                'dist/fonts/*'
              ]
            }
          };
        }
      }
    } else if (this.options.includeJQuery) {
      bowerJson.dependencies.jquery = '~2.1.1';
    }

    if (this.options.includeModernizr) {
      bowerJson.dependencies.modernizr = '~2.8.1';
    }

    this.fs.writeJSON('bower.json', bowerJson);
    this.fs.copy(this.templatePath('bowerrc'), this.destinationPath('.bowerrc'));
  }
};
