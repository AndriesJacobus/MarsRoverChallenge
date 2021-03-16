require "administrate/base_dashboard"

class AlarmDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    device: Field::BelongsTo,
    message: Field::BelongsTo,
    user: Field::BelongsTo,
    id: Field::Number,
    acknowledged: Field::Boolean,
    date_acknowledged: Field::DateTime,
    alarm_reason: Field::String,
    note: Field::String,
    created_at: Field::Text.with_options(
      searchable: true,
    ),
    updated_at: Field::DateTime,
    state_change_to: Field::String,
    state_change_from: Field::String,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    created_at
    device
    message
    user
    id
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
    created_at
    device
    message
    user
    id
    acknowledged
    date_acknowledged
    alarm_reason
    note
    updated_at
    state_change_to
    state_change_from
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
    device
    message
    user
    acknowledged
    date_acknowledged
    alarm_reason
    note
    state_change_to
    state_change_from
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

  # Overwrite this method to customize how alarms are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(alarm)
  #   "Alarm ##{alarm.id}"
  # end
end
