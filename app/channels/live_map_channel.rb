class LiveMapChannel < ApplicationCable::Channel

  def subscribed
    # stream_from "some_channel"
    stream_from "live_map_#{params[:id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    # Optional: rebroadcast all received msgs
  end

  def speak(data)
    puts "\n\n"
    puts data
    puts "\n\n"
  end

end
