#!/bin/bash

BACKEND_DIR="../adv-backend"
BACKEND_PUB_DIR=$BACKEND_DIR/public

cd $BACKEND_PUB_DIR
shopt -s extglob
rm -r !(".htaccess"|"index.php"|"robots.txt"|"storage"|"web.config")

cd -
npm run build
rsync -avr --exclude='index.html' dist/ $BACKEND_PUB_DIR
cp dist/index.html $BACKEND_DIR/resources/views/app.blade.php
