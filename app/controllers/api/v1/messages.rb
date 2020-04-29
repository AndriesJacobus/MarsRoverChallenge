module API
  module V1
    class Messages < Grape::API
      include API::V1::Defaults

      resource :messages do
        desc "Return all messages"
        get "", root: :messages do
          Message.all
        end

        desc "Return a message"
        params do
          requires :id, type: String, desc: "ID of the message"
        end
        get ":id", root: "message" do
          Message.where(id: permitted_params[:id]).first!
        end

        desc "Pass a Callback from Sigfox to Messages"
        params do
          requires :callback_data, type: Hash, desc: 'Data of the Sigfox Device Callback Message' do

            requires :Time, type: Integer, desc: 'Time that the Message being sent was received'
            requires :Data, type: String, desc: 'Data of the Message'
            requires :LQI, type: Integer, desc: 'Signal strength of the Message'
            requires :sigfox_defice_id, type: String, desc: 'ID of the Sigfox Device'
            requires :sigfox_device_type_id, type: String, desc: 'ID of the Sigfox Device Type'

          end
        end
        post do
          begin
            Message.create!(permitted_params[:callback_data])
            status 200 # Saved OK
          rescue ActiveRecord::RecordNotFound => e
            status 404 # Not found
          end
        end        

      end
    end
  end
end