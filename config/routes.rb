Rails.application.routes.draw do

  namespace :admin do
    resources :alarms do
      get :export, on: :collection
    end
    resources :api_keys do
      get :export, on: :collection
    end
    resources :clients do
      get :export, on: :collection
    end
    resources :client_details do
      get :export, on: :collection
    end
    resources :client_groups do
      get :export, on: :collection
    end
    resources :devices do
      get :export, on: :collection
    end
    resources :logs do
      get :export, on: :collection
    end
    resources :map_groups do
      get :export, on: :collection
    end
    resources :messages do
      get :export, on: :collection
    end
    resources :users do
      get :export, on: :collection
    end

    root to: "alarms#index"
  end

  resources :client_details
  resources :alarms
  resources :logs
  root 'home#index'

  resources :clients
  # resources :sites, controller: "clients"
  # get "/clients", to: redirect("/sites")

  resources :client_groups
  resources :map_groups
  resources :devices
  resources :messages
  resources :api_keys
  
  resources :users
  resources :sessions, only: [:new, :create, :destroy]

  get '/get_device_info', to: 'devices#get_device_info', as: 'get_device_info'
  post '/set_device_info', to: 'devices#set_device_info', as: 'set_device_info'

  # MapView routes
  get '/client_groups/:id/map_view', to: 'client_groups#map_view', as: 'map_view'

  post '/client_groups/:id/add_map_group', to: 'client_groups#add_map_group', as: 'add_map_group'
  post '/client_groups/:id/add_device_to_map_group', to: 'client_groups#add_device_to_map_group', as: 'add_device_to_map_group'
  post '/client_groups/:id/update_marker_loc', to: 'client_groups#update_marker_loc', as: 'update_marker_loc'
  post '/client_groups/:id/update_device_state', to: 'client_groups#update_device_state', as: 'update_device_state'
  post '/client_groups/:id/update_map_group_state', to: 'client_groups#update_map_group_state', as: 'update_map_group_state'

  delete '/client_groups/:id/delete_map_group', to: 'client_groups#delete_map_group', as: 'delete_map_group'

  # Linking client for client_groups and users
  get '/set_client_for_client_group', to: 'client_groups#set_client_for_client_group', as: 'set_client_for_client_group'
  get '/set_client_for_user', to: 'users#set_client_for_user', as: 'set_client_for_user'

  # Linking client_group for devices
  get '/set_client_group_for_device', to: 'devices#set_client_group_for_device', as: 'set_client_group_for_device'

  # Linking client_details for clients (sites) and users
  get '/set_client_detail_for_client', to: 'clients#set_client_detail_for_client', as: 'set_client_detail_for_client'
  get '/set_client_detail_for_user', to: 'users#set_client_detail_for_user', as: 'set_client_detail_for_user'

  # Alarm routes
  post '/acknowledge_all_alarms', to: 'alarms#acknowledge_all_alarms', as: 'acknowledge_all_alarms'
  delete '/delete_all_alarms', to: 'alarms#delete_all_alarms', as: 'delete_all_alarms'
  delete '/delete_all_messages', to: 'messages#delete_all_messages', as: 'delete_all_messages'
  delete '/delete_all_logs', to: 'logs#delete_all_logs', as: 'delete_all_logs'
  
  get 'signup', to: 'users#new', as: 'signup'
  get 'login', to: 'sessions#new', as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'

  # ActionCable mount
  mount ActionCable.server => '/cable'

  # API mount
  mount API::Base, at: "/"

  # API Doc mount
  mount GrapeSwaggerRails::Engine, at: "/documentation"

end
