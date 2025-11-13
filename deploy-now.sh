#!/usr/bin/expect -f

set timeout 600

puts "\n"
puts "🚀 Deploying Nare Travel to berdjds.com"
puts "========================================\n"

# SSH to VPS
spawn ssh root@213.136.80.87

# Handle password
expect {
    "password:" {
        send "dC7Be3(2u2j)\r"
        exp_continue
    }
    "# " {
        # Successfully logged in
    }
}

puts "\n✓ Connected to VPS\n"

# Navigate to production directory
send "cd /root/productionapp\r"
expect "# "

puts "📁 In production directory\n"

# Download update script
send "curl -sSL https://raw.githubusercontent.com/berdjds/Nare_2/main/update-nare-docker.sh -o update.sh\r"
expect "# "

puts "📥 Downloaded update script\n"

# Make executable
send "chmod +x update.sh\r"
expect "# "

# Run the update script
send "./update.sh\r"

# Wait for completion and show output
expect {
    "Update Complete!" {
        puts "\n✅ Deployment successful!\n"
    }
    "failed!" {
        puts "\n❌ Deployment failed!\n"
    }
    timeout {
        puts "\n⚠️ Script is still running...\n"
    }
}

# Keep connection open to see final output
expect "# "

# Exit
send "exit\r"
expect eof

puts "\n"
puts "🌐 Visit https://berdjds.com to see your updates!"
puts "\n"
