require "administrate/base_dashboard"

class DeviceDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    client_group: Field::BelongsTo,
    map_group: Field::BelongsTo,
    messages: Field::HasMany,
    logs: Field::HasMany,
    alarms: Field::HasMany,
    id: Field::Number,
    Name: Field::String,
    SigfoxID: Field::String,
    SigfoxName: Field::String,
    SerialNumber: Field::String,
    Longitude: Field::String.with_options(searchable: false),
    Latitude: Field::String.with_options(searchable: false),
    SigfoxDeviceTypeID: Field::String,
    SigfoxDeviceTypeName: Field::String,
    SigfoxGroupID: Field::String,
    SigfoxGroupName: Field::String,
    SigfoxActivationTime: Field::Number,
    SigfoxCreationTime: Field::Number,
    SigfoxCreatedByID: Field::String,
    created_at: Field::Text.with_options(
      searchable: true,
    ),
    updated_at: Field::DateTime,
    state: Field::String,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    created_at
    client_group
    map_group
    messages
    logs
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
    created_at
    client_group
    map_group
    messages
    logs
    alarms
    id
    Name
    SigfoxID
    SigfoxName
    SerialNumber
    Longitude
    Latitude
    SigfoxDeviceTypeID
    SigfoxDeviceTypeName
    SigfoxGroupID
    SigfoxGroupName
    SigfoxActivationTime
    SigfoxCreationTime
    SigfoxCreatedByID
    updated_at
    state
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
    client_group
    map_group
    messages
    logs
    alarms
    Name
    SigfoxID
    SigfoxName
    SerialNumber
    Longitude
    Latitude
    SigfoxDeviceTypeID
    SigfoxDeviceTypeName
    SigfoxGroupID
    SigfoxGroupName
    SigfoxActivationTime
    SigfoxCreationTime
    SigfoxCreatedByID
    state
  ].freeze

  # COLLECTION_FILTERS
  # a hash that defines filters that can be used while searching via the search
  # field of the dashboard.
  #
  # For example to add an option to search for open resources by typing "open:"
  # in the search field:
  #
  #   COLLECTION_FILTERS = {
  #     open: ->(resources) { resources.where(open: true) }
  #   }.freeze
  COLLECTION_FILTERS = {}.freeze

  # Overwrite this method to customize how devices are displayed
  # across all pages of the admin dashboard.
  
  def display_resource(device)
    device.Name
  end
end
