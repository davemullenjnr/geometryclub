In order to get this working in 2022 I had to install `chruby` (via `homebrew` ) and then the ruby version that got it working was `2.5.0`. This enabled me to be able to run `gem install jekyll` and then `gem install bundler` and finally run `bundle install` followed by `bundle exec jekyll serve` to get the dev environment running.

Check out:
https://jekyllrb.com/docs/installation/macos/
https://jekyllrb.com/docs/ruby-101/