class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user, only: :index

  # GET /users
  # GET /users.json
  def index
    # Only Admins can view index
    if current_user.usertype == "Sysadmin"
      @users = User.all
    elsif current_user.usertype == "Client Admin"
      # Todo: filter users to show only those with the same 'client'
      #       tag as the current Admingo 
      # @users = User.where(client_id: current_user.client_id)

      @users = current_user.client_detail.users
    else
      redirect_to root_path, flash: {warning: 'Please log in as an Admin before viewing this page' }
    end
  end

  # GET /users/1
  # GET /users/1.json
  def show
    # For now we show all clients
    @client_details = ClientDetail.all
    
    # Todo: change this to only show clients (sites)
    # linked to current user's client_details
    @clients = Client.all
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  # POST /users.json
  def create
    if is_curr_user_admin()
      @user = User.new(user_params)

      respond_to do |format|
        if @user.save
          # Create log entry
          @log = Log.new(trigger_by_bot: "user_bot", action_type: "user_created")
          @log.user = @user
          @log.save

          format.html { redirect_to @user, flash: {success: 'User was successfully created' } }
          format.json { render :show, status: :created, location: @user }
        else
          format.html { render :new }
          format.json { render json: @user.errors, status: :unprocessable_entity }
        end
      end
    else
      redirect_to root_path, flash: {warning: 'Please log in as an Admin before creating users' }
    end
  end
  
  def set_client_for_user
    @client = Client.find(params[:ClientID])
    @user = User.find(params[:id])

    if @client && @user
      @user.client = @client

      respond_to do |format|
        if @user.save
          format.html { redirect_to @user, flash: {success: 'Site was successfully linked' } }
          format.json { render :index, status: :created}
        else
          format.html { redirect_to @user, flash: {warning: 'Site could not be linked' } }
          format.json { head :no_content }
        end
      end
    else
      respond_to do |format|
        format.html { redirect_to users_path, flash: {warning: 'Site could not be linked' } }
        format.json { head :no_content }
      end
    end
  end
  
  def set_client_detail_for_user
    @client_detail = ClientDetail.find(params[:ClientDetailID])
    @user = User.find(params[:id])

    if @client_detail && @user
      @user.client_detail = @client_detail

      respond_to do |format|
        if @user.save
          format.html { redirect_to @user, flash: {success: 'Client was successfully linked' } }
          format.json { render :index, status: :created }
        else
          format.html { redirect_to @user, flash: {warning: 'Client could not be linked' } }
          format.json { head :no_content }
        end
      end
    else
      respond_to do |format|
        format.html { redirect_to users_path, flash: {warning: 'Client could not be linked' } }
        format.json { head :no_content }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        # Create log entry
        @log = Log.new(trigger_by_bot: "user_bot", action_type: "user_updated")
        @log.user = @user
        @log.save

        format.html { redirect_to @user, flash: {success: 'User was successfully updated' } }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    # Only Admins can delete
    if current_user.usertype != "Sysadmin" && current_user.usertype != "Client Admin"
      redirect_to root_path, flash: {warning: 'Please log in as an Admin before deleting users' }
      return
    end

    # Create log entry
    @log = Log.new(trigger_by_bot: "user_bot", action_type: "user_deleted")
    @log.user = current_user
    @log.save

    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, flash: {warning: 'User was successfully deleted' } }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:email,
        :name,
        :surname,
        :usertype,
        :password,
        :password_confirmation,
        :ClientID,
        :ClientDetailID
      )
    end
end
