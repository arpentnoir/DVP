# Introduction

TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project.

# Getting Started

TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:

1. Installation process
2. Software dependencies
3. Latest releases
4. API references

# Build and Test

TODO: Describe and show how to build your code and run the tests.

## Client

### Environment variables

The config for the client is loaded from `/apps/client/src/env/env-config.js`, the file should be committed to the repository.
the environment config gets overwritten during the deployment, whenever `env-config.js` needs to updated, please update the pulumi scripts as well to inject variables during the deployment

### Internet

To build the internet app, run `yarn build`. This will create a bundle which only includes the base app and internet specific routes.

To run the internet app, run `yarn start`. This will serve a bundle which only includes the base app and internet specific routes.

### Internal

To build the internal app, run `yarn build:internal`. This will create a bundle which only includes the base app and internal specific routes.

To run the internal app, run `yarn start:internal`. This will serve a bundle which only includes the base app and internal specific routes.

### Localstack

Localstack simulates aws cloud environment locally. To run against localstack, ensure that the following environmental variable is set to true in the environment variable files located at apps\api\.env and apps\schema-worker\.env.
`ENABLE_LOCALSTACK=true`

The localstack open source version doesn't include cognito service, so it's not included in the default resources created.

### Test

To test the client, run `yarn test`.

# Contribute

TODO: Explain how other users and developers can contribute to make your code better.

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:

- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)
