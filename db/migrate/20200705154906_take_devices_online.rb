class TakeDevicesOnline < ActiveRecord::Migration[5.1]
  def change
    Device.where(state: nil).update_all(state: "online")
  end
end
