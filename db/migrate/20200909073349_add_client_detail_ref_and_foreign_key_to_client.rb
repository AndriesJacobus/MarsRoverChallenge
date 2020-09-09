class AddClientDetailRefAndForeignKeyToClient < ActiveRecord::Migration[5.1]
  def change
    add_reference :client_details, :client
    add_foreign_key :client_details, :client
  end
end
