import * as core from '@actions/core'
import * as github from '@actions/github'

import * as status from './status'

interface PullRequestInfo {
  owner: string
  repo: string
  number: number
  sha: string
  ref: string
}

async function run(): Promise<void> {
  try {
    const warningLimit = Number(core.getInput('warning'))
    const errorLimit = Number(core.getInput('error'))

    // This should be a token with access to your repository scoped in as a secret.
    // The YML workflow will need to set myToken with the GitHub Secret Token
    // repo-token: ${{ secrets.GITHUB_TOKEN }}
    const token = core.getInput('repo-token')
    const octokit = new github.GitHub(token)

    const pr = getPullRequestInfo()
    if (!pr) {
      core.setFailed('Could not get pull request info.')
      return
    }

    const statuscheck = status(octokit.checks, pr)

    const {data: pullRequest} = await octokit.pulls.get({
      owner: pr.owner,
      repo: pr.repo,
      pull_number: pr.number
    })

    const changes = pullRequest.additions + pullRequest.deletions

    if (changes > errorLimit) {
      await statuscheck.error()
    } else if (changes > warningLimit) {
      await statuscheck.warning()
    } else {
      await statuscheck.success()
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

function getPullRequestInfo(): PullRequestInfo | undefined {
  const {owner, repo, number} = github.context.issue

  const pullRequest = github.context.payload.pull_request
  if (!pullRequest) {
    return undefined
  }

  const {sha, ref} = github.context

  return {
    owner,
    repo,
    number,
    sha,
    ref
  }
}

run()
