class ClientGroupsController < ApplicationController
  before_action :set_client_group, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user, only: :index

  # GET /client_groups
  # GET /client_groups.json
  def index
    # Only Admins can view index
    if current_user.usertype == "Sysadmin"
      @client_groups = ClientGroup.all

    # elsif current_user.usertype == "Client Admin"
    #   # Todo: filter client groups to show only those with the same 'client'
    #   #       tag as the current Admin
    #   @client_groups = ClientGroup.where(client_id: current_user.client_id)
    elsif current_user
      @client_groups = ClientGroup.where(client_id: current_user.client_id)
    else
      # redirect_to root_path, flash: {warning: 'Please log in as an Admin before viewing this page' }
      redirect_to root_path, flash: {warning: 'Please log in before viewing this page' }
    end
  end

  # GET /client_groups/1
  # GET /client_groups/1.json
  def show
    @clients = Client.all
  end

  # GET /client_groups/1/map_view
  def map_view
    if current_user

      @client_group = ClientGroup.find(params[:id])

      if current_user.usertype == "Sysadmin"
        # Todo: filter - show all unplaced devices and devices linked to current client_group
        #                 eg: @devices = Devices.where(client_group: params[:id])

        @devices = Device.where(client_group_id: nil).or(Device.where(client_group_id: params[:id]))

        # Filter - only show map_groups linked to current client_group
        @map_groups= @client_group.map_groups.all.sort_by(&:Name)

      elsif current_user
        # Todo: filter - only show devices linked to current client_group
        #                 eg: @devices = Devices.where(client_group: params[:id])

        @devices = Device.where(client_group_id: params[:id])

        # Filter - only show map_groups linked to current client_group
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
        @map_group = MapGroup.create(
          :Name => params[:MapGroupName],
          :startLon => params[:MapGroupStartLon],
          :startLat => params[:MapGroupStartLat],
          :endLon => params[:MapGroupEndLon],
          :endLat => params[:MapGroupEndLat],
          :state => params[:MapGroupState],
        )
        
        @client_group.map_groups << @map_group

        # Set client group location if not set already
        if @client_group.longitude == nil || @client_group.latitude == nil
          @client_group.update_attributes(:longitude => params[:MapGroupStartLon], :latitude => params[:MapGroupStartLat])
        end

        respond_to do |format|
          msg = { :status => "ok", :message => "Perimeter map_group successfully added to client_group", :map_group_id => @map_group.id }
          format.json  { render :json => msg }
        end

      elsif current_user
        # Todo: change so that only users who belong to the same client as the
        # client_group can add map_groups
        
        @map_group = MapGroup.create(
          :Name => params[:MapGroupName],
          :startLon => params[:MapGroupStartLon],
          :startLat => params[:MapGroupStartLat],
          :endLon => params[:MapGroupEndLon],
          :endLat => params[:MapGroupEndLat],
          :state => params[:MapGroupState],
        )
        
        @client_group.map_groups << @map_group

        # Set client group location if not set already
        if @client_group.longitude == nil || @client_group.latitude == nil
          @client_group.update_attributes(:longitude => params[:MapGroupStartLon], :latitude => params[:MapGroupStartLat])
        end

        respond_to do |format|
          msg = { :status => "ok", :message => "Perimeter map_group successfully added to client_group", :map_group_id => @map_group.id }
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

        if @device
          # Add device to map_group
          @device.client_group = @client_group

          # Maintain state of previous perimeter
          # by checking if any other devices are in alarm state
          # and setting the perimeter state to online if removed device
          # was the device causing the perimeter to be in alarm state
          if @device.map_group && @device.state.downcase.include?("alarm")

            @old_perimeter = @device.map_group
            @old_perimeter_new_state = "online"

            @old_perimeter.devices.where.not(id: @device.id).each do |device|
              if device.state.downcase.include?("alarm")
                @old_perimeter_new_state = "alarm"
                break
              end
            end

            @old_perimeter.state = @old_perimeter_new_state
            @old_perimeter.save
                  
            send_action_cable_update(
              "map_group",
              @old_perimeter.id,
              "state",
              @old_perimeter_new_state,
              @client_group.id
            )

          end

          # Add device to new map_group
          # (which also changes the current device's perimeter)
          @map_group.devices << @device
  
          # Remove device from all other map_groups
          # => taken care of by rails via the belongs_to association

          # Update new perimeter's state in case of alarm
          if @device.state.downcase.include?("alarm")
            @map_group.state = "alarm"
            @map_group.save
                  
            send_action_cable_update(
              "map_group",
              @map_group.id,
              "state",
              "alarm",
              @client_group.id
            )
          end
  
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

        # Add device to map_group
        @client_group = ClientGroup.find(params[:id])
        if @client_group
          @device.client_group = @client_group

          if @client_group.longitude == nil || @client_group.latitude == nil
            @client_group.update_attributes(:longitude => params[:DeviceLng], :latitude => params[:DeviceLat])
          end
        end

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

  # POST /client_groups/1/update_map_group_state
  def update_map_group_state
    @client_group = ClientGroup.find(params[:id])

    if current_user
    
      # Get map group with current client_group and correct MapGroupName
      @map_group = @client_group.map_groups.where(Name: params[:MapGroupName]).take

      if @map_group
        # Update perimeter state
        @map_group.update_attribute(:state, params[:MapGroupState])

        # Send action cable message to update relevant map_group's state
        data = {
          "update": "map_group",
          "id": @map_group.id,
          "attribute": "state",
          "to": params[:MapGroupState],
        }
        ActionCable.server.broadcast("live_map_#{@client_group.id}", data)

        # Update state of all perimeter devices
        @map_group.devices.where("lower(state) like ?", "%alarm%").each do |device|
          # Todo: see if alarm has been made before then
          # change that alarm in stead of making new one

          # @alarms = Alarm.where(device_id: @device.id).where(acknowledged: false).where("state_change_from like ?", "%alarm%")
          @alarm = Alarm.where(device_id: device.id).where(acknowledged: false).where("lower(state_change_from) like ?", "%alarm%").last

          if @alarm
            # @alarms.each do |alarm|
              @alarm.update_attributes(
                acknowledged: true,
                date_acknowledged: Time.now,
                alarm_reason: params[:AlarmReason],
                note: params[:AlarmNote],
                user_id: current_user.id,
                state_change_to: params[:MapGroupState],
              )
            # end
          else
            @alarm = Alarm.new(
              acknowledged: true,
              date_acknowledged: Time.now,
              alarm_reason: params[:AlarmReason],
              note: params[:AlarmNote],
              device_id: device.id,
              user_id: current_user.id,
              state_change_to: params[:MapGroupState],
              state_change_from: device.state,
            )
  
            @alarm.save

          end

          # Can change this line to use params[:MapGroupState]
          # in stead of "online" to make states dynamic
          device.update_attribute(:state, "online")

          # Send action cable message to update relevant device's state
          data = {
            "update": "device",
            "id": device.id,
            "attribute": "state",
            "to": "online",
          }
          ActionCable.server.broadcast("live_map_#{@client_group.id}", data)

        end

        # Send response
        message = "Map group '#{@map_group.Name}' " + 
                  "successfully updated state to #{params[:MapGroupState]}"

        respond_to do |format|
          msg = { :status => "ok", :message => message }
          format.json  { render :json => msg }
        end

      else
        respond_to do |format|
          msg = { :status => "bad_request", :message => "" }
          format.json  { render :json => msg }
        end

      end

    else
      respond_to do |format|
        msg = { :status => "bad_request", :message => "" }
        format.json  { render :json => msg }
      end
    end

  end

  # POST /client_groups/1/update_device_state
  def update_device_state
    if current_user

      @device = Device.find(params[:DeviceId])

      if @device

        @device.update_attribute(:state, params[:DeviceState])

        # Send action cable message to update relevant device's state
        data = {
          "update": "device",
          "id": @device.id,
          "attribute": "state",
          "to": params[:DeviceState],
        }
        ActionCable.server.broadcast("live_map_#{params[:id]}", data.as_json)

        # Update parimeter state
        if @device.state.downcase.include?("alarm") && @device.map_group && !@device.map_group.state.downcase.include?("alarm")
          @device.map_group.state = "alarm"
          @device.map_group.save

          # Send action cable message to update relevant device's state
          data = {
            "update": "map_group",
            "id": @device.map_group.id,
            "attribute": "state",
            "to": "alarm",
          }
          ActionCable.server.broadcast("live_map_#{params[:id]}", data)
        end

        # Update parimeter state if device is not alarm anymore
        if @device.map_group
          @map_group = @device.map_group
          @map_group_new_state = "online"

          @map_group.devices.where.not(id: @device.id).each do |device|
            if device.state.downcase.include?("alarm")
              @map_group_new_state = "alarm"
              break
            end
          end

          @map_group.state = @map_group_new_state
          @map_group.save

          # Send action cable message to update relevant device's state
          data = {
            "update": "map_group",
            "id": @map_group.id,
            "attribute": "state",
            "to": @map_group_new_state,
          }
          ActionCable.server.broadcast("live_map_#{params[:id]}", data)
        end

        message = "Device '#{@device.Name}' " + 
                  "with id #{params[:DeviceId]} " +
                  "successfully updated state to #{params[:DeviceState]}"

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

  def set_client_for_client_group
    @client = Client.find(params[:ClientID])
    @client_group = ClientGroup.find(params[:id])

    if @client && @client_group
      @client_group.client = @client

      respond_to do |format|
        if @client_group.save
          format.html { redirect_to client_groups_path, flash: {success: 'Client was successfully added' } }
          format.json { render :index, status: :created, location: current_device }
        else
          format.html { redirect_to client_groups_path, flash: {warning: 'Client could not be added' } }
          format.json { head :no_content }
        end
      end
    else
      respond_to do |format|
        format.html { redirect_to client_groups_path, flash: {warning: 'Client could not be added' } }
        format.json { head :no_content }
      end
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
        # Create log entry
        @log = Log.new(trigger_by_bot: "client_group_bot", action_type: "client_group_created")
        @log.client_group = @client_group
        @log.save

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
        # Create log entry
        @log = Log.new(trigger_by_bot: "client_group_bot", action_type: "client_group_updated")
        @log.client_group = @client_group
        @log.save

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
    # Create log entry
    @log = Log.new(trigger_by_bot: "client_group_bot", action_type: "client_group_deleted")
    @log.user = current_user
    @log.client_group = @client_group
    @log.save

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
        :longitude,
        :latitude,
        :MapGroupName,
        :MapGroupStartLon,
        :MapGroupStartLat,
        :MapGroupEndLon,
        :MapGroupEndLat,
        :MapGroupState,
        :DeviceId,
        :DeviceLat,
        :DeviceLng,
        :DeviceState,
        :ClientID,
        :AlarmReason,
        :AlarmNote,
      )
    end
end
