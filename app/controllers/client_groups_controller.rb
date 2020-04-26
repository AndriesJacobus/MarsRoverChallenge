class ClientGroupsController < ApplicationController
  before_action :set_client_group, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user, only: :index

  # GET /client_groups
  # GET /client_groups.json
  def index
    # Only Admins can view index
    if current_user.usertype == "Sysadmin"
      @client_groups = ClientGroup.all
    elsif current_user.usertype == "Client Admin"
      # Todo: filter client groups to show only those with the same 'client'
      #       tag as the current Admin
      @client_groups = ClientGroup.all
    else
      redirect_to root_path, flash: {warning: 'Please log in as an Admin before viewing this page' }
    end
  end

  # GET /client_groups/1
  # GET /client_groups/1.json
  def show
  end

  # GET /client_groups/1/map_view
  def map_view
    # Only Admins can view index
    if current_user
      @client_group = ClientGroup.find(params[:id])

      if current_user.usertype == "Sysadmin"
        # Todo: filter - only show devices linked to current client_group
        #                 eg: @devices = Devices.where(client_group: params[:id])
        # Todo: filter - only show map_groups linked to current client_group

        @devices = Device.all
        @map_groups= MapGroup.all
      elsif current_user
        # Todo: filter - only show devices linked to current client_group
        #                 eg: @devices = Devices.where(client_group: params[:id])
        # Todo: filter - only show map_groups linked to current client_group
        # Todo: filter - only show devices linked to current client

        @devices = Device.all
        @map_groups= MapGroup.all
      else
        redirect_to root_path, flash: {warning: 'Please log in before viewing this page' }
      end
    else
      redirect_to root_path, flash: {warning: 'Please log in before viewing this page' }
    end
  end

  # GET /client_groups/new
  def new
    @client_group = ClientGroup.new
  end

  # GET /client_groups/1/edit
  def edit
  end

  # POST /client_groups
  # POST /client_groups.json
  def create
    @client_group = ClientGroup.new(client_group_params)

    respond_to do |format|
      if @client_group.save
        format.html { redirect_to @client_group, flash: {success: 'Client Group was successfully created' } }
        format.json { render :show, status: :created, location: @client_group }
      else
        format.html { render :new }
        format.json { render json: @client_group.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /client_groups/1
  # PATCH/PUT /client_groups/1.json
  def update
    respond_to do |format|
      if @client_group.update(client_group_params)
        format.html { redirect_to @client_group, flash: {success: 'Client Group was successfully updated' } }
        format.json { render :show, status: :ok, location: @client_group }
      else
        format.html { render :edit }
        format.json { render json: @client_group.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /client_groups/1
  # DELETE /client_groups/1.json
  def destroy
    @client_group.destroy
    respond_to do |format|
      format.html { redirect_to client_groups_url, flash: {warning: 'Client Group was successfully deleted' }  }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_client_group
      @client_group = ClientGroup.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def client_group_params
      params.require(:client_group).permit(:id, :Name, :SigfoxGroupID, :SigfoxGroupName)
    end
end
