'use strict';
const Generator = require('yeoman-generator');
const commandExists = require('command-exists').sync;
const yosay = require('yosay');
const chalk = require('chalk');
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });

    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });

    this.option('babel', {
      desc: 'Use Babel',
      type: Boolean,
      defaults: true
    });
  }

  initializing() {
    this.composeWith(
      require.resolve(`generator-${this.options['test-framework']}/generators/app`),
      { 'skip-install': this.options['skip-install'] }
    );
  }

  prompting() {
    if (!this.options['skip-welcome-message']) {
      this.log(
        yosay(
          "'Allo 'allo! Out of the box I include HTML5 Boilerplate, jQuery, and a gulpfile to build your app."
        )
      );
    }

    const prompts = [
      {
        type: 'checkbox',
        name: 'features',
        message: 'Which additional features would you like to include?',
        choices: [
          {
            name: 'Sass',
            value: 'includeSass',
            checked: true
          },
          {
            name: 'Bootstrap',
            value: 'includeBootstrap',
            checked: true
          },
          {
            name: 'Modernizr',
            value: 'includeModernizr',
            checked: true
          }
        ]
      },
      {
        type: 'list',
        name: 'legacyBootstrap',
        message: 'Which version of Bootstrap would you like to include?',
        choices: [
          {
            name: 'Bootstrap 4',
            value: false
          },
          {
            name: 'Bootstrap 3',
            value: true
          }
        ],
        when: answers => answers.features.indexOf('includeBootstrap') !== -1
      },
      {
        type: 'confirm',
        name: 'includeJQuery',
        message: 'Would you like to include jQuery?',
        default: true,
        when: answers => answers.features.indexOf('includeBootstrap') === -1
      }
    ];

    return this.prompt(prompts).then(answers => {
      const features = answers.features;
      const hasFeature = feat => features && features.indexOf(feat) !== -1;

      // Manually deal with the response, get back and store the results.
      // we change a bit this way of doing to automatically do this in the self.prompt() method.
      this.includeSass = hasFeature('includeSass');
      this.includeBootstrap = hasFeature('includeBootstrap');
      this.includeModernizr = hasFeature('includeModernizr');
      this.legacyBootstrap = answers.legacyBootstrap;
      this.includeJQuery = answers.includeJQuery;
    });
  }

  default() {
    this.composeWith(require.resolve('../gulpfile'), {
      includeSass: this.includeSass,
      includeBootstrap: this.includeBootstrap,
      legacyBootstrap: this.legacyBootstrap,
      includeBabel: this.options.babel
    });

    this.composeWith(require.resolve('../package'), {
      includeSass: this.includeSass,
      includeBabel: this.options.babel,
      includeJQuery: this.includeJQuery
    });

    this.composeWith(require.resolve('../babel'));

    this.composeWith(require.resolve('../bower'), {
      includeSass: this.includeSass,
      includeBootstrap: this.includeBootstrap,
      legacyBootstrap: this.legacyBootstrap,
      includeJQuery: this.includeJQuery
    });

    this.composeWith(require.resolve('../editorconfig'));

    this.composeWith(require.resolve('../boilerplate'), {
      includeSass: this.includeSass,
      includeBootstrap: this.includeBootstrap,
      legacyBootstrap: this.legacyBootstrap,
      includeJQuery: this.includeJQuery
    });
  }

  install() {
    const hasYarn = commandExists('yarn');
    this.installDependencies({
      npm: !hasYarn,
      bower: true,
      yarn: hasYarn,
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install']
    });
  }

  end() {
    const howToInstall = `
      After running ${chalk.yellow.bold('npm install & bower install')}, inject your
      front end dependencies by running ${chalk.yellow.bold('gulp wiredep')}.`;

    if (this.options['skip-install']) {
      this.log(howToInstall);
    }
  }
};
