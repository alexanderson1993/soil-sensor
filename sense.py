import time
import datetime
from board import SCL, SDA import busio
from adafruit_seesaw.seesaw import Seesaw
import sqlite3

# Initialize SQLite3 connection
connection = sqlite3.connect("soil.db")
cursor = connection.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS soil (timestamp TEXT, temp REAL, moisture REAL)")

i2c_bus = busio.I2C(SCL, SDA)
ss = Seesaw(i2c_bus, addr=0x36)
while True:
  # read moisture level through capacitive touch pad 
  touch = ss.moisture_read()
  # read temperature from the temperature sensor 
  temp = ss.get_temp()
  print("temp: " + str(temp) + " moisture: " + str(touch))
  cursor.execute("INSERT INTO soil VALUES ('" + datetime.datetime.now().isoformat() + "'," + temp + ","+touch+")")
  time.sleep(5)