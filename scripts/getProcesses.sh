#!/bin/sh

echo -n $(ps -e -o sz -o ",%p,%P," -o lstart -o ",%C," -o etimes -o ",%a" | grep -v grep | grep -v ${0} | grep ${1})