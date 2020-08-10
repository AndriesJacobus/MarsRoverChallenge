require "grape-swagger"

module API
  module V1
    class Base < Grape::API
      mount API::V1::Users
      mount API::V1::Messages
      mount API::V1::Alarms
      # mount API::V1::AnotherResource

      add_swagger_documentation(
        api_version: "v1",
        hide_documentation_path: true,
        mount_path: "/api/v1/swagger_doc",
        hide_format: true,
        info: {
          title: "Wi-I-Cloud API",
          description:  "This is the API docs for the current version of the Wi-I-Cloud API.",
          # contact_name: "Contact name",
          # contact_email: "Contact@email.com",
          # contact_url: "Contact URL",
          # license: "The name of the license.",
          # license_url: "www.The-URL-of-the-license.org",
          # terms_of_service_url: "www.The-URL-of-the-terms-and-service.com",
        },
      )
    end
  end
end