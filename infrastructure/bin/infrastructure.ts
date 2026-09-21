#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { InfrastructureStack } from "../lib/infrastructure-stack";

type EnvironmentName = "dev" | "prod";

const app = new cdk.App();

const environmentName: EnvironmentName =
  (process.env.ENVIRONMENT as EnvironmentName) || "dev";

new InfrastructureStack(app, `InfrastructureStack-${environmentName}`, {
  environmentName,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
