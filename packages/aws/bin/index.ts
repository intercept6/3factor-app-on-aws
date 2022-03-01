#!/usr/bin/env node

import 'source-map-support/register';
import {App} from 'aws-cdk-lib';
import {ThreeFactorAppOnAwsStack} from '../lib/three-factor-app-on-aws-stack';

const app = new App();
new ThreeFactorAppOnAwsStack(app, 'ThreeFactorAppOnAwsStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
