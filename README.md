# vercel-branch-preview-url-action

> Generate the branch preview URL for a Vercel deployment

## Inputs

- `vercel-team-id`: your Vercel team ID
- `vercel-project-name`: your Vercel project name
- `git-branch-name`: the Git branch name

## Outputs

- `url`: the branch preview URL

## Example

```
jobs:
  branch-preview-url:
    steps:
      - name: Generate branch preview URL
        id: branch-preview-url
        uses: PenfoldTechnology/vercel-branch-preview-url-action@v1
        with:
          git-branch-name: ${{ github.head_ref || github.ref_name }}
          vercel-project-name: fancy-project
          vercel-team-id: fancy-team
      - name: Print URL
        run: echo "${{ steps.branch-preview-url.outputs.url }}"
```
