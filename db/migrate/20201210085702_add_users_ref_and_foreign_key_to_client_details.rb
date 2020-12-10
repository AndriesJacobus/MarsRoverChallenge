class AddUsersRefAndForeignKeyToClientDetails < ActiveRecord::Migration[5.1]
  def up
    add_reference :users, :client_detail
    add_foreign_key :users, :client_details
  end

  def down
    remove_reference :users, :client_detail
    remove_foreign_key :users, :client_details
  end
end
