class AddAlarmRefsAndForeignKeys < ActiveRecord::Migration[5.1]
  def change
    add_reference :alarms, :device
    add_foreign_key :alarms, :devices

    add_reference :alarms, :message
    add_foreign_key :alarms, :messages

    add_reference :alarms, :user
    add_foreign_key :alarms, :users
  end
end
