##############
# Jekyll tasks
##############
test_url = "yankie.ru:/home/yankie/web/scramble.yankie.ru/public_html/"
dev_url = "yankie.ru:/home/yankie/projects/scramble.yankie.ru"
prod_url = "yankie.ru:/home/yankie/web/scramble.yankie.ru/public_html/"
# Usage: rake serve, rake serve:prod
task :serve => ["serve:dev"]
namespace :serve do

  desc "Serve development Jekyll site locally"
  task :dev do
    puts "Starting up development Jekyll site server..."
    system "JEKYLL_ENV=development bundle exec jekyll serve"
  end

  desc "Serve production Jekyll site locally"
  task :prod do
    puts "Starting up production Jekyll site server..."
    system "JEKYLL_ENV=production bundle exec jekyll serve"
  end
end

# Usage: rake build, rake build:dev, rake build:drafts
task :build => ["build:prod"]
namespace :build do

  desc "Regenerate files for production"
  task :prod do
    puts "* Regenerating files for production..."
    system "JEKYLL_ENV=production bundle exec jekyll build"
  end

  desc "Regenerate files for development"
  task :dev do
    puts "* Regenerating files for development..."
    system "JEKYLL_ENV=development bundle exec jekyll build"
  end
end

##################
# Deployment tasks
##################

# Usage: rake rsync
task :rsync => ["rsync:prod"]
namespace :rsync do

  desc "rsync the contents of ./_site to the test server"
  task :test do
    puts "* rsyncing the contents of ./_site to the test server"
    system "rsync --perms --recursive --verbose --compress --delete --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r _site/ " + test_url
  end

  desc "rsync the contents of ./_site to the production server"
  task :prod do
    puts "* rsyncing the contents of ./_site to the production server"
    system "rsync --perms --recursive --verbose --compress --delete --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r _site/ " + prod_url
  end

  # desc "rsync the contents of ./ to the development server"
  # task :dev do
  #   puts "* rsyncing the contents of ./ to the development server"
  #   system "rsync --perms --recursive --verbose --compress --delete --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r . yankie@evilkoalas.ru:/home/yankie/projects/luka/dev/lukacheese.ru.jekyll/."
  # end
end

# Usage: rake macrsync
task :macrsync => ["macrsync:prod"]
namespace :macrsync do

  desc "macrsync the contents of ./_site to the test server"
  task :test do
    puts "* rsyncing the contents of ./_site on mac to the test server"
    system "rsync --iconv=UTF-8-MAC,UTF-8 --perms --recursive --verbose --compress --delete --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r _site/ " + test_url
  end

  desc "macrsync the contents of ./_site to the production server"
  task :prod do
    puts "* rsyncing the contents of ./_site on mac to the production server"
    system "rsync --iconv=UTF-8-MAC,UTF-8 --perms --recursive --verbose --compress --delete --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r _site/ " + prod_url
  end

  # desc "macrsync the contents of ./ to the development server"
  # task :dev do
  #   puts "* rsyncing the contents of ./_site on mac to the development server"
  #   system "rsync --iconv=UTF-8-MAC,UTF-8 --perms --recursive --verbose --compress --delete --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r . yankie@evilkoals.ru:/home/yankie/projects/luka/dev/lukacheese.ru.jekyll/."
  # end
end

# Usage: rake deploy, rake deploy:win
task :deploy => ["deploy:prod"]
namespace :deploy do
  desc "Regenerate and rsync production files and notify services of the update"
  task :test => ["build", "rsync:test"] do
  end

  desc "Regenerate and rsync production files and notify services of the update"
  task :prod => ["build", "rsync:prod"] do
  end
end

# Usage: rake deploy, rake deploy:win
task :macdeploy => ["macdeploy:prod"]
namespace :macdeploy do
  desc "Regenerate and rsync production files and notify services of the update"
  task :test => ["build", "macrsync:test"] do
  end

  desc "Regenerate and rsync production files and notify services of the update"
  task :prod => ["build", "macrsync:prod"] do
  end
end

# task :down => ["down:dev"]
# namespace :down do

#   desc "rsync the contents of ./ to the development server"
#   task :dev do
#     puts "* rsyncing the contents of ./ to the development server"
#     system "rsync --perms --recursive --verbose --compress --delete --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r yankie@evilkoalas.ru:/home/yankie/projects/luka/dev/lukacheese.ru.jekyll/. ."
#   end
# end

task :clean do
  puts "* clean up"
  system "rm -rf .jekyll-cache/ _site/"
end
