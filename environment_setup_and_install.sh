#! /bin/bash

####################################################
# Function :download and install Environment       #
# Platform :linux Platform only                    #
# Version  :1.0                                    #
# Date     :11/26/2022                             #
# Author   :Yuzhuang Chen (yuz.chen)               #
####################################################
apt-get update;

which redis-server;
if [ $? -ne 0 ] 
then
    apt-get install redis;
fi

which node;
if [ $? -ne 0 ] 
then
    apt-get install nodejs;
fi

which npm;
if [ $? -ne 0 ] 
then
    apt-get install npm;
fi
npm install xlsx;
npm install express;
npm install ioredis;
npm install nodemon;