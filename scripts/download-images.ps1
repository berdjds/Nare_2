# PowerShell script to download images from URLs and save them to local folders
# Create WebClient to download files
$webClient = New-Object System.Net.WebClient

# Function to download an image
function Download-Image {
    param (
        [string]$url,
        [string]$destination
    )
    
    try {
        # Create the directory if it doesn't exist
        $directory = Split-Path -Path $destination -Parent
        if (-not (Test-Path -Path $directory)) {
            New-Item -ItemType Directory -Path $directory -Force | Out-Null
        }
        
        # Download the image
        Write-Host "Downloading image from $url to $destination..."
        $webClient.DownloadFile($url, $destination)
        Write-Host "Download complete: $destination" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "Error downloading image: $_" -ForegroundColor Red
        return $false
    }
}

# Download hero images
Download-Image -url "https://nare.am/wp-content/uploads/2022/02/Armenia-G-19-e1645769748907.jpg" -destination "public\images\hero\armenia-main.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2022/05/vernissage.jpg" -destination "public\images\hero\vernissage.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2022/02/Armenia-G-19-e1645769748907.jpg" -destination "public\images\hero\noravank.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/Garni-1.jpg" -destination "public\images\hero\garni.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/republic-square-in-yerevan-downtown-armenia-e1652434477957.jpg" -destination "public\images\hero\republic-square.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/Lake-Sevan.jpg" -destination "public\images\hero\lake-sevan.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2022/02/Armenia-G-16-e1645769995353.jpg" -destination "public\images\hero\tatev.jpg"

# Download tour images
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/Garni.jpg" -destination "public\images\tours\garni.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2022/02/Armenia-G-18-e1645769728739.jpg" -destination "public\images\tours\khor-virap.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/Lake-Sevan.jpg" -destination "public\images\tours\lake-sevan.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/dilijan-national-park-hike-with-lake-parz.5e95b76ce248b-full.jpg" -destination "public\images\tours\dilijan.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2022/02/Armenia-G-19-e1645769748907.jpg" -destination "public\images\tours\noravank.jpg"

# Download service images
Download-Image -url "https://nare.am/wp-content/uploads/2022/05/vernissage.jpg" -destination "public\images\services\flight.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/republic-square-in-yerevan-downtown-armenia-e1652434477957.jpg" -destination "public\images\services\visa.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/429_Djermouk_canyon_a_lentree_de_la_ville_vu_du_pont-scaled-1.jpg" -destination "public\images\services\mice.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2022/02/Armenia-G-16-e1645769995353.jpg" -destination "public\images\services\dmc.jpg"

# Download destination images
Download-Image -url "https://nare.am/wp-content/uploads/2022/02/Armenia-G-18-e1645769728739.jpg" -destination "public\images\destinations\dubai.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/Lake-Sevan.jpg" -destination "public\images\destinations\europe.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2022/02/Armenia-G-19-e1645769748907.jpg" -destination "public\images\destinations\turkey.jpg"

# New destinations (using existing images temporarily)
Download-Image -url "https://nare.am/wp-content/uploads/2022/02/Armenia-G-18-e1645769728739.jpg" -destination "public\images\destinations\sharm.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/Garni-1.jpg" -destination "public\images\destinations\cyprus.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2022/02/Armenia-G-16-e1645769995353.jpg" -destination "public\images\destinations\abu-dhabi.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/republic-square-in-yerevan-downtown-armenia-e1652434477957.jpg" -destination "public\images\destinations\tunisia.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/Lake-Sevan.jpg" -destination "public\images\destinations\zanzibar.jpg"

# Download team images
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/dilijan-national-park-hike-with-lake-parz.5e95b76ce248b-full.jpg" -destination "public\images\team\office.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/429_Djermouk_canyon_a_lentree_de_la_ville_vu_du_pont-scaled-1.jpg" -destination "public\images\team\meeting.jpg"

# Download adventure images
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/dilijan-national-park-hike-with-lake-parz.5e95b76ce248b-full.jpg" -destination "public\images\adventure\hiking.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/Lake-Sevan.jpg" -destination "public\images\adventure\camping.jpg"

# Download cultural images
Download-Image -url "https://nare.am/wp-content/uploads/2022/02/Armenia-G-16-e1645769995353.jpg" -destination "public\images\cultural\monastery.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2022/05/vernissage.jpg" -destination "public\images\cultural\festival.jpg"

# Download ticket images
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/republic-square-in-yerevan-downtown-armenia-e1652434477957.jpg" -destination "public\images\tickets\economy.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2022/02/Armenia-G-16-e1645769995353.jpg" -destination "public\images\tickets\business.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2022/05/vernissage.jpg" -destination "public\images\tickets\first.jpg"
Download-Image -url "https://nare.am/wp-content/uploads/2020/06/dilijan-national-park-hike-with-lake-parz.5e95b76ce248b-full.jpg" -destination "public\images\tickets\group.jpg"

Write-Host "All images downloaded successfully!" -ForegroundColor Green

# Clean up
$webClient.Dispose()
