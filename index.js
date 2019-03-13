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
	Website: 'website',
};
const VALID_PLANNER_VERSIONS = new Set(values(PlannerVersion));

const RoomTypeHandle = {
    Kitchen: 'kitchen',
};
const roomTypeIdMapping = {
    kitchen: 1,
};
const VALID_ROOM_TYPE_HANDLES = new Set(values(RoomTypeHandle));

const LaunchParam = {
    Action: { name: 'action', defaultValue: 'default' },
    PlanId: { name: 'planId' },
    AccountId: { name: 'accountId' },
    Email: { name: 'email' },
    Username: { name: 'username', defaultValue: 'testit' },
};

const LAUNCHER_HOST = 'roomplanner.light.wrenkitchens.com';
const LAUNCHER_PORT = 80;
const WEBPACK_DEV_SERVER_URL = 'http://127.0.0.1:3001';

const app = express();
app.use(express.static('static'));

const htmlTemplateContent = fs.readFileSync(path.join(__dirname, 'index.html.template'));
const htmlTemplateGenetator = template(htmlTemplateContent);

function renderHtmlForPlannerVersion(plannerVersion, roomTypeHandle, launchParams) {
    if (!VALID_PLANNER_VERSIONS.has(plannerVersion)) {
        return `${plannerVersion} is not a valid planner version.`;
    }
    if (!VALID_ROOM_TYPE_HANDLES.has(roomTypeHandle)) {
        return `${roomTypeHandle} is not a valid room type.`;
    }

    return htmlTemplateGenetator({
        plannerVersion,
        plannerVersionTitle: startCase(plannerVersion),
        roomTypeHandle,
        launchParams: JSON.stringify(launchParams),
        assetsUrl: WEBPACK_DEV_SERVER_URL,
    });
}

app.get('/:plannerVersion?/:roomType?', (request, response) => {
    const plannerVersion = request.params.plannerVersion || PlannerVersion.Home;
    const roomTypeHandle = request.params.roomType || RoomTypeHandle.Kitchen;

    const launchParams = {
        roomId: roomTypeIdMapping[roomTypeHandle],
    };
    values(LaunchParam).forEach((paramConfig) => {
        const paramValue = request.query[paramConfig.name] || paramConfig.defaultValue;
        if (paramValue) {
            launchParams[paramConfig.name] = paramValue;
        }
    });

    response.send(renderHtmlForPlannerVersion(plannerVersion, roomTypeHandle, launchParams));
});

app.listen(LAUNCHER_PORT, LAUNCHER_HOST);
