class Message < ApplicationRecord
    belongs_to :device, optional: true

    has_many :logs, dependent: :nullify
    has_many :alarms
end
