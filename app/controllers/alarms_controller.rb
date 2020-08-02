class AlarmsController < ApplicationController
  before_action :set_alarm, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user, only: :index

  # GET /alarms
  # GET /alarms.json
  def index
    # Only Admins can view index
    if current_user.usertype == "Sysadmin"
      @alarms = Alarm.all
    else
      # Todo: filter Alarms to show only those with the same 'client'
      #       tag as the current Admin
      @alarms = Alarm.all
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

  # POST /alarms
  # POST /alarms.json
  def create
    @alarm = Alarm.new(alarm_params)

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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_alarm
      @alarm = Alarm.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def alarm_params
      params.require(:alarm).permit(:acknowledged, :date_acknowledged, :alarm_reason, :note)
    end
end
