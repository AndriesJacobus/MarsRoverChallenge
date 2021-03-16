class MessagesController < ApplicationController
  before_action :set_message, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user, only: :index

  require 'date'

  # GET /messages
  # GET /messages.json
  def index
    # Only Admins can view index
    if current_user.usertype == "Sysadmin"
      @messages = Message.all
    elsif current_user.usertype == "Client Admin"
      # Todo: filter messages to show only those with the same 'client'
      #       tag as the current Admin
      @messages = []

      Message.where.not(device_id: nil).each do |message|
        if message.device.client_group.client && message.device.client_group.client.client_detail && message.device.client_group.client.client_detail == current_user.client_detail
          @messages << message
        end
      end
    else
      redirect_to root_path, flash: {warning: 'Please log in as an Admin before viewing this page' }
    end
  end

  # GET /messages/1
  # GET /messages/1.json
  def show
  end

  # GET /messages/new
  def new
    @message = Message.new
  end

  # GET /messages/1/edit
  def edit
  end

  # POST /messages
  # POST /messages.json
  def create
    @message = Message.new(message_params)

    # Look for device with sigfox id
    @device = Device.where(SigfoxID: params[:sigfox_defice_id]).take
    if @device
      @device.messages << @message

      # Update device with message info, if not present
      if !@device.SigfoxDeviceTypeID || @device.SigfoxDeviceTypeID == ""
        @device.update_attribute(:SigfoxDeviceTypeID, params[:sigfox_device_type_id])
      end

      if @message.Data.to_s[0...2] == "52"
        # Update device state to alarm (not a keepalive)
        
        m = @message.Data.to_s[13...14]   # Ignore first nibble between 12 and 13
        m = m.hex.to_s(2).rjust(m.size*4, '0')
        
        if m.to_s[0...2] == "00"
          @device.update_attribute(:state, "Legacy Alarm")
        elsif m.to_s[0...2] == "01"
          @device.update_attribute(:state, "Climb Alarm")
        elsif m.to_s[0...2] == "10"
          @device.update_attribute(:state, "Cut Alarm")
        elsif m.to_s[0...2] == "11"
          @device.update_attribute(:state, "Climb and Cut Alarm")
        end
        
      elsif @message.Data.to_s[0...2] == "16"
        # Message is is a keepalive

        # Update device state to online if need be
        if @device.state == "offline"

          @device.update_attribute(:state, "online")

          # Update alarm entry
          @alarm = Alarm.where(device_id: @device.id).where(acknowledged: false).where(state_change_from: "offline").last
          
          if @alarm

            @alarm.update(
              acknowledged: true,
              date_acknowledged: Time.now,
              alarm_reason: "Keepalive received",
              state_change_to: "online",
            )

          end

        end

      end

      # Create log entry
      @log = Log.new(trigger_by_bot: "device_bot", action_type: "message_linked_to_device")
      @log.message = @message
      @log.device = @device
      @log.save

    end

    respond_to do |format|
      if @message.save
        # Create log entry
        @log = Log.new(trigger_by_bot: "message_bot", action_type: "message_created")
        @log.message = @message
        @log.save

        format.html { redirect_to @message, flash: {success: 'Message was successfully created' } }
        format.json { render :show, status: :created, location: @message }
      else
        format.html { render :new }
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /messages/1
  # PATCH/PUT /messages/1.json
  def update
    respond_to do |format|
      if @message.update(message_params)
        # Create log entry
        @log = Log.new(trigger_by_bot: "message_bot", action_type: "message_updated")
        @log.message = @message
        @log.save

        format.html { redirect_to @message, flash: {success: 'Message was successfully updated' } }
        format.json { render :show, status: :ok, location: @message }
      else
        format.html { render :edit }
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /messages/1
  # DELETE /messages/1.json
  def destroy
    # Create log entry
    @log = Log.new(trigger_by_bot: "message_bot", action_type: "message_deleted")
    @log.user = current_user
    @log.save
    
    @message.destroy
    respond_to do |format|
      format.html { redirect_to messages_url, flash: {warning: 'Message was successfully deleted' } }
      format.json { head :no_content }
    end
  end

  # DELETE /delete_all_messages
  def delete_all_messages
    
    if !(current_user.usertype == "Sysadmin" || current_user.usertype == "Client Admin")

      # Create log entry
      @log = Log.new(trigger_by_bot: "message_bot", action_type: "all_messages_delete_blocked")
      @log.user = current_user
      @log.message = @message
      @log.save

      respond_to do |format|
        format.html { redirect_to messages_url, flash: {warning: 'Only Admin users can perform this operation. A log has been made of your attempt' } }
        format.json { head :no_content }
      end

    else
      
      # Create log entry
      @log = Log.new(trigger_by_bot: "message_bot", action_type: "all_messages_deleted")
      @log.user = current_user
      @log.save

      @messages = Message.all
        
      @messages.each do |message|
        message.destroy
      end
      
      respond_to do |format|
        format.html { redirect_to messages_url, flash: {warning: 'Messages successfully deleted' } }
        format.json { head :no_content }
      end

    end

  end

  # 
  def interpret_data

    @device

    res = ""

    return res.to_json
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_message
      @message = Message.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def message_params
      params.require(:message).permit(:Time, :Data, :LQI, :sigfox_defice_id, :sigfox_device_type_id)
    end
end
