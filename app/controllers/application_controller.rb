class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_user
  
  def current_user
    if session[:user_id]
      @current_user ||= User.find(session[:user_id])
    else
      @current_user = nil
    end
  end

  def send_action_cable_update(update_type, id, attribute, new_attribute, client_group_id)
            
    # Send action cable message to update relevant device's state
    data = {
      update: update_type,
      id: id,
      attribute: attribute,
      to: new_attribute,
    }
    ActionCable.server.broadcast("live_map_#{client_group_id}", data.as_json)

  end

  def authorize_user
    #redirects to home page
    redirect_to root_path, flash: {warning: 'Please log in before viewing this page' } unless current_user
  end 

  def authorize_admin
    #redirects to home page
    redirect_to root_path, flash: {warning: 'Please log in as an Admin before viewing this page' } unless current_user && (current_user.usertype == "Sysadmin" || current_user.usertype == "Client Admin")
  end

  def is_curr_user_admin
    return (current_user && (current_user.usertype == "Sysadmin" || current_user.usertype == "Client Admin"))
  end
end
