class SessionsController < ApplicationController
  def new
  end
  
  def create
    user = User.find_by_email(params[:email])
    
    if user && user.authenticate(params[:password])
      # Create log entry
      @log = Log.new(trigger_by_bot: "session_bot", action_type: "user_login")
      @log.user = user
      @log.client = user.client
      @log.save

      # Set session
      session[:user_id] = user.id

      if user.usertype == "Operator" && user.client.client_groups.first
        redirect_to "/client_groups/#{user.client.client_groups.first.id}/map_view", flash: {success: "Logged in" }
      else
        redirect_to root_path, flash: {success: "Logged in" }
      end
    else
      flash.now[:alert] = "Email or password is invalid"
      render "new"
    end
  end
  
  def destroy
    # Create log entry
    @log = Log.new(trigger_by_bot: "session_bot", action_type: "user_logout")
    @log.user = User.find(session[:user_id])
    @log.client = current_user.client
    @log.save

    session[:user_id] = nil
    redirect_to root_url, flash: {success: "Logged out" }
  end
end
