class AddMessageRefAndForeignKeyToDevice < ActiveRecord::Migration[5.1]
  def change
    add_reference :messages, :device
    add_foreign_key :messages, :devices
  end
end
