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
rm "$OUTPUTDIR/resources/" -r

####################################################
# RESOURCES                                        #
####################################################
echo "Copying 'resources''..."
mkdir "$OUTPUTDIR/resources"

echo "Copying 'resources/content''..."
for file in resources/content*; do
    cp -rv $file "$OUTPUTDIR/resources/content/"
done

echo "Copying 'resources/htdocs''..."
for file in resources/htdocs*; do
    cp -rv $file "$OUTPUTDIR/resources/htdocs/"
done

echo "Copying 'resources/css''..."
for file in resources/css*; do
    cp -rv $file "$OUTPUTDIR/resources/css/"
done

echo "Copying 'resources/xml''..."
for file in resources/xml*; do
    cp -rv $file "$OUTPUTDIR/resources/xml/"
done

echo "Copying 'resources/includes''..."
for file in resources/includes*; do
    cp -rv $file "$OUTPUTDIR/resources/includes/"
done


####################################################
# JAVASCRIPT                                       #
####################################################
echo "Building 'javascript'..."
mkdir "$OUTPUTDIR/resources/js"
jsbuilder javascript.jsb "$OUTPUTDIR/resources/js/"

####################################################
# PERMISSIONS			                           #
####################################################
chmod 777 "$OUTPUTDIR/resources/"
chmod 777 "$OUTPUTDIR/resources/"* -R
