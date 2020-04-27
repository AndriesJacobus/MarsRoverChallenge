class Message < ApplicationRecord
    belongs_to :device, optional: true
end
