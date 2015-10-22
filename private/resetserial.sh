METEORUSER=user1234

sudo chmod o+rw /dev/ttyUSB0
sudo echo ^v^o > /dev/ttyUSB0
sudo usermod -a -G dialout $METEORUSER
sudo chmod 775 /dev/ttyUSB0
screen -dm /dev/ttyUSB0 19200
pgrep screen | xargs kill -9
sudo chown $METEORUSER:dialout /dev/ttyUSB0
