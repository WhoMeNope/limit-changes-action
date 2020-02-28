import * as octokit from '@octokit/rest'

import * as types from './types.d'

interface Checks {
  create: {
    (
      params?:
      octokit.Octokit.RequestOptions & octokit.Octokit.ChecksCreateParams
    ): Promise<octokit.Octokit.Response<octokit.Octokit.ChecksCreateResponse>>

    endpoint: octokit.Octokit.Endpoint
  }
}

export interface Checkrun {
  error(): Promise<void>
  warning(): Promise<void>
  success(): Promise<void>
}

export interface CheckrunInfo {
  owner: string,
  repo: string
  head_sha: string
}

function checkrun(
  checks: Checks,
  name: string,
  statusInfo: CheckrunInfo
): Checkrun {
  const started_at = new Date().toJSON()

  async function error(): Promise<void> {
    await checks.create({
      name,
      ...statusInfo,
      status: 'completed',
      started_at,
      completed_at: new Date().toJSON(),
      conclusion: 'action_required',
      details_url: 'https://trunkbaseddevelopment.com/',
      output: {
        title: "So many changes deserve multiple PR's",
        summary: `
        Did you know?
        Making big pull requests slows down projects in multiple ways.

        1. Blocks others from working on these parts of the codebase
        2. Increases friction in the team, since more coordination is necessary
        3. Lowers team agility and makes it more difficult to tackle incoming challenges

        These, and many more, are reasons why you should keep your PR's smol!
        `,
        images: [
          {
            image_url: 'https://i.imgur.com/hd018EV.gif',
            alt: 'See, it does not work'
          }
        ]
      }
    })
  }

  async function warning(): Promise<void> {
    await checks.create({
      name,
      ...statusInfo,
      status: 'completed',
      started_at,
      completed_at: new Date().toJSON(),
      conclusion: 'neutral',
      output: {
        title: "This is gettin' chunky",
        summary: `
        Consider refactoring this into multiple PR's.
        `
      }
    })
  }

  async function success(): Promise<void> {
    await checks.create({
      name,
      ...statusInfo,
      status: 'completed',
      started_at,
      completed_at: new Date().toJSON(),
      conclusion: 'success',
      output: {
        title: 'Perfectly fun-sized',
        summary: 'Line by line getting to the finish line.',
        images: [
          {
            image_url: 'https://i.imgur.com/fTTFaHN.gif',
            alt: 'Gotta go fast'
          }
        ]
      }
    })
  }

  return {
    error,
    warning,
    success
  }
}

export default checkrun
