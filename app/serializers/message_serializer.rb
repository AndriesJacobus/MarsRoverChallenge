class MessageSerializer < ActiveModel::Serializer
  attributes :id, :Time, :Data, :LQI, :created_at, :updated_at

  belongs_to :device
end