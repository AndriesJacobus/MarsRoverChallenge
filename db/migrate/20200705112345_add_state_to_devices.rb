class AddStateToDevices < ActiveRecord::Migration[5.1]
  def change
    add_column :devices, :state, :string
  end
end
