import * as core from '@actions/core'
import * as github from '@actions/github'

import * as types from './types.d'

import checkrun from './checkrun'

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

    const {data: pullRequest} = await octokit.pulls.get({
      owner: pr.owner,
      repo: pr.repo,
      pull_number: pr.number
    })

    const changes = pullRequest.additions + pullRequest.deletions

    const check = checkrun(octokit.checks, 'Changes', {
      owner: pr.owner,
      repo: pr.repo,
      head_sha: pullRequest.head.sha
    })

    if (changes > errorLimit) {
      await check.error()
    } else if (changes > warningLimit) {
      await check.warning()
    } else {
      await check.success()
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

function getPullRequestInfo(): types.PullRequestInfo | undefined {
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
