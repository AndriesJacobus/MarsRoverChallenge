class AddSigfoxDeviceInfoToMessage < ActiveRecord::Migration[5.1]
  def change
    add_column :messages, :sigfox_defice_id, :string
    add_column :messages, :sigfox_device_type_id, :string
  end
end
