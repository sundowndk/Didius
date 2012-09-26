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
# INCLUDES                                         #
####################################################
echo "Copying 'includes'..."
mkdir "$OUTPUTDIR/app/Didius/chrome/content/js/sndk"
for file in ../Lib/sndk/*; do
    cp -rv $file "$OUTPUTDIR/app/Didius/chrome/content/js/sndk/"
done

mkdir "$OUTPUTDIR/app/Didius/chrome/content/js/sxul"
for file in ../Lib/sxul/*; do
    cp -rv $file "$OUTPUTDIR/app/Didius/chrome/content/js/sxul/"
done


#echo "Copying 'xul''..."
#for file in Application/js/app/*; do
#    cp -rv $file "$OUTPUTDIR/app/Didius/chrome/content/js/"
#done



####################################################
# JAVASCRIPT                                       #
####################################################
echo "Building 'js'..."
jsbuilder Application/build-didius.jsb "$OUTPUTDIR/app/Didius/chrome/content/js/"
#jsbuilder Application/build-app.jsb "$OUTPUTDIR/app/Didius/chrome/content/js/"

