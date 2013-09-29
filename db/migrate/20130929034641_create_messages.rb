class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.string :title
      t.text :body
      t.string :user
      t.string :email
      t.string :phone
      t.timestamps
    end
  end
end
