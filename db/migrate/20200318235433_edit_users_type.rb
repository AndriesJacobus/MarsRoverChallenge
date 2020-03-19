class EditUsersType < ActiveRecord::Migration[5.1]
  def change
    rename_column :users, :type, :usertype
  end
end
