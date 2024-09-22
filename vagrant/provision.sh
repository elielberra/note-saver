#!/bin/bash -e

# Prevent apt-get to ask for user input
export DEBIAN_FRONTEND=noninteractive

apt-get update

# Install GUI for ubuntu
echo "Installing and configuring the UI for the Operating System"
apt-get install -y xfce4 virtualbox-guest-dkms virtualbox-guest-utils virtualbox-guest-x11
# Allow all users to start the GUI
sed -i 's/allowed_users=.*$/allowed_users=anybody/' /etc/X11/Xwrapper.config
# Start the GUI automatically when a user logs into Jammy
tee -a .bash_profile <<EOF
if [[ -z "\${DISPLAY}" && "\$(tty)" =~ /dev/tty* ]]; then
  startx
fi
EOF
echo "The UI was successfully configured"

# Install Docker
echo "Installing Docker"
apt-get install -y ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
if systemctl is-active --quiet docker; then
    echo "Docker service is running."
else
    echo "Docker service is not running."
fi
# Add vagrant user to docker group
usermod -aG docker vagrant
# Apply changes witout logging out
newgrp docker
echo "Docker was successfully configured"

# Install Docker Compose
echo "Installing Docker Compose"
mkdir -p /home/vagrant/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o /home/vagrant/.docker/cli-plugins/docker-compose
chmod +x /home/vagrant/.docker/cli-plugins/docker-compose
docker compose version
echo "Docker Compose was successfully configured"

# Install Google Chrome
echo "Installing Google Chrome"
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt-get install -y ./google-chrome-stable_current_amd64.deb
echo "Google Chrome was successfully configured"

# Create file for initializing pseudo random numbers for Certificates
echo "Creating pseudo random file for Certificates"
opensslRandFile="/home/vagrant/.rnd"
openssl rand -out ${opensslRandFile} -hex 256
chown vagrant:vagrant ${opensslRandFile}

echo "Login to the Ubuntu  session on the VM's UI with the user \`vagrant\` and the password \`vagrant\`"
echo "When prompted for the setup of the first startup select 'Use default config'"
echo "Launch first \`google-chrome\` from the console to initialize the browser"
echo "Clone the repository with \`git clone https://github.com/elielberra/note-saver.git\`"
echo "Change to the directory of the repository with \`cd <path_to_repo>/note-saver\`"
echo "Then run the script \`bash scripts/setupLocalEnvironment.sh\`"
echo "Start the app with \`docker compose up\`"
echo "Access https://notesaver:3000 on the browser"
echo "The VM was succesfully configured!"
