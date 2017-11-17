import os
import sys
import fileinput
import getpass
from pathlib import Path

home = str(Path.home())

# A helper script to build models from local protos and use them in bamboo
os.chdir(home)
os.chdir('source/com.tappmo')

os.system('./scripts/build.sh')
os.system('rm -rf ../bamboo/modules/ixmodel/app/model/com')
os.system('cp -r ./ts/ts_gen/proto/com ../bamboo/modules/ixmodel/app/model')
