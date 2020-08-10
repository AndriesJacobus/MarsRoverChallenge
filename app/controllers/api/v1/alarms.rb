module API
  module V1
    class Alarms < Grape::API
      include API::V1::Defaults

      resource :alarms do
        desc "Return Alarms for specified User"
        params do
          requires :id, type: String, desc: "ID of the User"
        end
        get "id" do
          @alarms = []

          Alarm.all.each do |alarm|
            if alarm.device && alarm.device.client_group &&  alarm.device.client_group.client == User.find(permitted_params[:id]).client
              @alarms << alarm
            end
          end

          if @alarms
            status 200
            {
              :status => :ok,
              :alarm_data => @alarms.as_json(:include => {device: {except: :id}, message: {except: :id}})
            }.as_json
          else
            status 422
            { :status => :unprocessable_entity, :message => "Alarms could not be loaded because User with ID #{permitted_params[:id]} could not be found" }.as_json
          end
        end

      end
    end
  end
end