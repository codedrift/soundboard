sudo chmod o+rw /dev/ttyUSB0
sudo echo ^v^o > /dev/ttyUSB0
sudo usermod -a -G dialout chaosboard
sudo chmod 775 /dev/ttyUSB0
screen -dm /dev/ttyUSB0 19200
pgrep screen | xargs kill -9
sudo chown chaosboard:dialout /dev/ttyUSB0