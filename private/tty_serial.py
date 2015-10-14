#!/usr/bin/python
import sys
import serial
import os

port = serial.Serial("/dev/ttyUSB0", 19200)

port = serial.Serial(
    port='/dev/ttyUSB0',
    baudrate=19200,
    bytesize=8,
    parity='N',
    stopbits=1
)

num = sys.argv[1]

port.write("sw i0" + num + "\r\n")

port.close()
