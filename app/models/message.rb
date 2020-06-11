class Message < ApplicationRecord
    belongs_to :device, optional: true

    has_many :logs
end
