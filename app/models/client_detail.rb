class ClientDetail < ApplicationRecord
    has_many :clients, dependent: :nullify
    has_many :users, dependent: :nullify
end
