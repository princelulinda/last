// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    // List of files / patterns to load in the browser.
    files: [
      'node_modules/@angular/core/testing.js',
      'node_modules/@angular/platform-browser/testing.js',
      'src/**/*.spec.ts', // Replace with path to your test specs
    ],
    // List of preprocessors to apply before serving the files
    preprocessors: {
      'src/**/*.spec.ts': ['webpack'], // Replace with path to your test specs
    },
    webpack: {
      // Karma webpack configuration
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: [
              { loader: 'ts-loader' },
              // Add other loaders for code coverage if needed
            ],
            exclude: /node_modules/,
          },
        ],
      },
      resolve: {
        extensions: ['.ts', '.js'],
      },
    },

    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/ng-magis-erp'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    // browsers: ['Chrome'],
    browsers: false,
    restartOnFileChange: true,
  });
};
