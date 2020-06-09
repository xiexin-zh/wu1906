# 个人信息维护

## 接口使用

### 初次数据同步

#### API 1. 个人主页

`/nf_api/user_data`

#### API 2. 个人主页粉丝数据

`/nf_api/user_fans_data`

~~#### API 3. 个人主页追踪中的用户~~

_改用 6. 追踪更多个人用户_
~~`/nf_api/follow_user_list`~~

#### API 4. 个人主页追踪中的群组

`/nf_api/user_follow_group_list`

#### API 6. 追踪更多个人用户

`/nf_api/user_list`

~~#### API 7. 追踪更多群组列表~~

_改用本地数据，数据涞源为 54. 你的群组_
~~`/nf_api/follow_group_list`~~

~~#### API 8. 发布动态可标记的用户列表~~

_个人贴使用 6. 追踪更多个人用户；群组帖使用 32. 群组成员_
~~`/nf_api/mention_user_list`~~

### 數據修改

#### API 14. 追踪/取消追踪用户

`/nf_api/follow_user`

#### API 40. 個人信息編輯

`/nf_api/edit_user`

#### API 41. 用戶個人相冊

`/nf_api/user_album`

#### API SP. WebChat 接口，更新头像

`/api/teams/all/current_user`

## socket 消息

- follow
