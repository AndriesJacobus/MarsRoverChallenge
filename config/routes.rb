Rails.application.routes.draw do

  root 'home#index'

  resources :client_groups
  resources :clients
  resources :map_groups
  resources :devices
  resources :messages
  resources :api_keys
  
  resources :users
  resources :sessions, only: [:new, :create, :destroy]

  get '/get_device_info', to: 'devices#get_device_info', as: 'get_device_info'
  post '/set_device_info', to: 'devices#set_device_info', as: 'set_device_info'

  get '/client_groups/:id/map_view', to: 'client_groups#map_view', as: 'map_view'

  post '/client_groups/:id/add_map_group', to: 'client_groups#add_map_group', as: 'add_map_group'
  post '/client_groups/:id/add_device_to_map_group', to: 'client_groups#add_device_to_map_group', as: 'add_device_to_map_group'
  post '/client_groups/:id/update_marker_loc', to: 'client_groups#update_marker_loc', as: 'update_marker_loc'

  delete '/client_groups/:id/delete_map_group', to: 'client_groups#delete_map_group', as: 'delete_map_group'

  get '/set_client_for_client_group', to: 'client_groups#set_client_for_client_group', as: 'set_client_for_client_group'
  get '/set_client_for_user', to: 'users#set_client_for_user', as: 'set_client_for_user'
  get '/set_client_group_for_device', to: 'devices#set_client_group_for_device', as: 'set_client_group_for_device'
  
  get 'signup', to: 'users#new', as: 'signup'
  get 'login', to: 'sessions#new', as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'

  # API mount
  mount API::Base, at: "/"

  # API Doc mount
  mount GrapeSwaggerRails::Engine, at: "/documentation"

end
