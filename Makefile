# auto install package depenencies  present on package.json 
# by default parcel use default port 
# set new PORT  
.SILENT:
HOST=localhost 
srcfile=mainrtc.js 
defaulthtmlfile=index.html

install : package.json 
	@npm install 

start : #enable the parcel server developpement 
	echo "lauching  Parcel  Server ... " 
	@npm run prclServ 

#update dependencies 
package-json.lock : package.json 
	@npm update

cache-clear : #clear the cache 
	rm -rv .cache/
