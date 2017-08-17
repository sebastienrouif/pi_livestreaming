pi_livestreaming
================

[Raspberry Pi, Camera and Node.js – Live Streaming with Websockets #IoT](http://thejackalofjavascript.com/rpi-live-streaming)


NPM server :
npm init
npm install express socket.io --save
npm install raspistill --save
sudo apt-get install libgphoto2-dev
sudo apt-get install libgphoto2-2-dev
npm install gphoto2 --save
https://github.com/lwille/node-gphoto2/issues/67 -> 
	git clone git@github.com:lwille/node-gphoto2.git && cd node-gphoto2
	git checkout feature/nan
	npm install
	npm link
	# cd to your project directory
	npm link gphoto2
npm install onoff --save

USB METWORK 
share over USB : http://elinux.org/How_to_use_an_Android_tablet_as_a_Raspberry_Pi_console_terminal_and_internet_router


static ip address USB 
nano /etc/network/interfaces
	allow-hotplug usb0

	iface usb0 inet static
	    address 192.168.42.10
	    netmask 255.255.255.0

Socket.io android client
 https://github.com/nkzawa/socket.io-android-chat


 Push button
 http://www.arduinoclassroom.com/index.php/arduino-101/chapter-4a 
 https://github.com/androidthings/sample-button