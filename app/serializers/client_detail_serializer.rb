class ClientDetailSerializer < ActiveModel::Serializer
  attributes :id, :name, :company_name, :business_address
end
