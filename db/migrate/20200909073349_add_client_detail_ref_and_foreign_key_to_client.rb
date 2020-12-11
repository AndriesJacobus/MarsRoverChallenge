class AddClientDetailRefAndForeignKeyToClient < ActiveRecord::Migration[5.1]
  def up
    add_reference :clients, :client_detail
    add_foreign_key :clients, :client_details
  end

  def down
    remove_reference :clients, :client_detail
    remove_foreign_key :clients, :client_details

    remove_column :client_details, :client_id
  end
end
