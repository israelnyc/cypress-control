const glob = require('glob');
const path = require('path');
const { handleSIGINT } = require('./process-manager');
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

    const specSelections = process.argv[2]
        ? process.argv[2].split(',').map(spec => path.normalize(spec))
        : null;

    const specPattern = specSelections ? specSelections : [];

    if (!specSelections) {
        specPattern.push(path.normalize(`./${integrationFolder}/**/**`));

        if (componentFolder) {
            specPattern.push(path.normalize(`./${componentFolder}/**/**`));
        }
    }

    console.log('config componentFolder:', componentFolder);
    console.log('config integrationFolder:', integrationFolder);
    console.log('spec selections:', specSelections);
    console.log('spec pattern:', specPattern);

    const globPattern =
        specPattern.length > 1 ? `{${specPattern.join(',')}}` : specPattern[0];

    console.log('globPattern:', globPattern);

    glob(globPattern, { nodir: true }, (err, matches) => {
        console.log('globPattern specs found:', matches.length);
        process.send({
            type: events.CYPRESS_DASHBOARD_BEFORE_RUN,
            data: {
                totalSpecs: matches.length,
            },
        });
    });

    cypress
        .run({
            config: {
                reporter: path.join(__dirname, 'reporter.js'),
            },
            spec: specPattern,
        })
        .then(results => {
            process.send({
                type: events.CYPRESS_DASHBOARD_RUN_COMPLETED,
                data: results,
            });

            process.exit(0);
        })
        .catch(error => {
            process.send({
                type: events.CYPRESS_DASHBOARD_RUN_ERROR,
                data: error,
            });

            process.exit(1);
        });
} catch (error) {
    process.send({
        type: events.CYPRESS_DASHBOARD_MODULE_INCLUDE_ERROR,
        data: error,
    });

    process.exit(1);
}

handleSIGINT();
