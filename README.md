# About
This is the last soundboard you will ever need!

![SipHub](/readme-files/siphub.png?raw=true "Optional Title")

## Functionality

### Sounds
Sounds located on the server can be played on the server. If it has speakers attached, you will be able to hear the sound ;)

So far this is the main feature. The siphub indexes a directory and displays the soundfiles based on categories (folders) on the main page. With the search dunctionality you can then find sounds, play them or add them as a favorite so they appear at the top on the main page when you are logged in.
See a list of the top played songs. More stats coming...

<!-- ### Switch the HDMI port
The siphub also offers a handy page to switch the HDMI output port. Typically this works with an 8-port HDMI splitter that can be managed via a serial interface. -->

<!--### Moar functionality coming all the time

This isn't it yet! To help agile teams achive their best a few more things need to happen.
Here are some buzzwords: trello, git, cronjob sounds -->

# Install

### Basix

* Install latest meteor version

```bash
curl https://install.meteor.com/ | sh
```
To quickly run it in debug mode simply use the "meteor" command.
Otherwise go on...

### Live setup

* Install latest nodejs version

* Install mongodb

### Sounds

* Install sox and

<!-- ### HDMI

* install python and python-serial

* Give the serial port all the rights. (Usually thats a little tricky) refer to "/private/resetserial.sh" for the required commands. Executing the script usually does the trick. Some commands in there might be unnecessary though... -->

# Config
Go to the settings page, set the absolute path to the soundfiles directory and choose "Initialize sound collection". This is the initial index. After that if you add new sounds to the soundfiles directory hit "Update sound collection" to add these sounds to the soundboard.

DELETED SOUNDS CAN ONLY BE REMOVED FROM THE COLLECTION BY HAND!
This is one of the next things thats gonna happen here...

# "API"

For some reasons you might wanna trigger a sound via a curl or sth.

use [ip]/api/play/:id where :id is the id of the sound you want to play. this is the id that is used within the mongodb sound collection.

# Common fixes for common problems
<!-- HDMI not working? -> Run "resetserial.sh" -->

Sounds not playing? -> some lib missing? Speakers plugged in?
