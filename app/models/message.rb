class Message < ActiveRecord::Base
  validates_presence_of :title, :user, :email, :phone, :body
end
