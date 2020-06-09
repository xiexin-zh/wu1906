/**
 * current_state 字段
 * 可領取 ：can
 * 已領取 ：already
 * 處理中 ：for
 *
 */

export const shoppingRecordTableContentList = [
  {
    customer_id: "1",
    name: "(AA) 001组1117 陈某",
    recent_shopping: "2019-10-01 19:36:19",
    purchase_items: "絕對伏特加 + 10",
    current_venue: "星際",
    current_state: "can",
    other_received: 2,
    other_unclaimed: 1
  },
  {
    customer_id: "2",
    name: "(AA) 001组1117 王某",
    recent_shopping: "2019-10-18 18:26:16",
    purchase_items: "絕對伏特加 + 10",
    current_venue: "星際",
    current_state: "already",
    other_received: 2,
    other_unclaimed: 1
  },
  {
    customer_id: "3",
    name: "(AA) 001组1117 黄某",
    recent_shopping: "2019-10-26 20:17:03",
    purchase_items: "絕對伏特加 + 10",
    current_venue: "星際",
    current_state: "for",
    other_received: 2,
    other_unclaimed: 1
  }
];
