const express = require('express');
const fs = require('fs');
const path = require('path');
const template = require('lodash.template');

const app = express();

const htmlTemplateContent = fs.readFileSync(path.join(__dirname, 'index.html.template'));
const htmlTemplateGenetator = template(htmlTemplateContent);

const VALID_PLANNER_VERSIONS = ['home', 'showroom', 'trade', 'surveyor'];

function renderHtmlForPlannerVersion(plannerVersion) {
    if (!VALID_PLANNER_VERSIONS.includes(plannerVersion)) {
        return `${plannerVersion} is not a valid planner version.`;
    }

    return htmlTemplateGenetator({ plannerVersion });
}

app.get('/', (request, response) => {
    response.send(renderHtmlForPlannerVersion('home'));
});

app.get('/:plannerVersion', (request, response) => {
    response.send(renderHtmlForPlannerVersion(request.params.plannerVersion));
});

app.listen(3000);
