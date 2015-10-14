PROJECT=chaosboard
METEORUSER=chaosboard
UPSTARTNAME=chaosboard

git pull

meteor build .

sudo rm -rf /home/$METEORUSER/$PROJECT.tar.gz
sudo rm -rf /home/$METEORUSER/bundle

sudo mv $PROJECT.tar.gz /home/$METEORUSER/
cd /home/$METEORUSER

sudo tar -zxf $PROJECT.tar.gz

cd bundle/programs/server
npm install
sudo chown $METEORUSER:$METEORUSER /home/$METEORUSER -R

sudo restart $UPSTARTNAME