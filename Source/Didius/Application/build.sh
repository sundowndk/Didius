#!/bin/bash
#
# Usage: build.sh [outputdirectory]

####################################################
# INIT                                             #
####################################################
BASEDIR=$(dirname "$1")
OUTPUTDIR="$1"

####################################################
# CLEAN                                            #
####################################################
echo "Cleaning previous build..."
rm "$OUTPUTDIR/app/" -r

####################################################
# RESOURCES                                        #
####################################################
echo "Copying 'xul''..."
mkdir "$OUTPUTDIR/app"
mkdir "$OUTPUTDIR/app/Didius"

echo "Copying 'xul''..."
for file in Application/xul/*; do
    cp -rv $file "$OUTPUTDIR/app/Didius/"
done

####################################################
# JAVASCRIPT                                       #
####################################################
echo "Building 'js'..."
jsbuilder Application/build-didius.jsb "$OUTPUTDIR/app/Didius/chrome/content/js/"
jsbuilder Application/build-app.jsb "$OUTPUTDIR/app/Didius/chrome/content/js/"

