# App.live_map = App.cable.subscriptions.create "LiveMapChannel",
#   connected: ->
#     # Called when the subscription is ready for use on the server
#     # alert("")
#     # LiveMapChannel.broadcast_to('live_map', "Hello")

#   disconnected: ->
#     # Called when the subscription has been terminated by the server

#   received: (data) ->
#     # Called when there's incoming data on the websocket for this channel
#     alert(data)
