/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { argv } from 'yargs';
import { FtrConfigProviderContext } from '@kbn/test';
import { cypressRunTests } from './cypress_start';

const spec = argv.grep as string;

async function runE2ETests({ readConfigFile }: FtrConfigProviderContext) {
  const cypressConfig = await readConfigFile(require.resolve('./config.ts'));
  return {
    ...cypressConfig.getAll(),
    testRunner: cypressRunTests(spec),
  };
}

// eslint-disable-next-line import/no-default-export
export default runE2ETests;
