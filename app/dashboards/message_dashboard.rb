require "administrate/base_dashboard"

class MessageDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    device: Field::BelongsTo,
    logs: Field::HasMany,
    alarms: Field::HasMany,
    id: Field::Number,
    Time: Field::Number,
    Data: Field::String,
    LQI: Field::Number,
    created_at: Field::Text.with_options(
      searchable: true,
    ),
    updated_at: Field::DateTime,
    sigfox_defice_id: Field::String,
    sigfox_device_type_id: Field::String,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    created_at
    device
    logs
    alarms
    id
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
    created_at
    device
    logs
    alarms
    id
    Time
    Data
    LQI
    updated_at
    sigfox_defice_id
    sigfox_device_type_id
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
    device
    logs
    alarms
    Time
    Data
    LQI
    sigfox_defice_id
    sigfox_device_type_id
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

  # Overwrite this method to customize how messages are displayed
  # across all pages of the admin dashboard.
  
  def display_resource(message)
    message.Data
  end
end
