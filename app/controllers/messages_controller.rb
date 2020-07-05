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
        if message.device.client_group.client && message.device.client_group.client == current_user.client
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
    @log.message = @message
    @log.save
    
    @message.destroy
    respond_to do |format|
      format.html { redirect_to messages_url, flash: {warning: 'Message was successfully deleted' } }
      format.json { head :no_content }
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
