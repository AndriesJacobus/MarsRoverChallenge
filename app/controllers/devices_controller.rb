class DevicesController < ApplicationController
  before_action :set_device, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user, only: :index

  require 'net/http'
  require 'net/https'

  # GET /devices
  # GET /devices.json
  def index
    # Only Admins can view index
    if current_user.usertype == "Sysadmin"
      @devices = Device.all
    elsif current_user.usertype == "Client Admin"
      # Todo: filter devices to show only those with the same 'client'
      #       tag as the current Admin
      @devices = []
      
      Device.where.not(client_group_id: nil).each do |device|
        # if device.client_group && device.client_group.client && device.client_group.client.client_detail && device.client_group.client.client_detail == current_user.client.client_detail
        if device.client_group && device.client_group.client && device.client_group.client.client_detail && device.client_group.client.client_detail == current_user.client_detail
          @devices << device
        end
      end
    else
      redirect_to root_path, flash: {warning: 'Please log in as an Admin before viewing this page' }
    end
  end

  # GET /devices/1
  # GET /devices/1.json
  def show
    # @client_groups = ClientGroup.all

    @client_groups = []

    if current_user.client_detail && current_user.client_detail.clients
      current_user.client_detail.clients.each do |client|
        @groups = ClientGroup.where(client_id: client.id)
        @groups.each do |group|
          @client_groups << group
        end
      end
    end

    if @device.client_group && @device.client_group.client
      @groups = ClientGroup.where(client_id: @device.client_group.client.id)
      @groups.each do |group|
        @client_groups << group unless @client_groups.include?(group)
      end
    end

  end

  # GET /devices/new
  def new
    @device = Device.new
  end

  # GET /devices/1/edit
  def edit
  end

  # POST /devices
  # POST /devices.json
  def create
    # Todo: make sure device names are unique
    @device = Device.new(device_params)
    @device.update_attribute(:state, "online")

    if current_user.client_detail && current_user.client_detail.clients
      @client = current_user.client_detail.clients.first

      if @client && @client.client_groups && @client.client_groups.length > 0
        @device.client_group = @client.client_groups.first
      end
    end

    respond_to do |format|
      if @device.save
        # Create log entry
        @log = Log.new(trigger_by_bot: "device_bot", action_type: "device_created")
        @log.device = @device
        @log.save

        format.html { redirect_to @device, flash: {success: 'Device was successfully created' } }
        format.json { render :show, status: :created, location: @device }
      else
        format.html { render :new }
        format.json { render json: @device.errors, status: :unprocessable_entity }
      end
    end
  end

  def set_client_group_for_device
    @client_group = ClientGroup.find(params[:ClientGroupID])
    @device = Device.find(params[:id])

    if @client_group && @device
      @device.client_group = @client_group

      respond_to do |format|
        if @device.save
          format.html { redirect_to devices_path, flash: {success: 'Client Group was successfully added' } }
          format.json { render :index, status: :created }
        else
          format.html { redirect_to devices_path, flash: {warning: 'Client Group could not be added' } }
          format.json { head :no_content }
        end
      end
    else
      respond_to do |format|
        format.html { redirect_to devices_path, flash: {warning: 'Client Group could not be added' } }
        format.json { head :no_content }
      end
    end
  end

  # PATCH/PUT /devices/1
  # PATCH/PUT /devices/1.json
  def update
    # Todo: make sure device names are unique
    respond_to do |format|
      if @device.update(device_params)
        # Create log entry
        @log = Log.new(trigger_by_bot: "device_bot", action_type: "device_updated")
        @log.device = @device
        @log.save

        format.html { redirect_to @device, flash: {success: 'Device was successfully updated' } }
        format.json { render :show, status: :ok, location: @device }
      else
        format.html { render :edit }
        format.json { render json: @device.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /devices/1
  # DELETE /devices/1.json
  def destroy
    # Create log entry
    @log = Log.new(trigger_by_bot: "device_bot", action_type: "device_deleted")
    @log.user = current_user
    @log.device = @device
    @log.save

    @device.messages.delete_all
    
    @device.destroy
    respond_to do |format|
      format.html { redirect_to devices_url, flash: {warning: 'Device was successfully deleted' } }
      format.json { head :no_content }
    end
  end

  def set_device_info
    current_device = Device.find(params[:id])

    resp = get_device_info_internal

    if resp["message"]
      err = 'Device data could not be retrieved because SigFox request limit reached'

      if resp["message"] == "Invalid value or type" || resp[0]["message"] == "The requested resource was not found." 
        err = 'Device data could not be retrieved because the device with the SigFoxId of ' + params[:SigfoxID] + ' could not be found'
      end

      respond_to do |format|
        format.html { redirect_to devices_url, flash: {warning: err } }
        format.json { head :no_content }
      end
    elsif current_device == nil
      respond_to do |format|
        format.html { redirect_to devices_url, flash: {warning: 'Device data could not be retrieved because device record could not be found' } }
        format.json { head :no_content }
      end
    else
      puts resp
      puts resp["name"]
      puts ""
      puts resp.as_json
      puts resp.as_json["name"]

      current_device.update_attributes(
        :SigfoxName => resp["name"],
        :SigfoxDeviceTypeID => resp["deviceType"]["id"],
        :SigfoxGroupID => resp["group"]["id"],
        :SigfoxActivationTime => resp["activationTime"],
        :SigfoxCreationTime => resp["creationTime"],
        :SigfoxCreatedByID => resp["createdBy"]
      )
      puts current_device.errors.as_json
  
      respond_to do |format|
        if current_device.save
          format.html { redirect_to current_device, flash: {success: 'Device data was successfully autofilled' } }
          format.json { render :show, status: :created, location: current_device }
        else
          format.html { redirect_to devices_url, flash: {warning: 'Device could not be autofilled' } }
          format.json { head :no_content }
        end
      end
    end
  end

  def get_device_info_internal
    url = URI.parse('https://api.sigfox.com/v2/devices/3AB6DA')
    req = Net::HTTP::Get.new(url.path)
    req.basic_auth '5e7a6a189ff3fb03e12d7a13', 'd40fd8169ba3ca312f033243586aa2d0'

    res = Net::HTTP.start(url.hostname, url.port, :use_ssl => true, :verify_mode => OpenSSL::SSL::VERIFY_NONE) {|http|
      http.request(req)
    }

    puts res.body.to_json
    res.body.to_json
  end

  def get_device_info
    # url = URI.parse('https://api.sigfox.com/v2/devices/3AB6DA')
    # req = Net::HTTP::Get.new(url.path)
    # req.basic_auth '5e7a6a189ff3fb03e12d7a13', 'd40fd8169ba3ca312f033243586aa2d0'

    # sock = Net::HTTP.new(url.host, url.port)
    # sock.use_ssl = true
    # sock.verify_mode = OpenSSL::SSL::VERIFY_NONE

    # resp = sock.start {|http| http.request(req) }
    
    # puts resp.body
    # sock.finish

    url = URI.parse('https://api.sigfox.com/v2/devices/3AB6DA')
    req = Net::HTTP::Get.new(url.path)
    req.basic_auth '5e7a6a189ff3fb03e12d7a13', 'd40fd8169ba3ca312f033243586aa2d0'

    res = Net::HTTP.start(url.hostname, url.port, :use_ssl => true, :verify_mode => OpenSSL::SSL::VERIFY_NONE) {|http|
      http.request(req)
    }

    puts res.body

    if res.body["message"]
      redirect_to devices_url, flash: {warning: 'Device data could not be retrieved because SigFox request limit reached' }
    else
      redirect_to devices_url, flash: {success: res.body }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_device
      @device = Device.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def device_params
      params.require(:device).permit(
        :id,
        :Name, 
        :SigfoxID,
        :SigfoxName,
        :SerialNumber,
        :Longitude,
        :Latitude,
        :SigfoxDeviceTypeID, :SigfoxDeviceTypeName,
        :SigfoxGroupID,
        :SigfoxGroupName,
        :SigfoxActivationTime,
        :SigfoxCreationTime,
        :SigfoxCreatedByID,
        :ClientGroupID)
    end
end
