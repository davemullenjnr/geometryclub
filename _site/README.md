Workaround to deploy site.

Push any new changes to the master branch.

Then, `JEKYLL_ENV=production bundle exec jekyll build`

Copy newly generate _site folder using Finder.

`git checkout gh-pages`

Delete contents of gh-pages branch, paste new _site folder contents in it's place. Use GitHub desktop to commit changes then push.

`git checkout master`