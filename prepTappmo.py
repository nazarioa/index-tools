import os
import sys
import fileinput
import getpass

# A helper script for setting up tappmo for local development
# Must be run from either ~/source/com.tappmo or ~/source/bamboo

if os.getcwd().endswith('bamboo'):
    os.chdir('../com.tappmo')

if 'soft' not in sys.argv:
    os.system('rm -rf ~/source/com.tappmo/out')
    os.system('blaze clean')
    os.system('blaze build')

# Edit BootstrapDevMain and BootstrapMain to run dev
print('Editing BootstrapDevMain for development')
bootstrapFolder = 'tests/bootstrap/src/test/java/com/goindex/tests/bootstrap/'
bootstrapDevMainFilePath = bootstrapFolder + 'BootstrapDevMain.java'
bootstrapMainFilePath = bootstrapFolder + 'BootstrapMain.java'
fenderMvcConfigurerPath = 'server/fender/src/main/java/com/goindex/server/' \
                          'fender/spring/config/FenderMvcConfigurer.java'
caterpillarMvcConfigurerPath = 'tools/caterpillar/src/main/java/com/goindex/tools/' \
                          'caterpillar/spring/config/CaterpillarMvcConfigurer.java'
incoreServerFilePath = 'tests/cluster/src/test/java/com/goindex/tests/cluster/incore/IncoreServerContainer.java'
backupExtension = '.bak'

with fileinput.FileInput(bootstrapDevMainFilePath, inplace=True,
                         backup=backupExtension) as bootstrapDevMainFile:
    for line in bootstrapDevMainFile:
        line = line.replace('private static final', 'public static final')
        # Used to change cluster type from mongo to testing
        line = line.replace('ClusterType.MONGO', 'ClusterType.TESTING')
        print(line, end='')
os.remove(bootstrapDevMainFilePath + backupExtension)

print('Editing BootstrapMain for development')
with fileinput.FileInput(bootstrapMainFilePath, inplace=True,
                         backup=backupExtension) as bootstrapMainFile:
    for line in bootstrapMainFile:
        line = line.replace('Bootstrap(port, clusterType)',
                            'Bootstrap(BootstrapDevMain.DEV_PORT, '
                            'BootstrapDevMain.DEV_TYPE)')
        print(line, end='')
os.remove(bootstrapMainFilePath + backupExtension)

print('Editing FenderMvcConfigurer for development')
with fileinput.FileInput(fenderMvcConfigurerPath, inplace=True,
                         backup=backupExtension) as fenderMvcConfigurerFile:
    for line in fenderMvcConfigurerFile:
        line = line.replace('// Map module/*.html matches to'
                            ' the resource/module/ directory.',
                            'resourceDir = "file:/Users/{0}/source/bamboo";'
                            .format(getpass.getuser()))
        print(line, end='')
os.remove(fenderMvcConfigurerPath + backupExtension)

print('Editing CaterpillarMvcConfigurer for development')
with fileinput.FileInput(caterpillarMvcConfigurerPath, inplace=True,
                         backup=backupExtension) as caterpillarMvcConfigurerFile:
    for line in caterpillarMvcConfigurerFile:
        line = line.replace('// Map module/*.html matches to'
                            ' the resource/module/ directory.',
                            'resourceDir = "file:/Users/{0}/source/bamboo";'
                            .format(getpass.getuser()))
        print(line, end='')
os.remove(caterpillarMvcConfigurerPath + backupExtension)

print('Adding canary key to periscope field')
with fileinput.FileInput(incoreServerFilePath, inplace=True,
                         backup=backupExtension) as incoreServerFile:
    for line in incoreServerFile:
        line = line.replace('return "incorrect-key";',
                            'return "aeae7260-37fb-443e-bc0b-cdb8a4db";')
        print(line, end='')
os.remove(incoreServerFilePath + backupExtension)


os.chdir('../bamboo')
print('Done prepping tappmo')
