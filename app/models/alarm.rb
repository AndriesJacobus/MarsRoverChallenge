class Alarm < ApplicationRecord
    belongs_to :device, optional: true
    belongs_to :message, optional: true
    belongs_to :user, optional: true
end
