# Digital Verification Platform Infrastructure as Code

## Local Development

#### Install Pulumi

Navigate to the [Pulumi install guide](https://www.pulumi.com/docs/get-started/aws/begin/#install-pulumi) and follow the instructions based on your operating system.


#### Environment Variables

You can use your [AWS configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) or manually export the following environment variables:

```
export AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID>
export AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>
export AWS_REGION=<YOUR_REGION>
```

## Infrastructure

Navigate to the `./infrastrucure` directory and run one of the following commands:

#### Preview

```
pulumi preview
```

#### Deploy

```
pulumi up
```

#### Delete

```
pulumi destroy
```
