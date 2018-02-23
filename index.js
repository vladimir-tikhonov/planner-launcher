const express = require('express');
const fs = require('fs');
const path = require('path');
const template = require('lodash.template');
const startCase = require('lodash.startcase');
const values = require('lodash.values');

const PlannerVersion = {
    Home: 'home',
    Showroom: 'showroom',
    Trade: 'trade',
    Surveyor: 'surveyor',
};

const VALID_PLANNER_VERSIONS = values(PlannerVersion);
const WEBPACK_DEV_SERVER_URL = 'http://127.0.0.1:3001';

const app = express();

const htmlTemplateContent = fs.readFileSync(path.join(__dirname, 'index.html.template'));
const htmlTemplateGenetator = template(htmlTemplateContent);

function renderHtmlForPlannerVersion(plannerVersion) {
    if (!VALID_PLANNER_VERSIONS.includes(plannerVersion)) {
        return `${plannerVersion} is not a valid planner version.`;
    }

    return htmlTemplateGenetator({
        plannerVersion,
        plannerVersionTitle: startCase(plannerVersion),
        assetsUrl: WEBPACK_DEV_SERVER_URL,
    });
}

app.get('/', (request, response) => {
    response.send(renderHtmlForPlannerVersion(PlannerVersion.Home));
});

app.get('/:plannerVersion', (request, response) => {
    response.send(renderHtmlForPlannerVersion(request.params.plannerVersion));
});

app.listen(80, 'roomplanner.light.wrenkitchens.com');
