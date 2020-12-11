class AlarmsController < ApplicationController
  before_action :set_alarm, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user, only: :index

  # GET /alarms
  # GET /alarms.json
  def index
    # Only Admins can view index
    if current_user.usertype == "Sysadmin"
      @alarms = Alarm.all.sort_by &:created_at
      @alarms.reverse!
    else
      # Todo: filter Alarms to show only those with the same 'client'
      #       tag as the current Admin
      @alarms = []

      Alarm.all.each do |alarm|
        if alarm.device && alarm.device.client_group && alarm.device.client_group.client && alarm.device.client_group.client.client_detail && alarm.device.client_group.client.client_detail == current_user.client_detail
          @alarms << alarm
        end
      end

      @alarms.sort_by &:created_at
      @alarms.reverse!
    end
  end

  # GET /alarms/1
  # GET /alarms/1.json
  def show
  end

  # GET /alarms/new
  def new
    @alarm = Alarm.new
  end

  # GET /alarms/1/edit
  def edit
  end

  # POST /acknowledge_all_alarms
  # POST /alarms.json
  def acknowledge_all_alarms
    if current_user.usertype == "Sysadmin"
      @alarms = Alarm.all

    else
      # Filter Alarms to show only those with the same 'client' tag as the current Admin
      @alarms = []

      Alarm.all.each do |alarm|
        if alarm.device && alarm.device.client_group && alarm.device.client_group.client == current_user.client
          @alarms << alarm
        end
      end
    end

    @alarms.each do |alarm|
      alarm.update_attributes(
        acknowledged: true,
        date_acknowledged: Time.now,
        alarm_reason: "Admin bulk Acknowledge",
        user_id: current_user.id,
        state_change_to: "online",
      )

      # Update livemaps if needed
      if alarm.device && alarm.device.client_group && alarm.device.map_group
        # Update device's live state
        alarm.device.update_attribute(:state, "online")

        data = {
          "update": "device",
          "id": alarm.device.id,
          "attribute": "state",
          "to": "online",
        }
        ActionCable.server.broadcast("live_map_#{alarm.device.client_group.id}", data.as_json)
        
        # Update device's live mapgroup state
        if alarm.device.map_group.state != "online"
          alarm.device.map_group.update_attribute(:state, "online")

          data = {
            "update": "map_group",
            "id": alarm.device.map_group.id,
            "attribute": "state",
            "to": "online",
          }

          ActionCable.server.broadcast("live_map_#{alarm.device.client_group.id}", data)
        end
      end
    end

    respond_to do |format|
      format.html { redirect_to alarms_url, flash: {success: 'Alarms were successfully acknowledged' } }
    end

  end

  # POST /alarms
  # POST /alarms.json
  def create

    # puts ""gi
    # puts params[:state_change_from]
    
    if params[:state_change_from] == "offline"
      @alarm = Alarm.where(device_id: params[:device_id]).where(acknowledged: false).where(state_change_from: "offline").last
    else
      @alarm = Alarm.where(device_id: params[:device_id]).where(acknowledged: false).where("lower(state_change_from) like ?", "%alarm%").last
    end

    if @alarm
      # Alarm is in alarm of is offline
        @alarm.update_attributes(
          acknowledged: params[:acknowledged],
          date_acknowledged: params[:date_acknowledged],
          alarm_reason: params[:alarm_reason],
          note: params[:note],
          user_id: current_user.id,
          state_change_to: params[:state_change_to],
        )
      # end
    else
      @alarm = Alarm.new(alarm_params)

      # Link device to alarm
      if !params[:device_id].nil?
        @device = Device.where(id: params[:device_id]).take

        if @device
          @alarm.device = @device
        end
      end

      # Link message to alarm
      if !params[:message_id].nil?
        @message = Message.where(id: params[:message_id]).take

        if @device
          @alarm.message = @message
        end
      end

      # Link user to alarm
      if !params[:user_id].nil?
        @user = User.where(id: params[:user_id]).take

        if @device
          @alarm.user = @user
        end
      end

      respond_to do |format|
        if @alarm.save
          format.html { redirect_to @alarm, flash: {success: 'Alarm was successfully created' } }
          format.json { render :show, status: :created, location: @alarm }
        else
          format.html { render :new }
          format.json { render json: @alarm.errors, status: :unprocessable_entity }
        end
      end

    end    
  end

  # PATCH/PUT /alarms/1
  # PATCH/PUT /alarms/1.json
  def update
    respond_to do |format|
      if @alarm.update(alarm_params)
        format.html { redirect_to @alarm, flash: {success: 'Alarm was successfully updated' } }
        format.json { render :show, status: :ok, location: @alarm }
      else
        format.html { render :edit }
        format.json { render json: @alarm.errors, status: :unprocessable_entity }
      end
    end
  end
  
    # DELETE /alarms/1
    # DELETE /alarms/1.json
    def destroy
      @alarm.destroy
      respond_to do |format|
        format.html { redirect_to alarms_url, flash: {warning: 'Alarm was successfully deleted' } }
        format.json { head :no_content }
      end
    end

  # DELETE /alarms/delete_all_alarms
  def delete_all_alarms
    if !(current_user.usertype == "Sysadmin" || current_user.usertype == "Client Admin")
      respond_to do |format|
        format.html { redirect_to alarms_url, flash: {warning: 'Only Admin users can perform this operation' } }
        format.json { head :no_content }
      end

    else
      @alarms = Alarm.all
      
      @alarms.each do |alarm|
        alarm.destroy
      end
  
      respond_to do |format|
        format.html { redirect_to alarms_url, flash: {warning: 'Alarms were successfully deleted' } }
        format.json { head :no_content }
      end

    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_alarm
      @alarm = Alarm.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def alarm_params
      params.require(:alarm).permit(
        :acknowledged, 
        :date_acknowledged, 
        :alarm_reason, 
        :note,
        :device_id,
        :user_id,
        :message_id,
        :state_change_to,
        :state_change_from,
      )
    end
end
