# Minimal Starter Boilerplate Express + React

This boilerplate is an entry point to anything you want to build. A few assumptions have been made:

1. You want to have both client and server code in the same repository
2. You want Typescript for both client and server
3. You don't want any packages backed into to deal with Testing , Databases, Caching etc

### What is included in the repo

1. Express
2. React
3. Parcel for bundling and hot reloads
4. ts-node and nodemon for running express with file change watching

### How to use this repo

`degit gayanhewa/minimal-express-react-ts-starter`

### Folder Structure

- client
  - admin-app
  - customer-app
- server

The client has multiple entry points. Added them just to demonstrate. If you don't need multiple entrypoints you can delete the app and remove the target from package.json to parcel won't complain when building.

### Client App Hot Reload Tips

Since we are using Parcel for this, [here is a link to a few tips.](https://parceljs.org/recipes/react/#tips)
