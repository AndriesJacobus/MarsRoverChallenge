class HomeController < ApplicationController
  def index
  end

  def calculate_movement_output
    @movement = RoverMovement.new(movement_params)
    success = @movement.calculate_output

    @movement.save unless success == false

    respond_to do |format|
      msg = {
        :status => success ? "ok" : "i_error",
        :output => @movement.output
      }
      format.json  { render :json => msg }
    end
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def movement_params
      params.require(:home).permit(
        :input
      )
    end
end
