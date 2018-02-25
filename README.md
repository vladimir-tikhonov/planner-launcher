## Setup
- add `127.0.0.1 roomplanner.light.wrenkitchens.com` to `/etc/hosts`
- change `@planner-host` property in `config/less/hosts.less` to `roomplanner.light.wrenkitchens.com`
- change `planner` property in `config/app/hosts.json` to `roomplanner.light.wrenkitchens.com`
- run `npm i`
- run `npm run prod`, root privileges may be required to bind port 80.
