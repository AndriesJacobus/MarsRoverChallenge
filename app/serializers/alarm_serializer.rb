class AlarmSerializer < ActiveModel::Serializer
  attributes :id, :acknowledged, :date_acknowledged, :alarm_reason, :note
end
