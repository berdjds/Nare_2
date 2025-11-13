#!/usr/bin/expect -f

set timeout -1

spawn ssh root@213.136.80.87

expect "password:"
send "dC7Be3(2u2j)\r"

expect "# "
send "cd /root/productionapp\r"

expect "# "
send "curl -sSL https://raw.githubusercontent.com/berdjds/Nare_2/main/update-nare-docker.sh -o update.sh\r"

expect "# "
send "chmod +x update.sh\r"

expect "# "
send "./update.sh\r"

expect eof
