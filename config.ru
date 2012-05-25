require 'bundler'
Bundler.setup :default
require 'sinatra'

get('/'){ redirect '/index.html' }
run Sinatra::Application