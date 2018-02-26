'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  initializing() {
    this.pkg = require('../../package.json');
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      {
        date: new Date().toISOString().split('T')[0],
        name: this.pkg.name,
        version: this.pkg.version,
        includeSass: this.options.includeSass,
        includeBootstrap: this.options.includeBootstrap,
        legacyBootstrap: this.options.legacyBootstrap,
        includeBabel: this.options.babel
      }
    );
  }
};
