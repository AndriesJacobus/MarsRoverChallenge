class AddClientGroupRefAndForeignKeyToClient < ActiveRecord::Migration[5.1]
  def change
    add_reference :client_groups, :client
    add_foreign_key :client_groups, :clients
  end
end
