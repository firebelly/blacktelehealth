from fabric.api import *
import os

env.hosts = ['stage.firebelly.co']
env.user = 'firebelly'
env.remotepath = '/home/firebelly/apps/blacktelehealth-staging'
env.git_branch = 'main'
env.warn_only = True
env.forward_agent = True

def production():
  env.hosts = ['starthere.com']
  env.user = 'starthereuser'
  env.remotepath = '/path/to/site'
  env.git_branch = 'master'
  env.remote_protocol = 'https'

def build():
  local('npx gulp --production')

def deploy():
  update()

def update():
  with cd(env.remotepath):
    run('git pull origin {0}'.format(env.git_branch))
