class CreateProducts < ActiveRecord::Migration
  def change
    create_table :products do |t|
      t.string :name
      t.text :body
      t.string :avatar
      t.timestamps
    end
  end
end
