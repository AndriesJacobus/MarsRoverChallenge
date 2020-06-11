class LogSerializer < ActiveModel::Serializer
  attributes :id, :trigger_by_bot, :action_type
end
