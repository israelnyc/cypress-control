const glob = require('glob');
const path = require('path');
const merge = require('lodash/fp/mergeWith');
const { events } = require('./status-events');

try {
    const cypress = require(path.join(
        process.cwd(),
        'node_modules',
        'cypress'
    ));

    const {
        componentFolder,
        integrationFolder = 'cypress/integration/',
    } = require(path.join(process.cwd(), 'cypress.json'));

    const defaultBrowser = 'electron';

    const validBrowsers = [
        'electron',
        'chromium',
        'chrome',
        'chrome:canary',
        'edge',
        'edge:beta',
        'edge:dev',
        'edge:canary',
        'firefox',
        'firefox:dev',
        'firefox:nightly',
    ];

    const options = process.argv[2] ? JSON.parse(process.argv[2]) : {};

    options.config = options.config || {};
    options.config.reporterOptions = options.config.reporterOptions || {};

    if (options.reporters) {
        options.config.reporterOptions.reporterEnabled = options.reporters;
    }

    if (options.browser && !validBrowsers.includes(options.browser)) {
        console.log(
            `${options.browser} is not an available browser option. Defaulting to ${defaultBrowser}`
        );

        console.log(
            'The following browser options are available, if installed on your system:'
        );

        validBrowsers.forEach(browser => console.log(browser));

        options.browser = defaultBrowser;
    }

    const specSelections =
        options.spec && options.spec.length
            ? options.spec.map(spec => path.normalize(spec))
            : null;

    const specPattern = specSelections ? specSelections : [];

    if (!specSelections) {
        specPattern.push(path.normalize(`./${integrationFolder}/**/**`));

        if (componentFolder) {
            specPattern.push(path.normalize(`./${componentFolder}/**/**`));
        }
    }

    const defaultOptions = {
        browser: defaultBrowser,
        spec: specPattern,
        config: {
            reporter: path.join(
                __dirname,
                '..',
                'node_modules',
                'cypress-multi-reporters'
            ),
            reporterOptions: {
                reporterEnabled: [path.join(__dirname, 'reporter.js')],
            },
        },
    };

    const mergedOptions = merge(
        (objValue, srcValue) => {
            if (Array.isArray(objValue)) {
                return objValue.concat(srcValue);
            }
        },
        defaultOptions,
        options
    );

    const globPattern =
        specPattern.length > 1 ? `{${specPattern.join(',')}}` : specPattern[0];

    glob(globPattern, { nodir: true }, (err, matches) => {
        console.log('globPattern specs found:', matches.length);
        process.send({
            type: events.CYPRESS_CONTROL_BEFORE_RUN,
            data: {
                totalSpecs: matches.length,
            },
        });
    });

    console.log('custom options:', options);
    console.log('merged options:', mergedOptions);
    console.log(
        'reporters enabled:',
        mergedOptions.config.reporterOptions.reporterEnabled
    );
    console.log('config componentFolder:', componentFolder);
    console.log('config integrationFolder:', integrationFolder);
    console.log('spec selections:', specSelections);
    console.log('spec pattern:', specPattern);
    console.log('globPattern:', globPattern);

    cypress
        .run(mergedOptions)
        .then(results => {
            process.send({
                type: events.CYPRESS_CONTROL_RUN_COMPLETED,
                data: results,
            });

            process.exit(0);
        })
        .catch(error => {
            process.send({
                type: events.CYPRESS_CONTROL_RUN_ERROR,
                data: error,
            });

            process.exit(1);
        });
} catch (error) {
    process.send({
        type: events.CYPRESS_CONTROL_MODULE_INCLUDE_ERROR,
        data: error,
    });

    process.exit(1);
}
