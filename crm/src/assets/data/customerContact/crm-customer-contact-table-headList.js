/**
 * crm_customer 客戶接觸中的 table head 信息
 *
 *
 *
 */
// export const contactsCreateTitle = {
//   contact: "接觸",
//   with: "約見"
// };

export const crmCustomerContactTableHeadList = [
  {
    field: "name",
    form_type: "text",
    name: "姓名",
    width: "",
    form_type: "select",
    setting: ["123", "456"]
  },
  {
    field: "industry",
    name: "最新接觸",
    width: "",
    form_type: "text"
  },
  {
    field: "level",
    name: "類型",
    width: "",
    form_type: "text"
  },
  {
    field: "source",
    name: "主題",
    width: "",
    form_type: "select",
    setting: ["玩家", "代理"]
  },
  {
    field: "deal_status",
    name: "跟進人",
    width: "",
    form_type: "select",
    setting: ["沒有", "戶主", "幕後老板"]
  },
  {
    field: "telephone",
    name: "地點",
    width: "",
    form_type: "text"
  },
  {
    field: "website",
    form_type: "text",
    name: "簡述",
    width: "",
    form_type: "select",
    setting: ["活動配套", "煙酒果盤", "行程安排"]
  }
  // {
  //   field: "communication",
  //   form_type: "datetime",
  //   name: "狀態",
  //   width: "",
  //   form_type: "select",
  //   setting: ["未交換成功", "微信", "派卡片"]
  // }
];
