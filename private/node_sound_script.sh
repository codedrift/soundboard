#!/bin/sh

lockfile=assets/app/lock
played=false

while [ $played = false ]
do
	if ( set -o noclobber; echo "$$" > "$lockfile") 2> /dev/null; then

		played=true

		trap 'rm -f "$lockfile"; exit $?' INT TERM EXIT


		mpv --no-terminal $1/$2

		rm -f "$lockfile"


		trap - INT TERM EXIT

		echo '{"playQueueId": "'"$3"'"}'

	else
		sleep 0.1
	fi
done



n