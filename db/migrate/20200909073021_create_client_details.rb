class CreateClientDetails < ActiveRecord::Migration[5.1]
  def change
    create_table :client_details do |t|
      t.string :name
      t.string :company_name
      t.string :business_address

      t.timestamps
    end
  end
end
