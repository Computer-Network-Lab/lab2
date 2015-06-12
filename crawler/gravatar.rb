Dir.chdir(__dir__)

Dir["*/IMGS"].each do |info|
  dir = File.dirname(info)
  File.read(info).each_line do |line|
    who, url = line.split
    `wget '#{url}0' -O #{dir}/#{who}.png -q`
  end
end
