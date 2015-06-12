require "nokogiri"
require "curb"

Dir.chdir(__dir__)

%w[ C C++ CSS JavaScript PHP Python Ruby ].each do |lang|
  next if File.exists? lang
  html = Nokogiri.parse Curl.get("https://github.com/trending?l=#{lang.downcase}&since=monthly").body
  `mkdir -p '#{lang}'`
  File.write("#{lang}/IMGS", html.css(".repo-list-item .avatar").map {|e| e["title"] + " " + e["src"] }.join("\n"))
end
