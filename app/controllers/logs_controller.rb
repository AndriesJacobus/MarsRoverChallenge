class LogsController < ApplicationController
  before_action :set_log, only: [:show, :edit, :update, :destroy]

  # GET /logs
  # GET /logs.json
  def index
    if current_user.usertype == "Sysadmin"
      @logs = Log.all
    elsif current_user.usertype == "Client Admin"
      @logs = Log.where(client_id: current_user.client_id)
    end
  end

  # GET /logs/1
  # GET /logs/1.json
  def show
  end

  # GET /logs/new
  def new
    @log = Log.new
  end

  # GET /logs/1/edit
  def edit
  end

  # POST /logs
  # POST /logs.json
  def create
    @log = Log.new(log_params)

    respond_to do |format|
      if @log.save
        format.html { redirect_to @log, flash: {success: 'Log was successfully created' } }
        format.json { render :show, status: :created, location: @log }
      else
        format.html { render :new }
        format.json { render json: @log.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /logs/1
  # PATCH/PUT /logs/1.json
  def update
    respond_to do |format|
      if @log.update(log_params)
        format.html { redirect_to @log, flash: {success: 'Log was successfully updated' }  }
        format.json { render :show, status: :ok, location: @log }
      else
        format.html { render :edit }
        format.json { render json: @log.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /logs/1
  # DELETE /logs/1.json
  def destroy
    @log.destroy
    respond_to do |format|
      format.html { redirect_to logs_url, flash: {warning: 'Log was successfully deleted' } }
      format.json { head :no_content }
    end
  end

  # DELETE /delete_all_logs
  def delete_all_logs
    
    if !(current_user.usertype == "Sysadmin" || current_user.usertype == "Client Admin")

      # Create log entry
      @log = Log.new(trigger_by_bot: "log_bot", action_type: "all_logs_delete_blocked")
      @log.user = current_user
      @log.save

      respond_to do |format|
        format.html { redirect_to logs_url, flash: {warning: 'Only Admin users can perform this operation. A log has been made of your attempt' } }
        format.json { head :no_content }
      end

    else
      
      @logs = Log.all
      
      @logs.each do |log|
        log.destroy
      end
      
      # Create log entry
      @log = Log.new(trigger_by_bot: "log_bot", action_type: "all_logs_deleted")
      @log.user = current_user
      @log.save
      
      respond_to do |format|
        format.html { redirect_to logs_url, flash: {warning: 'Logs successfully deleted' } }
        format.json { head :no_content }
      end

    end

  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_log
      @log = Log.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def log_params
      params.require(:log).permit(:trigger_by_bot, :action_type)
    end
end
