# Digital Verification Platform Admin API

## Local development

#### Install the Dependencies

Navigate to the projects root directory and run the following command:

```
yarn install
```

#### Start the API

##### Proxy Configuration

If the app is run behind a corporate proxy then HTTP_PROXY=http://<YOUR_PROXY> and NODE_TLS_REJECT_UNAUTHORIZED=0 must be set in your environment variables. This also applies for testing.

```
nx serve admin-api
```

### Testing

#### Unit Tests

```
nx test admin-api
```

#### Intergration Tests

```
nx serve admin-api
nx intergration-tests admin-api
```
