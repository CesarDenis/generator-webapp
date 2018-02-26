'use strict';
const Generator = require('yeoman-generator');
const wiredep = require('wiredep');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  writing() {
    this._writingH5bp();
    this._writingStyles();
    this._writingScripts();
    this._writingHtml();
    this._writingMisc();
  }

  end() {
    const bowerJson = this.fs.readJSON(this.destinationPath('bower.json'));

    // Wire Bower packages to .html
    wiredep({
      bowerJson: bowerJson,
      directory: 'bower_components',
      exclude: ['bootstrap-sass', 'bootstrap.js'],
      ignorePath: /^(\.\.\/)*\.\./,
      src: 'app/index.html'
    });

    if (this.includeSass) {
      // Wire Bower packages to .scss
      wiredep({
        bowerJson: bowerJson,
        directory: 'bower_components',
        ignorePath: /^(\.\.\/)+/,
        src: 'app/styles/*.scss'
      });
    }
  }

  _writingH5bp() {
    this.fs.copy(
      this.templatePath('favicon.ico'),
      this.destinationPath('app/favicon.ico')
    );

    this.fs.copy(
      this.templatePath('apple-touch-icon.png'),
      this.destinationPath('app/apple-touch-icon.png')
    );

    this.fs.copy(this.templatePath('robots.txt'), this.destinationPath('app/robots.txt'));
  }

  _writingStyles() {
    let css = 'main';

    if (this.options.includeSass) {
      css += '.scss';
    } else {
      css += '.css';
    }

    this.fs.copyTpl(this.templatePath(css), this.destinationPath('app/styles/' + css), {
      includeBootstrap: this.options.includeBootstrap,
      legacyBootstrap: this.options.legacyBootstrap
    });
  }

  _writingScripts() {
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('app/scripts/main.js'),
      {
        includeBootstrap: this.options.includeBootstrap,
        legacyBootstrap: this.options.legacyBootstrap
      }
    );
  }

  _writingHtml() {
    let bsPath;
    let bsPlugins;

    // Path prefix for Bootstrap JS files
    if (this.options.includeBootstrap) {
      // Bootstrap 4
      bsPath = '/bower_components/bootstrap/js/dist/';
      bsPlugins = [
        'util',
        'alert',
        'button',
        'carousel',
        'collapse',
        'dropdown',
        'modal',
        'scrollspy',
        'tab',
        'tooltip',
        'popover'
      ];

      // Bootstrap 3
      if (this.options.legacyBootstrap) {
        if (this.options.includeSass) {
          bsPath = '/bower_components/bootstrap-sass/assets/javascripts/bootstrap/';
        } else {
          bsPath = '/bower_components/bootstrap/js/';
        }
        bsPlugins = [
          'affix',
          'alert',
          'dropdown',
          'tooltip',
          'modal',
          'transition',
          'button',
          'popover',
          'carousel',
          'scrollspy',
          'collapse',
          'tab'
        ];
      }
    }

    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('app/index.html'),
      {
        appname: this.appname,
        includeSass: this.options.includeSass,
        includeBootstrap: this.options.includeBootstrap,
        legacyBootstrap: this.options.legacyBootstrap,
        includeModernizr: this.options.includeModernizr,
        includeJQuery: this.options.includeJQuery,
        bsPath: bsPath,
        bsPlugins: bsPlugins
      }
    );
  }

  _writingMisc() {
    mkdirp('app/images');
    mkdirp('app/fonts');
  }
};
