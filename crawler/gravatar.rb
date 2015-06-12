Dir.chdir(__dir__)

Dir["*/IMGS"].each do |info|
  dir = File.dirname(info)
  File.read(info).each_line do |line|
    who, url = line.split
    path = "#{dir}/#{who}.png"
    `wget '#{url}0' -O #{path} -q` unless File.exists? path
  end
end
