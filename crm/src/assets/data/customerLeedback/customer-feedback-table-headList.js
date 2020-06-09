/**
 * crm_customer 客戶接觸中的 table head 信息
 *
 *
 *
 */
export const contactsCreateTitleFeedback = {
  complaint: "投訴",
  demand: "需求",
  opinion: "意見"
};

export const customerFeedbackTableHeadList = {
  receivables_plan: [
    {
      field: "num",
      form_type: "text",
      name: "期數"
    },
    {
      field: "customer_id",
      form_type: "customer_id",
      name: "戶口名稱"
    },
    {
      field: "contract_id",
      form_type: "contract_id",
      name: "合同編號"
    },
    {
      field: "money",
      form_type: "text",
      name: "計劃回款金額"
    },
    {
      field: "return_date",
      form_type: "text",
      name: "計劃回款日期"
    },
    {
      field: "return_type",
      form_type: "text",
      name: "計劃回款方式"
    },
    {
      field: "remind",
      form_type: "text",
      name: "提前幾日提醒"
    },
    {
      field: "remind",
      prop: "remark",
      form_type: "text",
      name: "備註"
    }
  ],
  complaint: [
    {
      field: "complaint_time",
      form_type: "datetime",
      name: "日期及時間"
    },
    {
      field: "customer_name",
      form_type: "text",
      name: "客戶"
    },
    {
      field: "complaint_member",
      form_type: "text",
      name: "投訴人"
    },
    {
      field: "nickname",
      form_type: "text",
      name: "暱稱"
    },
    {
      field: "identity",
      form_type: "text",
      name: "身份"
    },
    {
      field: "telephone",
      form_type: "text",
      name: "電話"
    },
    {
      field: "complaint_type",
      form_type: "select",
      name: "投訴類型",
      setting: ["訂務", "賭場", "其他"]
    },
    {
      field: "complaint_origin",
      form_type: "text",
      name: "投訴來源"
      // setting: ["意見箱", "熱線", "客人面談"]
    },
    {
      field: "receive_employee_id_info",
      form_type: "select",
      name: "接收投訴員工",
      setting: ["lili", "bobo", "guimin"]
    },
    {
      field: "receive_department_id_info",
      form_type: "select",
      name: "接收投訴部門",
      setting: [
        "會計部",
        "中央信貸部",
        "中央採購部",
        "市場拓展部",
        "市場拓展部"
      ]
    },
    {
      field: "receive_location",
      form_type: "text",
      name: "接收投訴地點"
    },
    {
      field: "create_time",
      form_type: "text",
      name: "投訴簡介"
    },
    {
      field: "remark",
      form_type: "text",
      name: "投訴內容"
    },
    {
      field: "complained_employee_id_info",
      form_type: "select",
      name: "被投訴員工",
      setting: ["lili", "bobo", "guimin"]
    },
    {
      field: "complained_department_id_info",
      form_type: "select",
      name: "被投訴部門",
      setting: ["會計部", "中央信貸部", "中央採購部", "市場拓展部", "財務部"]
    },
    {
      field: "complained_location",
      form_type: "text",
      name: "被投訴地點"
    },
    {
      field: "complained_venues",
      form_type: "text",
      name: "被投訴場館",
      setting: ["星際", "撲克王", "威尼斯人"]
    },
    {
      field: "complained_status",
      form_type: "select",
      name: "狀態",
      setting: ["待處理", "已處理"]
    }
  ],
  demand: [
    {
      field: "demand_time",
      form_type: "datetime",
      name: "日期及時間"
    },
    {
      field: "title",
      form_type: "text",
      name: "主題"
    },
    {
      field: "customer_name",
      form_type: "text",
      name: "客戶"
    },
    {
      field: "department_id_info",
      form_type: "select",
      name: "收集部門",
      setting: ["會計部", "中央信貸部", "中央採購部", "市場拓展部", "財務部"]
    },
    {
      field: "follow_member_id_info",
      form_type: "select",
      name: "收集員工",
      setting: ["lili", "bobo", "guimin"]
    },
    {
      field: "demand_type",
      form_type: "text",
      name: "類型"
    },
    {
      field: "demand_subtype",
      form_type: "select",
      name: "副類型",
      setting: ["比賽", "服務", "流程"]
    },
    {
      field: "content",
      form_type: "text",
      name: "內容"
    },
    {
      field: "demand_status",
      form_type: "select",
      name: "狀態",
      setting: ["待處理", "已處理"]
    }
  ],
  opinion: [
    {
      field: "opinion_time",
      form_type: "datetime",
      name: "日期及時間"
    },
    {
      field: "title",
      form_type: "text",
      name: "主題"
    },
    {
      field: "customer_name",
      form_type: "text",
      name: "客戶"
    },
    {
      field: "department_id_info",
      form_type: "select",
      name: "收集部門",
      setting: ["會計部", "中央信貸部", "中央採購部", "市場拓展部", "財務部"]
    },
    {
      field: "follow_member_id_info",
      form_type: "select",
      name: "收集員工",
      setting: ["lili", "bobo", "guimin"]
    },
    {
      field: "opinion_type",
      form_type: "text",
      name: "類型"
    },
    {
      field: "opinion_subtype",
      form_type: "select",
      name: "副類型",
      setting: ["比賽", "服務", "流程"]
    },
    {
      field: "content",
      form_type: "text",
      name: "內容"
    },
    {
      field: "opinion_status",
      form_type: "select",
      name: "狀態",
      setting: ["待處理", "已處理"]
    }
  ]
};
