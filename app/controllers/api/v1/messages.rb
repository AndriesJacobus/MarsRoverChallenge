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
            optional :LQI, type: Integer, desc: 'Signal strength of the Message'
            requires :sigfox_defice_id, type: String, desc: 'ID of the Sigfox Device'
            optional :sigfox_device_type_id, type: String, desc: 'ID of the Sigfox Device Type'

          end
        end
        post do
          begin
            @message = Message.create!(permitted_params[:callback_data])

            # Create log entry
            @log = Log.new(trigger_by_bot: "message_bot", action_type: "message_created")
            @log.message = @message
            @log.save

            # Todo: take into account seq numbers of messages

            # Look for device with sigfox id
            @device = Device.where(SigfoxID: permitted_params[:callback_data][:sigfox_defice_id]).take
            if @device
              @device.messages << @message

              # Update device with message info, if not present
              if !@device.SigfoxDeviceTypeID || @device.SigfoxDeviceTypeID == ""
                @device.update_attribute(:SigfoxDeviceTypeID, permitted_params[:callback_data][:sigfox_device_type_id])
              end

              # Update device state
              if @message.Data.to_s[0...2] == "52"
                # Not a keepalive
                
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

                # Update parimeter state
                if @device.state.downcase.include?("alarm") && @device.map_group && !@device.map_group.state.downcase.include?("alarm")
                  @device.map_group.state = "alarm"
                  @device.map_group.save
                end

                # Todo: create Alarm entry (with acknowledged = false)
                # to be updated later when alarms are acknowledged

                @alarm = Alarm.new(
                  acknowledged: false,
                  device_id: @device.id,
                  state_change_from: @device.state,
                  message_id: @message.id
                )
      
                @alarm.save

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
              
              # Update device state
              if @message.Data.to_s[0...2] == "52"
                # Not keepalive
                
                m = @message.Data.to_s[13...14]   # Ignore first nibble between 12 and 13
                m = m.hex.to_s(2).rjust(m.size*4, '0')
                
                if m.to_s[0...2] == "00"
                  @device.update_attribute(state: "Legacy Alarm")
                elsif m.to_s[0...2] == "01"
                  @device.update_attribute(state: "Climb Alarm")
                elsif m.to_s[0...2] == "10"
                  @device.update_attribute(state: "Cut Alarm")
                elsif m.to_s[0...2] == "11"
                  @device.update_attribute(state: "Climb and Cut Alarm")
                end

                # Update parimeter state
                if @device.state.downcase.include?("alarm") && @device.map_group && !@device.map_group.state.downcase.include?("alarm")
                  @device.map_group.state = "alarm"
                  @device.map_group.save
                end

                # Todo: create Alarm entry (with acknowledged = false)
                # to be updated later when alarms are acknowledged

                @alarm = Alarm.new(
                  acknowledged: false,
                  device_id: @device.id,
                  state_change_from: @device.state,
                  message_id: @message.id
                )
      
                @alarm.save

              end
              
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