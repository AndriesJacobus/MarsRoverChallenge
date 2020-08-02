# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20200802221901) do

  create_table "alarms", force: :cascade do |t|
    t.boolean "acknowledged"
    t.datetime "date_acknowledged"
    t.string "alarm_reason"
    t.string "note"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "device_id"
    t.integer "message_id"
    t.integer "user_id"
    t.index ["device_id"], name: "index_alarms_on_device_id"
    t.index ["message_id"], name: "index_alarms_on_message_id"
    t.index ["user_id"], name: "index_alarms_on_user_id"
  end

  create_table "api_keys", force: :cascade do |t|
    t.string "username"
    t.string "password"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "client_groups", force: :cascade do |t|
    t.string "Name"
    t.string "SigfoxGroupID"
    t.string "SigfoxGroupName"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "client_id"
    t.float "longitude"
    t.float "latitude"
    t.index ["client_id"], name: "index_client_groups_on_client_id"
  end

  create_table "clients", force: :cascade do |t|
    t.string "Name"
    t.string "SigfoxDeviceTypeID"
    t.string "SigfoxDeviceTypeName"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "devices", force: :cascade do |t|
    t.string "Name"
    t.string "SigfoxID"
    t.string "SigfoxName"
    t.string "SerialNumber"
    t.decimal "Longitude"
    t.decimal "Latitude"
    t.string "SigfoxDeviceTypeID"
    t.string "SigfoxDeviceTypeName"
    t.string "SigfoxGroupID"
    t.string "SigfoxGroupName"
    t.integer "SigfoxActivationTime"
    t.integer "SigfoxCreationTime"
    t.string "SigfoxCreatedByID"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "map_group_id"
    t.integer "client_group_id"
    t.string "state"
    t.index ["client_group_id"], name: "index_devices_on_client_group_id"
    t.index ["map_group_id"], name: "index_devices_on_map_group_id"
  end

  create_table "logs", force: :cascade do |t|
    t.string "trigger_by_bot"
    t.string "action_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "client_id"
    t.integer "client_group_id"
    t.integer "map_group_id"
    t.integer "device_id"
    t.integer "message_id"
    t.integer "user_id"
    t.index ["client_group_id"], name: "index_logs_on_client_group_id"
    t.index ["client_id"], name: "index_logs_on_client_id"
    t.index ["device_id"], name: "index_logs_on_device_id"
    t.index ["map_group_id"], name: "index_logs_on_map_group_id"
    t.index ["message_id"], name: "index_logs_on_message_id"
    t.index ["user_id"], name: "index_logs_on_user_id"
  end

  create_table "map_groups", force: :cascade do |t|
    t.string "Name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "client_group_id"
    t.float "startLon"
    t.float "startLat"
    t.float "endLon"
    t.float "endLat"
    t.index ["client_group_id"], name: "index_map_groups_on_client_group_id"
  end

  create_table "messages", force: :cascade do |t|
    t.integer "Time"
    t.string "Data"
    t.integer "LQI"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "device_id"
    t.string "sigfox_defice_id"
    t.string "sigfox_device_type_id"
    t.index ["device_id"], name: "index_messages_on_device_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.string "surname"
    t.string "usertype", default: "Operator"
    t.integer "client_id"
    t.index ["client_id"], name: "index_users_on_client_id"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

end
