/**
 * crm_customer 客户信息中的 table head 信息
 *
 *
 *
 */

export const crmCustomerTableHeadList = {
  crm_customer: [
    {
      field: "name",
      form_type: "text",
      name: "姓名",
      width: ""
    },
    {
      field: "pictures",
      form_type: "upload_img",
      name: "頭像",
      width: ""
    },
    {
      field: "level",
      form_type: "select",
      name: "性別",
      width: "",
      setting: ["男", "女"]
    },
    {
      field: "industry",
      form_type: "datetime",
      name: "生日",
      width: ""
    },
    {
      field: "source",
      form_type: "text",
      name: "常住地區",
      width: ""
    },
    {
      field: "deal_status",
      form_type: "select",
      name: "語言",
      width: "",
      setting: ["中文", "繁体中文", "英文"]
    },
    {
      field: "telephone",
      form_type: "checkbox",
      name: "身份層級",
      width: "",
      setting: ["一级", "二级", "三级"]
    },
    {
      field: "website",
      form_type: "checkbox",
      name: "代理玩家",
      width: "",
      setting: ["股东", "玩家"]
    },
    {
      field: "next_time",
      form_type: "checkbox",
      name: "類型",
      width: "",
      setting: ["A", "B", "C"]
    },
    {
      field: "remark",
      form_type: "select",
      name: "上線戶口",
      setting: ["王某", "程某", "张某"]
    },
    {
      field: "mobile",
      form_type: "checkbox",
      name: "關聯戶口",
      width: "",
      setting: ["王某", "程某", "张某"]
    }
  ],
  headList: [
    {
      field: "compellation",
      form_type: "text",
      name: "姓名",
      width: "200"
    },
    {
      field: "money",
      form_type: "select",
      name: "接觸類型",
      width: "200",
      setting: ["約見"]
    },
    {
      field: "name",
      form_type: "datetime",
      name: "開始時間",
      width: "200"
    },
    {
      field: "customer",
      form_type: "text",
      name: "主題",
      width: "200"
    },
    {
      field: "names",
      form_type: "datetime",
      name: "結束時間",
      width: "200"
    },
    {
      field: "status_id",
      form_type: "text",
      name: "地點",
      width: "200"
    },
    {
      field: "type_id",
      form_type: "select",
      name: "跟進類型",
      width: "200",
      setting: ["部門跟進", "跟進"]
    },
    {
      field: "department",
      form_type: "select",
      name: "部門|跟進人",
      width: "200",
      setting: ["請選擇", "jop"]
    },
    {
      field: "sketch",
      form_type: "textarea",
      name: "簡述",
      width: "400"
    }
  ],
  contact: [
    {
      field: "compellation",
      form_type: "text",
      name: "姓名",
      width: "200"
    },
    {
      field: "money",
      form_type: "select",
      name: "接觸類型",
      width: "200",
      setting: ["MD接觸", "安排行程", "禮遇"]
    },
    {
      field: "name",
      form_type: "datetime",
      name: "開始時間",
      width: "200"
    },
    {
      field: "customer",
      form_type: "text",
      name: "主題",
      width: "200"
    },
    {
      field: "names",
      form_type: "datetime",
      name: "結束時間",
      width: "200"
    },
    {
      field: "status_id",
      form_type: "text",
      name: "地點",
      width: "200"
    },
    {
      field: "type_id",
      form_type: "select",
      name: "跟進類型",
      width: "200",
      setting: ["部門跟進", "跟進"]
    },
    {
      field: "department",
      form_type: "select",
      name: "部門|跟進人",
      width: "200",
      setting: ["請選擇", "jop"]
    },
    {
      field: "sketch",
      form_type: "textarea",
      name: "簡述",
      width: "400"
    }
  ],
  crmCustomer: [
    {
      field: "name",
      form_type: "text",
      name: "姓名",
      width: "",
      value: ""
    },
    {
      field: "vip_room",
      form_type: "select",
      name: "貴賓廳",
      width: "",
      setting: ["a", "b", "c"],
      value: ""
    },
    {
      field: "start_time",
      form_type: "datetime",
      name: "時間(開始)",
      width: "",
      value: ""
    },
    {
      field: "end_time",
      form_type: "datetime",
      name: "時間(結束)",
      width: "",
      value: ""
    },
    {
      field: "gaming_products",
      form_type: "select",
      name: "博彩產業",
      width: "",
      setting: ["a", "b", "c"],
      value: ""
    },
    {
      field: "max_amount",
      form_type: "text",
      name: "最高營運金額",
      width: "",
      value: ""
    },
    {
      field: "average_amount",
      form_type: "text",
      name: "平均營運金額",
      width: "",
      value: ""
    },
    {
      field: "monthly_transcoding",
      form_type: "text",
      name: "月轉碼",
      width: "",
      value: ""
    },
    {
      field: "brokerage",
      form_type: "text",
      name: "傭金",
      width: "",
      value: ""
    },
    {
      field: "cooperative_contents	",
      form_type: "textarea",
      name: "合作內容"
    },
    {
      field: "capital_stock",
      form_type: "text",
      name: "股本",
      width: "",
      value: ""
    },
    {
      field: "loan_amount",
      form_type: "text",
      name: "借貸額",
      width: "",
      value: ""
    },
    {
      field: "overdraft",
      form_type: "text",
      name: "欠款",
      width: "",
      value: ""
    },
    {
      field: "remark",
      form_type: "textarea",
      name: "備注",
      width: "",
      value: ""
    }
  ]
};
