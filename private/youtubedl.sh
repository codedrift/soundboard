#!/bin/bash

# ARGS
# $1 - base directory
# $2 - youtube link
# $3 - starttime
# $4 - endtime

mkdir -p $1/youtube
cd $1/youtube

names=$(youtube-dl --get-filename --audio-format mp3 -e -x $2)
duration=$(youtube-dl --get-duration -e -x $2)
title=$(echo "$names" | head -1 | tr '[:upper:]' '[:lower:]' | tr ' ' '_')
file=$(echo "$names" | tail -1)
title=$(echo "$title" | sed 's/Ä/Ae/g' | sed 's/Ö/Oe/g' | sed 's/Ü/Ue/g' | sed 's/ä/ae/g' | sed 's/ö/oe/g' | sed 's/ü/ue/g' | sed 's/ß/ss/g' | sed 's/[^a-z0-9_-]//g')
mp3file=$(echo "$file" | cut -d '.' -f1).mp3

youtube-dl --audio-format mp3 -x "$2"

echo "start " $3
echo "end " $4

cutmp3 -i "$mp3file" -O "$title".mp3 -a $3 -b $4

#cutmp3 -i "$mp3file" -O "$title".mp3
#echo $mp3file
#echo "$(echo $title).mp3"

rm "$mp3file"
