# Shopify App Boilerplate

The boilerplate is based on https://github.com/gayanhewa/minimal-react-express-ts-boilerplate

## Why ?

I wanted a minimal starter template in TypeScript and based on React + Express. Shopify's sample app generator generates a NextJS javascript app. And requires some effort convert.
Also they are in the process of moving away from the current app and porting it over to React + Express.

## Shopify Node API Library

[]This library](https://github.com/Shopify/shopify-node-api) is well documented, has everything we need to implement the oAuth flow etc.

## Notes
If you are not using App Bridge you can strip out the client/admin app and `auth/toplevel` routes and server/views and remove the ejs dependency.

### What else do I need

- Shopify Partner account
- Shopify app and credentials
- Create a .env file (see env.template)
- ngrok or a similar tunneling software for development

