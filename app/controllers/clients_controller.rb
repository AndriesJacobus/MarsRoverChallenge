class ClientsController < ApplicationController
  before_action :set_client, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user, only: :index

  # GET /clients
  # GET /clients.json
  def index
    # Only Admins can view index
    if current_user.usertype == "Sysadmin"
      @clients = Client.all
    elsif current_user.usertype == "Client Admin"
      # Todo: filter clients to show only those with the same 'client'
      #       tag as the current Admin
      @clients = Client.all
    else
      redirect_to root_path, flash: {warning: 'Please log in as an Admin before viewing this page' }
    end
  end

  # GET /clients/1
  # GET /clients/1.json
  def show
  end

  # GET /clients/new
  def new
    @client = Client.new
  end

  # GET /clients/1/edit
  def edit
  end

  # POST /clients
  # POST /clients.json
  def create
    @client = Client.new(client_params)

    respond_to do |format|
      if @client.save
        # Create log entry
        @log = Log.new(trigger_by_bot: "client_bot", action_type: "client_created")
        @log.client = @client
        @log.save

        format.html { redirect_to @client, flash: {success: 'Client was successfully created' } }
        format.json { render :show, status: :created, location: @client }
      else
        format.html { render :new }
        format.json { render json: @client.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /clients/1
  # PATCH/PUT /clients/1.json
  def update
    respond_to do |format|
      if @client.update(client_params)
        # Create log entry
        @log = Log.new(trigger_by_bot: "client_bot", action_type: "client_updated")
        @log.client = @client
        @log.save

        format.html { redirect_to @client, flash: {success: 'Client was successfully updated' } }
        format.json { render :show, status: :ok, location: @client }
      else
        format.html { render :edit }
        format.json { render json: @client.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /clients/1
  # DELETE /clients/1.json
  def destroy
    # Create log entry
    @log = Log.new(trigger_by_bot: "client_bot", action_type: "client_deleted")
    @log.user = current_user
    @log.client = @client
    @log.save

    @client.users.delete_all
    @client.client_groups.delete_all

    @client.destroy
    respond_to do |format|
      format.html { redirect_to clients_url, flash: {warning: 'Client was successfully deleted' } }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_client
      @client = Client.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def client_params
      params.require(:client).permit(:Name, :SigfoxDeviceTypeID, :SigfoxDeviceTypeName)
    end
end
