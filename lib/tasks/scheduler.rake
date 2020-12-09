
desc "This task is called by the Heroku scheduler add-on to: \nUpdate device states to offline if keepalive is missed"
task :check_device_keepalives => :environment do
  puts "Checking device messages..."
  puts ""

  Device.where.not(state: "offline").where.not(state: "maintenance").each do |device|
    # Check all devices that are not in maintenance or already offline

    @received_keepalive = false

    device.messages.where(created_at: 24.hours.ago..Time.now).each do |message|
      # Get all messages that were received within the last 24 hours

      if message.Data.to_s[0...2] == "16" && Time.at(message.Time) > 24.hours.ago
        # Message is a keepalive and the time 
        # of the message is in the last 24 hours

        @received_keepalive = true
        break

      end

    end

    if !@received_keepalive
      # Device missed it's 24-hour keepalive

      puts "Device '" + device.Name + "' missed its keepalive."
      puts "Switching '" + device.Name + "' offline."

      device.update_attribute(:state, "offline")

      # Create a new alarm entry for device state update to offline

      @alarm = Alarm.new(
          acknowledged: false,
          device_id: device.id,
          state_change_from: "offline",
      )

      @alarm.save

      # Todo: update action_cable with offline status

      puts ""

    end
    
  end

  puts "done."
  
end
