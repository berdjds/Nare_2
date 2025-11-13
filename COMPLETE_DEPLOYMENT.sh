#!/usr/bin/expect -f

set timeout -1

# VPS credentials
set password "dC7Be3(2u2j)"
set host "213.136.80.87"

puts "\n🚀 COMPLETE DEPLOYMENT - Nare Travel"
puts "======================================\n"
puts "Step 1: Uploading Docker image (191MB)...\n"

# Upload the image
spawn scp naresima-latest.tar.gz root@$host:/tmp/
expect {
    "password:" {
        send "$password\r"
        exp_continue
    }
    "100%" {
        puts "\n✅ Upload complete!\n"
    }
}

puts "\nStep 2: Connecting to VPS and deploying...\n"

# SSH and deploy
spawn ssh root@$host
expect {
    "password:" {
        send "$password\r"
    }
}

expect "~#" {
    send "cd /tmp\r"
}

expect "~#" {
    send "echo '\n📦 Loading Docker image...'\r"
}

expect "~#" {
    send "docker load < naresima-latest.tar.gz\r"
}

expect "~#" {
    send "echo '\n✅ Image loaded'\r"
}

expect "~#" {
    send "echo '\n🔍 Checking what is currently running...'\r"
}

expect "~#" {
    send "docker ps | grep -E 'nare|naresima'\r"
}

expect "~#" {
    send "echo '\n🛑 Stopping ALL old Nare containers...'\r"
}

expect "~#" {
    send "docker stop naresima-app 2>/dev/null || echo 'naresima-app not running'\r"
}

expect "~#" {
    send "docker rm naresima-app 2>/dev/null || echo 'naresima-app removed'\r"
}

expect "~#" {
    send "docker stop nare-travel 2>/dev/null || echo 'nare-travel not running'\r"
}

expect "~#" {
    send "docker rm nare-travel 2>/dev/null || echo 'nare-travel removed'\r"
}

expect "~#" {
    send "echo '\n🚀 Starting NEW container with Traefik labels...'\r"
}

expect "~#" {
    send "docker run -d --name naresima-app --restart always --network web -e NODE_ENV=production -v /root/productionapp/nare-travel/data:/app/data -v /root/productionapp/nare-travel/public/images/uploads:/app/public/images/uploads -l 'traefik.enable=true' -l 'traefik.http.routers.nare.rule=Host(\`berdjds.com\`) || Host(\`www.berdjds.com\`)' -l 'traefik.http.routers.nare.entrypoints=web' -l 'traefik.http.routers.nare.middlewares=redirect-to-https' -l 'traefik.http.routers.nare-secure.rule=Host(\`berdjds.com\`) || Host(\`www.berdjds.com\`)' -l 'traefik.http.routers.nare-secure.entrypoints=websecure' -l 'traefik.http.routers.nare-secure.tls.certresolver=le' -l 'traefik.http.services.nare.loadbalancer.server.port=3000' naresima:latest\r"
}

expect "~#" {
    send "echo '\n⏳ Waiting 15 seconds for container to fully start...'\r"
}

expect "~#" {
    send "sleep 15\r"
}

expect "~#" {
    send "echo '\n📊 Container Status:'\r"
}

expect "~#" {
    send "docker ps | grep naresima\r"
}

expect "~#" {
    send "echo '\n📝 Container Logs (last 30 lines):'\r"
}

expect "~#" {
    send "docker logs --tail=30 naresima-app\r"
}

expect "~#" {
    send "echo '\n🔧 Restarting Traefik to pick up new routes...'\r"
}

expect "~#" {
    send "docker restart traefik\r"
}

expect "~#" {
    send "echo '\n⏳ Waiting 10 seconds for Traefik...'\r"
}

expect "~#" {
    send "sleep 10\r"
}

expect "~#" {
    send "echo '\n✅ Testing if app responds locally...'\r"
}

expect "~#" {
    send "docker exec naresima-app wget -qO- http://localhost:3000 2>&1 | head -c 300\r"
}

expect "~#" {
    send "echo '\n\n🧹 Cleaning up...'\r"
}

expect "~#" {
    send "rm -f /tmp/naresima-latest.tar.gz\r"
}

expect "~#" {
    send "echo '\n✅ DEPLOYMENT COMPLETE!'\r"
}

expect "~#" {
    send "echo '\n🌐 Website: https://berdjds.com'\r"
}

expect "~#" {
    send "echo 'Hard refresh: Cmd+Shift+R'\r"
}

expect "~#" {
    send "echo '\nPress ENTER to exit...'\r"
}

expect "~#" {
    send "exit\r"
}

expect eof

puts "\n\n🎉 Deployment script completed!\n"
puts "Visit https://berdjds.com and hard refresh (Cmd+Shift+R)\n"
