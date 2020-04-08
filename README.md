# React Express Template
Inspired by Dave Ceddia's [project](https://daveceddia.com/deploy-react-express-app-heroku/)

## Development
### Express Server
**NOTE**<br/>
If you're running the server for the first time, make sure and run

`yarn run build`

before starting the server. This will create the production build for the client app. <br/>(The server will try to serve this by default)

You can test the server locally by running

`yarn run dev-server`

This will start only the server on port `5000` using: <br/>[nodemon](https://www.npmjs.com/package/nodemon) with the `--inspect` flag

### Notes about the server

1. When adding routes, make sure to prepend `/api` to the intended route.<br /><br />
Eg. If you were to add a `{url}/users` route to the server, the endpoint should be `{url}/api/users`

2. The server also serves up the production build of the React app using:<br/>
```
res.sendFile(path.join(__dirname + '/client/build/index.html'));
```

### React Client

If you're working on the client, most likely you'll need the server up and running as well. The command

`yarn run dev`

Will use [concurrently](https://www.npmjs.com/package/concurrently) to run both the server (on port `5000`) and the client (on port `3000`)<br/> You can then make changes to the client app and see the changes on `http://localhost:3000`

## Production
Wherever you plan on deploying this, it is a good idea to include

`yarn run build`

in your build pipeline. <br />This ensures that the production build for the client app is ready.