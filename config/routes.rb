Rails.application.routes.draw do

  root 'home#index'
  
  post '/calculate_movement_output', to: 'home#calculate_movement_output', as: 'calculate_movement_output'

end
