class AddOfflineAlarmAckFlagToDevices < ActiveRecord::Migration[6.1]
  def change
    add_column :devices, :offline_acknowledged, :boolean, default: nil
  end
end
