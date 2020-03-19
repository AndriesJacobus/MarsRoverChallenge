class CreateApiKeys < ActiveRecord::Migration[5.1]
  def change
    create_table :api_keys do |t|
      t.string :username
      t.string :password

      t.timestamps
    end
  end
end
