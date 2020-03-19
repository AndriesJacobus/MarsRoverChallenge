require 'test_helper'

class MapGroupsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @map_group = map_groups(:one)
  end

  test "should get index" do
    get map_groups_url
    assert_response :success
  end

  test "should get new" do
    get new_map_group_url
    assert_response :success
  end

  test "should create map_group" do
    assert_difference('MapGroup.count') do
      post map_groups_url, params: { map_group: { Name: @map_group.Name } }
    end

    assert_redirected_to map_group_url(MapGroup.last)
  end

  test "should show map_group" do
    get map_group_url(@map_group)
    assert_response :success
  end

  test "should get edit" do
    get edit_map_group_url(@map_group)
    assert_response :success
  end

  test "should update map_group" do
    patch map_group_url(@map_group), params: { map_group: { Name: @map_group.Name } }
    assert_redirected_to map_group_url(@map_group)
  end

  test "should destroy map_group" do
    assert_difference('MapGroup.count', -1) do
      delete map_group_url(@map_group)
    end

    assert_redirected_to map_groups_url
  end
end
