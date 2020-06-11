class AddRefsAndForeignKeysToLog < ActiveRecord::Migration[5.1]
  def change
    add_reference :logs, :client
    add_foreign_key :logs, :clients

    add_reference :logs, :client_group
    add_foreign_key :logs, :client_groups

    add_reference :logs, :map_group
    add_foreign_key :logs, :map_groups

    add_reference :logs, :device
    add_foreign_key :logs, :devices

    add_reference :logs, :message
    add_foreign_key :logs, :messages

    add_reference :logs, :user
    add_foreign_key :logs, :users
  end
end
