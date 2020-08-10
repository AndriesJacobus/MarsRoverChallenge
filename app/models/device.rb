class Device < ApplicationRecord
    belongs_to :client_group, optional: true
    belongs_to :map_group, optional: true

    has_many :messages
    has_many :logs
    has_many :alarms
end
