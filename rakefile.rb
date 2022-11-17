include Rake::DSL

require 'date'
require 'configatron' 

configatron.posts_dir       =     './_posts'

task :default do
  puts ""
  puts "   Run 'rake -T' for full task listing"
  puts "" 
end

desc "Runs the site locally"
task :serve do
  begin
    system("bundle exec jekyll serve")
  rescue SystemExit, Interrupt
    #do nothing here
  end
end

desc "Builds the site locally"
task :build do
  system("bundle exec jekyll build")
end

desc "Adds the proper structure for a new post into the site based on your input"
task :new  do
  puts "What is the title of the new post?"
  postTitleInput = $stdin.gets.chomp
  postTitleInput.strip!
  postTitleClean = postTitleInput.downcase
  postTitleClean.strip!
  postTitleClean.gsub!(/[ ]/, '-')
  postTitleClean.gsub!(/[^0-9A-Za-z\-]/, '')
  postTitleClean.gsub!(/[-]/, ' ')
  postTitleClean.strip!
  postTitleClean.gsub!(/[ ]/, '-')
  postTitleClean.gsub!(/(-{2,})/, '-')
  
  puts "What is a short description of this new post?"
  postDescriptionInput = $stdin.gets.chomp

  puts "What tags would you like to associate with the post? (comma-delimited)"
  postTagsInput = $stdin.gets.chomp
  postTagsArray = postTagsInput.split(/\s*,\s*/)
  postTagsArray.map! { |a| a.downcase }
  postTagsArray.map! { |a| a.gsub(/[ ]/, '')}
  postTagsArray.map! { |a| a.gsub(/[^A-Za-z\,\-]/, '')}

  now = DateTime.now
  postDate = now.to_date #.strptime("%Y-%m-%d")
  postYear = postDate.year
  postFilename = "#{postDate}-#{postTitleClean}"

  postLiquid = <<EOF
---
title: "#{postTitleInput}"
date: "#{now}"
categories: [#{postTagsArray.join(",")}]
description: "#{postDescriptionInput}"
---

<TYPE YO POST HERE, AND DON'T FORGET THE COVER IMAGE!>

EOF

  yearPath = File.expand_path(File.join(Dir.pwd, configatron.posts_dir, postYear.to_s))

  puts yearPath
  if(!Dir.exists?(yearPath))
    mkdir(yearPath)
  end

  fullPath = File.expand_path(File.join(yearPath, postFilename))
  if(Dir.exists?(fullPath))
    abort("The folder with the exact path already exists... [#{fullPath}]")
  else
    mkdir(fullPath)
  end

  fullFileName = File.expand_path(File.join(fullPath, "#{postFilename}.md"))
  if(File.exists?(fullFileName))
    abort("A post with the exact path already exists... [#{fullFileName}]")
  else
    File.open(fullFileName, "w") { |f| f.write(postLiquid)}
  end

  puts "Opening new post in your editor... [#{fullFileName}]"
  system("code #{fullFileName}")
end
