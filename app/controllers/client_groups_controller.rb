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
    if current_user

      @client_group = ClientGroup.find(params[:id])

      if current_user.usertype == "Sysadmin"
        # Todo: filter - only show devices linked to current client_group
        #                 eg: @devices = Devices.where(client_group: params[:id])

        @devices = Device.all
        @map_groups= @client_group.map_groups.all.sort_by(&:Name)

      elsif current_user
        # Todo: filter - only show devices linked to current client_group
        #                 eg: @devices = Devices.where(client_group: params[:id])
        # Todo: filter - only show map_groups linked to current client_group

        @devices = Device.all
        @map_groups= @client_group.map_groups.all.sort_by(&:Name)

      else
        redirect_to root_path, flash: {warning: 'Please log in before viewing this page' }
      end
    else
      redirect_to root_path, flash: {warning: 'Please log in before viewing this page' }
    end
  end

  # POST /client_groups/1/add_map_group
  def add_map_group
    if current_user

      @client_group = ClientGroup.find(params[:id])

      if current_user.usertype == "Sysadmin"
        @map_group = MapGroup.create(:Name => params[:MapGroupName],
          :startLon => params[:MapGroupStartLon],
          :startLat => params[:MapGroupStartLat],
          :endLon => params[:MapGroupEndLon],
          :endLat => params[:MapGroupEndLat] )

        @client_group.map_groups << @map_group

        respond_to do |format|
          msg = { :status => "ok", :message => "Perimeter map_group successfully added to client_group" }
          format.json  { render :json => msg }
        end

      elsif current_user
        # Todo: change so that only users who belong to the same client as the
        # client_group can add map_groups
        
        @map_group = MapGroup.create(:Name => params[:MapGroupName],
          :startLon => params[:MapGroupStartLon],
          :startLat => params[:MapGroupStartLat],
          :endLon => params[:MapGroupEndLon],
          :endLat => params[:MapGroupEndLat] )

        @client_group.map_groups << @map_group

        respond_to do |format|
          msg = { :status => "ok", :message => "Perimeter map_group successfully added to client_group" }
          format.json  { render :json => msg }
        end

      else
        redirect_to root_path, flash: {warning: 'Please log in before viewing this page' }
      end
    else
      redirect_to root_path, flash: {warning: 'Please log in before viewing this page' }
    end
  end

  # POST /client_groups/1/add_device_to_map_group
  def add_device_to_map_group
    if current_user

      @client_group = ClientGroup.find(params[:id])
      
      # Get map group with current client_group and correct MapGroupName
      @map_group = @client_group.map_groups.where(Name: params[:MapGroupName]).take

      if @map_group

        # Get device with given DeviceId
        @device = Device.find(params[:DeviceId])

        @map_group.devices << @device

        # Todo: remove device from all other map_groups

        message = "Device '#{@device.Name}' " + 
                  "with id #{params[:DeviceId]} " +
                  "successfully added to perimeter map_group '#{@map_group.Name}'"

        respond_to do |format|
          msg = { :status => "ok", :message => message }
          format.json  { render :json => msg }
        end

      else

        respond_to do |format|
          msg = { :status => "not_found", :message => @map_group.errors }
          format.json  { render :json => msg }
        end

      end

    else
      redirect_to root_path, flash: {warning: 'Please log in before viewing this page' }
    end
  end

  # POST /client_groups/1/update_marker_loc
  def update_marker_loc
    if current_user

      @device = Device.find(params[:DeviceId])

      if @device

        Device.where(id: params[:DeviceId]).update_all({
          :Latitude => params[:DeviceLat],
          :Longitude => params[:DeviceLng]
        })

        # Todo: remove device from all other map_groups

        message = "Device '#{@device.Name}' " + 
                  "with id #{params[:DeviceId]} " +
                  "successfully updated location to [#{params[:DeviceLat]}, #{params[:DeviceLng]}]"

        if @device.save
          respond_to do |format|
            msg = { :status => "ok", :message => message }
            format.json  { render :json => msg }
          end
        else
          respond_to do |format|
            msg = { :status => "bad_request", :message => @device.errors }
            format.json  { render :json => msg }
          end
        end
        
      else

        respond_to do |format|
          msg = { :status => "not_found", :message => @device.errors }
          format.json  { render :json => msg }
        end

      end
    else
      redirect_to root_path, flash: {warning: 'Please log in before viewing this page' }
    end
  end

  # DELETE /client_groups/1/delete_map_group
  def delete_map_group
    if current_user

      @client_group = ClientGroup.find(params[:id])

      if current_user.usertype == "Sysadmin"
      
        # Get map group with current client_group and correct MapGroupName
        @map_group = @client_group.map_groups.where(Name: params[:MapGroupName]).take

        @map_group.devices.delete_all
        @map_group.destroy

        respond_to do |format|
          msg = { :status => "ok", :message => "Perimeter map_group successfully deleted" }
          format.json  { render :json => msg }
        end

      elsif current_user
        # Todo: change so that only users who belong to the same client as the
        # client_group can add map_groups
      
        # Get map group with current client_group and correct MapGroupName
        @map_group = @client_group.map_groups.where(Name: params[:MapGroupName]).take

        @map_group.devices.delete_all
        @map_group.destroy

        respond_to do |format|
          msg = { :status => "ok", :message => "Perimeter map_group successfully deleted" }
          format.json  { render :json => msg }
        end

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
    @client_group.map_groups.delete_all
    @client_group.devices.delete_all

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
      params.require(:client_group).permit(
        :id,
        :Name,
        :SigfoxGroupID,       
        :SigfoxGroupName,
        :MapGroupName,
        :MapGroupStartLon,
        :MapGroupStartLat,
        :MapGroupEndLon,
        :MapGroupEndLat,
        :DeviceId,
        :DeviceLat,
        :DeviceLng,
      )
    end
end
