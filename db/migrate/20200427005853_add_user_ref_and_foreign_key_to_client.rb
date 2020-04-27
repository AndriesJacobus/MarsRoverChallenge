class AddUserRefAndForeignKeyToClient < ActiveRecord::Migration[5.1]
  def change
    add_reference :users, :client
    add_foreign_key :users, :clients
  end
end
