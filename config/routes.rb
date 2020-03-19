Rails.application.routes.draw do
  resources :map_groups
  resources :devices
  resources :messages
  resources :api_keys
  root 'home#index'
  
  resources :users
  resources :sessions, only: [:new, :create, :destroy]
  
  get 'signup', to: 'users#new', as: 'signup'
  get 'login', to: 'sessions#new', as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'
end
