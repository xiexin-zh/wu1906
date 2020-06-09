# 當前用戶所有群組的數據

## 使用接口 18

### 數據初次同步

#### API 54. 你的群组

使用接口：API 文檔 54 `/nf_api/your_group`

type 1、2、3 分別是自己是成員的群、自己追蹤的群、其他群（公開）

放棄使用 API 11.1 `/nf_api/all_group_list` 原因是該接口分頁會帶上已經追蹤的群組數據

放棄使用 API 9 `/nf_api/post_by_group_list` 原因是該接口數據都可以在 `/nf_api/your_group` 獲取到

群組詳情的數據字段見 `src/models/defines/GroupDetails.js`

### 數據修改

#### API 15. 追踪/取消追踪群组

`/nf_api/follow_group`

#### API 26. 群組詳情

`/nf_api/group_details`

#### API 32. 群组成员

`/nf_api/group_member`

#### API 38. 創建群組

`/nf_api/create_group`

#### API 39. 編輯群組信息

`/nf_api/edit_group`

#### API 42. 群组邀请用户

`/nf_api/group_invite_users`

#### API 43. 群组粉丝列表

`/nf_api/group_follows`

#### API 44. 群组通知开启/关闭

`/nf_api/group_notice`

#### API 45. 加入/离开群组（群组成员）

`/nf_api/join_group`

#### API 46. 设置群组管理员列表

`/nf_api/set_admin_list`

#### API 47. 添加/编辑群组管理员

`/nf_api/set_admin_list`

#### API 48. 移除群组管理员

`/nf_api/remove_group_admin`

#### API 49. 移除群组成员

`/nf_api/remove_group_member`

#### API 53. 邀请群组成员人员过滤

`/nf_api/invite_user_filter`

#### API 55. 用户不接受群组邀请

`/nf_api/no_accept_group_invite`

#### API 57. 群组管理员或普通成员列表

`/nf_api/group_common_or_admin_member`

## socket 消息

- group_post
- vote_group_member
- group_post_top
- group_invite_user
