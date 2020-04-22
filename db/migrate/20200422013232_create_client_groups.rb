class CreateClientGroups < ActiveRecord::Migration[5.1]
  def change
    create_table :client_groups do |t|
      t.string :Name
      t.string :SigfoxGroupID
      t.string :SigfoxGroupName

      t.timestamps
    end
  end
end
