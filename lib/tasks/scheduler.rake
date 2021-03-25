
desc "This task is called by the Heroku scheduler add-on to: \nUpdate device states to offline if keepalive is missed"
task :check_device_keepalives => :environment do
  puts "Checking device messages..."
  puts ""

  Device.where.not(state: "offline").where.not(state: "maintenance").each do |device|
    # Check all devices that are not in maintenance or already offline
    # Note: this this also puts devices that are in alarm state into offline state

    @received_keepalive = false

    device.messages.where(created_at: 24.hours.ago..Time.now).each do |message|
      # Get all messages that were received within the last 24 hours

      if message.Data.to_s[0...2] == "16" && Time.at(message.Time) > 24.hours.ago
        # Message is a keepalive and the time 
        # of the message is in the last 24 hours (23.hours.ago.to_i > 24.hours.ago.to_i)

        @received_keepalive = true
        break

      end

    end

    if !@received_keepalive
      # Device missed it's 24-hour keepalive

      puts "Device '" + device.Name + "' missed its keepalive."
      puts "Switching '" + device.Name + "' offline."

      # device.update_attribute(:state, "offline")
      device.update(
        state: "offline",
        offline_acknowledged: nil,
      )

      device.save

      # Create a new alarm entry for device state update to offline

      @alarm = Alarm.new(
          acknowledged: false,
          device_id: device.id,
          state_change_from: "offline",
      )

      @alarm.save

      # Update action_cable with offline status
      data = {
        "update": "device",
        "id": device.id,
        "attribute": "state",
        "to": "offline",
      }
      ActionCable.server.broadcast("live_map_#{device.client_group.id}", data.as_json)

      # Todo: Check to see if all devices in current map_group is offline,
      # in which case turn the map_group to offline as well
      @map_group = device.map_group
      
      if @map_group
        @has_online_device = false

        @map_group.devices.where.not(id: device.id).each do |device|
          if device.state.downcase != "offline"
            @has_online_device = true
            break
          end
        end

        if @has_online_device == false
          # No devices are online, turn map_group status to offline
          @map_group.state = "offline"
          @map_group.save

          # Send action cable message to update relevant device's state
          data = {
            "update": "map_group",
            "id": @map_group.id,
            "attribute": "state",
            "to": "offline",
          }
          ActionCable.server.broadcast("live_map_#{device.client_group.id}", data.as_json)
        end
      end

      puts ""

    end
    
  end

  puts "done."
  
end
