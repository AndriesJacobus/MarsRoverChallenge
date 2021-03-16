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
              @device.save

              # Update device with message info, if not present
              if !@device.SigfoxDeviceTypeID || @device.SigfoxDeviceTypeID == ""
                @device.update_attribute(:SigfoxDeviceTypeID, permitted_params[:callback_data][:sigfox_device_type_id])
              end

              # See if we can automatically link a Client Site with this device
              if @device.client_group.nil? && permitted_params[:callback_data][:sigfox_device_type_id]
                # Create new client group that is linked with the correct client
                # and link the device to the new client group
                
                quick_setup(@device.id, permitted_params[:callback_data][:sigfox_device_type_id])
              end

              # Set device and map_group states
              if @message.Data.to_s[0...2] == "52" && @device.state != "maintenance"
                # If the message is an alarm and the device is not in maintenance 
                # Update device state to alarm (not a keepalive)
                
                m = @message.Data.to_s[13...14]   # Ignore first nibble between 12 and 13
                m = m.hex.to_s(2).rjust(m.size*4, '0')

                alarm_type = ""
                
                if m.to_s[0...2] == "00"
                  @device.update_attribute(:state, "Legacy Alarm")

                  alarm_type = "Legacy Alarm"

                elsif m.to_s[0...2] == "01"
                  @device.update_attribute(:state, "Climb Alarm")

                  alarm_type = "Climb Alarm"

                elsif m.to_s[0...2] == "10"
                  @device.update_attribute(:state, "Cut Alarm")

                  alarm_type = "Cut Alarm"

                elsif m.to_s[0...2] == "11"
                  @device.update_attribute(:state, "Climb and Cut Alarm")

                  alarm_type = "Climb and Cut Alarm"

                end

                if @device.client_group
                  # Update live maps if the sigfox_device_type_id was given
                  # and thus a client_group was made for the device
                  send_action_cable_update(
                    "device",
                    @device.id,
                    "state",
                    alarm_type,
                    @device.client_group.id
                  )
                end

                # Update parimeter state
                if @device.state.downcase.include?("alarm") && @device.map_group && !@device.map_group.state.downcase.include?("alarm")
                  @device.map_group.state = "alarm"
                  @device.map_group.save
                  
                  send_action_cable_update(
                    "map_group",
                    @device.map_group.id,
                    "state",
                    "alarm",
                    @device.client_group.id
                  )
                end

                # Create Alarm entry (with acknowledged = false)
                # to be updated later when alarms are acknowledged

                @alarm = Alarm.new(
                  acknowledged: false,
                  device_id: @device.id,
                  state_change_from: @device.state,
                  message_id: @message.id
                )
      
                @alarm.save

              elsif @message.Data.to_s[0...2] == "16" && @device.state != "maintenance"
                # If the message is an offline alarm and the device is not in maintenance 
                # Update device state to online if need be (is a keepalive)

                if @device.state == "offline"
                  
                  @device.update_attribute(:state, "online")
                  
                  send_action_cable_update(
                    "device",
                    @device.id,
                    "state",
                    "online",
                    @device.client_group.id
                  )

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
              @log.client_group = @device.client_group ? @device.client_group : nil
              @log.client = (@device.client_group && @device.client_group.client ) ? @device.client_group.client : nil
              @log.save
              
            else
              # Device does not yet exist, so create a new one
              
              @device = Device.new(
                :Name => "#{permitted_params[:callback_data][:sigfox_defice_id]} Wi-I-Cloud",
                :SigfoxID => permitted_params[:callback_data][:sigfox_defice_id],
                :SigfoxDeviceTypeID => permitted_params[:callback_data][:sigfox_device_type_id],
                :state => "online",
              )
              
              @device.messages << @message
              @device.save

              # See if we can automatically link a Client Site with this device
              if permitted_params[:callback_data][:sigfox_device_type_id]
                # Create new client group that is linked with the correct client
                # and link the device to the new client group
                
                quick_setup(@device.id, permitted_params[:callback_data][:sigfox_device_type_id])
              end

              # Set device and map_group states
              if @message.Data.to_s[0...2] == "52"
                # Update device state to alarm (not a keepalive)
                
                m = @message.Data.to_s[13...14]   # Ignore first nibble between 12 and 13
                m = m.hex.to_s(2).rjust(m.size*4, '0')

                alarm_type = ""
                
                if m.to_s[0...2] == "00"
                  @device.update_attribute(:state, "Legacy Alarm")

                  alarm_type = "Legacy Alarm"

                elsif m.to_s[0...2] == "01"
                  @device.update_attribute(:state, "Climb Alarm")

                  alarm_type = "Climb Alarm"
                  
                elsif m.to_s[0...2] == "10"
                  @device.update_attribute(:state, "Cut Alarm")

                  alarm_type = "Cut Alarm"
                  
                elsif m.to_s[0...2] == "11"
                  @device.update_attribute(:state, "Climb and Cut Alarm")

                  alarm_type = "Climb and Cut Alarm"
                  
                end

                if @device.client_group
                  # Update live maps if the sigfox_device_type_id was given
                  # and thus a client_group was made for the device
                  send_action_cable_update(
                    "device",
                    @device.id,
                    "state",
                    alarm_type,
                    @device.client_group.id
                  )
                end

                # Create Alarm entry (with acknowledged = false)
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
              @log.client = (@device.client_group && @device.client_group.client ) ? @device.client_group.client : nil
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