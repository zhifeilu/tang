class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :title
      t.text :body
      t.boolean :sticky, default: false
      t.timestamps
    end
  end
end
