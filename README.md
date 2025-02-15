![Maptio Logo](./apps/maptio/src/assets/images/logo-with-name.png)

# Maptio

For founders of purpose-driven companies and initiatives who want to create a scalable, autonomous and focussed organisation structure and culture.
Our simple online initiative mapping tool visualises who has taken responsibility for what and who is helping who to meet those responsibilities
So that people throughout the organisation can: 

- make autonomous decisions while at the same time supporting the autonomy of others, all the way up to the founder holding the overall vision
- see how responsibilities throughout the organisation feed into the greater system
- enjoy greater transparency
- avoid the tyranny of heavy-weight processes, bureaucracy and excessive management.

## Introduction

| Maptio has recently become an open source project 🎉  <br><br> The below documentation has served us internally for a while, but we need to improve it. In the meantime, if you want to get started, [get in touch with us](mailto:support@maptio.com) or [with me directly](mailto:roman.goj@gmail.com) and we'll be happy to help you via a video call. <br><br> In addition to this README, you can also check out [this issue where we discuss some issues with setting up locally](https://github.com/Maptio/maptio/issues/811). Please don't forget to add your thumbs up to it, so that we know to prioritise making this easier! |
| --- |


## Installing / Getting started

The latest version of the app is running at [https://app.maptio.com](https://app.maptio.com).

To launch it on your local server, see the [Setting up dev](#setting-up-dev) section.


## Developing

### Built With

- Angular
- Typescript
- Bootstrap
- D3
- Express

Additionally , we use these services/packages : 
- Angular Tree Component `angular2-tree-component`
- Auth0 for authentication as a service
- Cloudinary for image storage/retrieval

### Prerequisites

You must have [Node.js (> 7.10.1)](https://nodejs.org/en/download/) installed.
For local development please install [MongoDB (Community Edition)](https://docs.mongodb.com/manual/installation/) too.


### Setting up Dev

#### 1. Get the code

```shell
git clone https://github.com/Safiya/maptio.git
cd maptio/
```

#### 2. Setup the environment variables

Unforutnately, Maptio currently relies on external services, many of which need to be set up for the app to work.
If you'd like to set them up, please use the `.env.sample` template to create a `.env` file in the root folder and use the environment variables there as a guide for what services to set up and what environment variables to obtain from them.

We're aware that this makes setting up Maptio for local development difficult and hope to be able to improve this - and all help is very much welcome! Please see [#811](https://github.com/Maptio/maptio/issues/811) for a discussion and to share your thoughts.

#### 3. Set up a local database

To keep your data locally, create a new folder in the root of the repository called `local_data` and run the MongoDB demon pointing it to that folder:

```shell
mongod --dbpath=./local_data/
```

Next, point the app at the database by commenting out the `MONGODB_URI` environment variable and pointing to your new database, e.g.:

```shell
#MONGODB_URI=mongodb://<PRODUCTION URI>
MONGODB_URI=mongodb://localhost:27017/maptio
```

#### 4. Install dependencies and start the Node.js server

```shell
npm install
npm start
```
A webpack analyzer window might open at http://localhost:8888, ignore this for now.

#### 5. Access

Go to  `http://localhost:4200` to see it in the browser.

If you have previously logged in to the app locally using the production
database, you will find it's now impossible to log in to the app locally if
it's using your local database. To fix this, open developer tools and remove
everything under `Application > Local Storage > http://localhost:3000`.

For development, it's enough to just use a trial account, because you can always
clean up the database and start again (but ideally we should work out a better
local development account workflow at some point!).


### Using a backup of the production database locally

Using an empty database locally (as described above) is not always enough (e.g. performance issues only appear with sufficiently complex
maps). Connecting to the production database locally is dangerous as it may lead to data loss. To avoid both issues, we can back up the
production database and restore it to our own local MongoDB instance. To do this, please follow the instructions below.

#### 1. Empty your current local database

If you followed the instructions above, you can simply delete the `local_data` folder (back it up first if that might be useful):

```shell
mv local_data local_data_backup
mkdir local_data
```

#### 2. Start a new instance of MongoDB pointing at the new data location

```shell
mongod --dbpath=./local_data/
```

#### 3. Perform a backup of the production DB

First, you'll need to copy the production `MONGODB_URI` variable from the `.env` file. Then, paste it into the following command and
execute the command:

```shell
mongodump --uri "<MONGODB_URI>" --out ./prod_db_backup
```

The `mongodump` command should be installed with the MongoDB installation (checked with MongoDB Community Edition 4.4 installed via
homebrew on MacOS).

#### 4. Restore the copy of the production DB to your local MongoDB instance

The previous command should have copied all data from the prod DB to the `prod_db_backup` folder. Now we need to populate our local MongoDB
database with that data simply by running (note this will only work if an instance of MongoDB is running locally on the default port as it
should be after step 2 above):

```shell
mongorestore prod_db_backup
```

You should now be able to see production data locally if you log in to maptio with an account that is part of an existing organisation.


### Source mapping

By default source mapping doesn't work locally because of the integration with FullStory.
It can be re-enabled by simply commenting out the scripts in `index.html`


### Infrastructure

#### Server

The app is hosted on heroku.
There are two heroku projects, one for the production server (app.maptio.com) and one for the staging server:
* [maptio-eu (production) on heroku](https://dashboard.heroku.com/apps/maptio-eu)


#### Database

The app uses MongoDB as its database.
There is currently only one database set up in the cloud.
It powers both the production and the staging sites (caution required!).
It is hosted on MongoDB Atlas:
* [MongoDB Atlas instance](https://cloud.mongodb.com/v2/59b415d9c0c6e3360f567f24)


#### Continuous Integration

CircleCI is used to run tests on every branch:
* [Maptio on CircleCI](https://app.circleci.com/pipelines/github/tomnixon)
Deployments are done on Heroku based on pushes to branches on github, which orchestrates the CI steps.
See more below.


#### Auth0

Authentication is managed through Auth0. The production account is used locally and on staging too for now.
* [Auth0 productin account](https://manage.auth0.com/dashboard/us/circlemapping/)


#### Cloudinary

Cloudinary is used to store user profile images, with the same account serving production, staging and local environments.
The account can be accessed through Heroku login in the resources section.
* [Cloudinary login through Heroku resources](https://dashboard.heroku.com/apps/maptio-staging/resources)


#### Code quality

At the start of the project Code Climate was used to keep track of code quality. It's not used that much anymore but might still be useful
in the future.
* [CodeClimate](https://codeclimate.com/repos/58ddc02f974e760287000b1d)


#### Analytics

The following services are used for analytics and/or logging:
* [FullStory](https://app.fullstory.com/ui/8HKGB)
* [LogRocket](https://app.logrocket.com/w3vkbz/maptio)
* [Mixpanel - link to be added later]()


### Deploying / Publishing

We use CircleCI,  Code Climate and Heroku for deploying to `https://app.maptio.com`.

Any `git push` in the `master` branch will triggers the following events : 

1. Build and run tests on CircleCI
2. If pass, analyse on CodeClimate and report test coverage & quality metrics
3. Deploy to Heroku at `https://app.maptio.com`

Each step is logged on our private Slack `maptio.slack.com`, in the `#build` channel

### Issue tracker

We use [GitHub issue tracker](https://github.com/tomnixon/maptio/issues).

Ideally Pull requests and commits should reference the issue number ([See this guide](https://help.github.com/articles/closing-issues-via-commit-messages/))

## Versioning

## Configuration

## Tests

Tests are written in Jest and ran with Jest.

- Single run 
```shell
npm test
```

- Auto updated run 
```shell
npm run test:watch
```

- Generate test coverage 
```shell
npm run test:coverage
```

Locally, you can follow test coverate statistics by opening `./coverage/index.html` in a browser (generated with Istanbul)

## Style guide

Enabled/disabled rules can be found in `.codeclimate.yml`

In general, we use standards rules from out of the box TSLint.

## Api Reference

*TODO*

## Database

MongoDB hosted on MongoDb Atlas, ORM is MongoJS.
