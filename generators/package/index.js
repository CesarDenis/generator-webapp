'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  writing() {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        includeSass: this.options.includeSass,
        includeBabel: this.options.babel,
        includeJQuery: this.options.includeJQuery
      }
    );
  }
};
