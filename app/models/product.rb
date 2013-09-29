class Product < ActiveRecord::Base
  mount_uploader :avatar, AvatarUploader

  validates_presence_of :name
  validates_presence_of :body
  validates_presence_of :avatar
end
