# Limit PR Changes Action
This is GitHub action, that sets a PR checkrun status depending on the number of
changes in the PR.

You can set limits for `warning` and `error` in the action's inputs.

Number of `changes` is counted as `additions + deletions`.

## Workflow example
Put this in `.github/workflows/pr.yaml`
```
name: PR checks

on:
  pull_request:

jobs:

  limit-changes:
    runs-on: ubuntu-latest
    name: PR checks
    steps:
      - name: limit-changes
        id: limit-changes
        uses: WhoMeNope/limit-changes-action@releases/v1
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          warning: 1000
          error: 2000
```
