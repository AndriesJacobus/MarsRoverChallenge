class Message < ApplicationRecord
    belongs_to :device, optional: true

    has_many :logs
    has_many :alarms
end
