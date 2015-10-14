echo 12345678 | sudo -S -u root chmod o+rw /dev/ttyUSB0
echo 12345678 | sudo -S -u root echo ^v^o > /dev/ttyUSB0
echo 12345678 | sudo -S -u root usermod -a -G dialout chaosboard
echo 12345678 | sudo -S -u root chmod 775 /dev/ttyUSB0
screen -dm /dev/ttyUSB0 19200
pgrep screen | xargs kill -9
echo 12345678 | sudo -S -u root chown chaosboard:dialout /dev/ttyUSB0