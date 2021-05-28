#!/usr/bin/env node
import * as minimist from 'minimist'

import { tsc } from '.'
import { Options } from './args'

const options = minimist(process.argv.slice(2)) as Options

tsc(options)
  .then(() => {
    console.log('Type Check Complete')
  })
  .catch((err) => {
    console.error(err.message)
    process.exit(1)
  })
