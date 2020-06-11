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
            @message = Message.create!(permitted_params[:callback_data])

            # Create log entry
            @log = Log.new(trigger_by_bot: "message_bot", action_type: "message_created")
            @log.message = @message
            @log.save

            # Look for device with sigfox id
            @device = Device.where(SigfoxID: permitted_params[:callback_data][:sigfox_defice_id]).take
            if @device
              @device.messages << @message

              # Update device with message info, if not present
              if !@device.SigfoxDeviceTypeID || @device.SigfoxDeviceTypeID == ""
                @device.update_attribute(:SigfoxDeviceTypeID, permitted_params[:callback_data][:sigfox_device_type_id])
              end

              # Create log entry
              @log = Log.new(trigger_by_bot: "device_bot", action_type: "message_linked_to_device")
              @log.message = @message
              @log.device = @device
              @log.save
            else
              # Device does not yet exist, so create a new one
              @device = Device.new(:Name => "#{permitted_params[:callback_data][:sigfox_defice_id]} Wi-I-Cloud", :SigfoxID => permitted_params[:callback_data][:sigfox_defice_id], :SigfoxDeviceTypeID => permitted_params[:callback_data][:sigfox_device_type_id])
              @device.messages << @message

              @device.save

              # Create log entry
              @log = Log.new(trigger_by_bot: "device_bot", action_type: "device_created_for_message")
              @log.message = @message
              @log.device = @device
              @log.save
            end

            status 200 # Saved OK
          rescue ActiveRecord::RecordNotFound => e
            status 404 # Not found
          end
        end        

      end
    end
  end
end