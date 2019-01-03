Build _site for production
`JEKYLL_ENV=production bundle exec jekyll build`

Delete remote `gh-pages` branch
`git push origin --delete gh-pages`

Delete local `gh-pages` branch
`git branch -D gh-pages`

Create orphaned `gh-pages` branch
`git checkout --orphan gh-pages`

Stage the _site folder and commit
`git add _site/ && git commit -m "Initial _site subtree commit`

Push changes to `gh-pages`
`git subtree push --prefix _site origin gh-pages`

