class CreateManagementProfiles < ActiveRecord::Migration[5.1]
  def change
    create_table :management_profiles do |t|
      t.references :users, foreign_key: true
      t.references :clients, foreign_key: true

      t.timestamps
    end
  end
end
