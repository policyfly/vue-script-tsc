#!/usr/bin/env node
import * as minimist from 'minimist'

import { tsc } from '.'
import { Options } from './args'
import { COLORS } from './utils'

const options = minimist(process.argv.slice(2)) as Options

tsc(options)
  .then(() => {
    console.log(COLORS.SUCCESS, 'Type Check complete, no errors found')
  })
  .catch((err) => {
    console.error(err.message)
    process.exit(1)
  })
