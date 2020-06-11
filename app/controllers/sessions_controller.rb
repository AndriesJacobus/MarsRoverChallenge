class SessionsController < ApplicationController
  def new
  end
  
  def create
    user = User.find_by_email(params[:email])
    
    if user && user.authenticate(params[:password])
      # Create log entry
      @log = Log.new(trigger_by_bot: "session_bot", action_type: "user_login")
      @log.user = user
      @log.save

      # Set session
      session[:user_id] = user.id
      redirect_to user, flash: {success: "Logged in" }
    else
      flash.now[:alert] = "Email or password is invalid"
      render "new"
    end
  end
  
  def destroy
    # Create log entry
    @log = Log.new(trigger_by_bot: "session_bot", action_type: "user_logout")
    @log.user = current_user
    @log.save

    session[:user_id] = nil
    redirect_to root_url, flash: {success: "Logged out" }
  end
end
