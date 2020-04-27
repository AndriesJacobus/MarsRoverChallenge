Rails.application.routes.draw do
  resources :client_groups
  resources :clients
  resources :map_groups
  resources :devices
  resources :messages
  resources :api_keys

  root 'home#index'
  
  resources :users
  resources :sessions, only: [:new, :create, :destroy]

  get '/get_device_info', to: 'devices#get_device_info', as: 'get_device_info'
  post '/set_device_info', to: 'devices#set_device_info', as: 'set_device_info'

  get '/client_groups/:id/map_view', to: 'client_groups#map_view', as: 'map_view'
  post '/client_groups/:id/add_map_group', to: 'client_groups#add_map_group', as: 'add_map_group'
  
  get 'signup', to: 'users#new', as: 'signup'
  get 'login', to: 'sessions#new', as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'
end
