Rails.application.routes.draw do

  resources :alarms
  resources :logs
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
  post '/client_groups/:id/update_device_state', to: 'client_groups#update_device_state', as: 'update_device_state'
  post '/client_groups/:id/update_map_group_state', to: 'client_groups#update_map_group_state', as: 'update_map_group_state'

  delete '/client_groups/:id/delete_map_group', to: 'client_groups#delete_map_group', as: 'delete_map_group'

  get '/set_client_for_client_group', to: 'client_groups#set_client_for_client_group', as: 'set_client_for_client_group'
  get '/set_client_for_user', to: 'users#set_client_for_user', as: 'set_client_for_user'
  get '/set_client_group_for_device', to: 'devices#set_client_group_for_device', as: 'set_client_group_for_device'

  delete '/delete_all_alarms', to: 'alarms#delete_all_alarms', as: 'delete_all_alarms'
  post '/acknowledge_all_alarms', to: 'alarms#acknowledge_all_alarms', as: 'acknowledge_all_alarms'
  
  get 'signup', to: 'users#new', as: 'signup'
  get 'login', to: 'sessions#new', as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'

  # API mount
  mount API::Base, at: "/"

  # API Doc mount
  mount GrapeSwaggerRails::Engine, at: "/documentation"

end
