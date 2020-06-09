<template>
  <div class="memberInfo">
    <div class="box_content">
      <div class="box_box">
        <div class="header">
          <div class="btn_tag">
            <el-button @click="openDialogVisible" class="add">
              <i class="icon-add"></i>
              添加预约信息
            </el-button>
          </div>
          <HeadSearch :selectChange="selectChange" :options="options" :clickSerchBtn="clickSerch" />
        </div>
        <div class="content">
          <el-table :data="userlist" border style="width: 100%">
            <el-table-column align="center" prop="ro_id" label="编号"></el-table-column>
            <el-table-column align="center" prop="realname" label="姓名"></el-table-column>
            <el-table-column align="center" prop="mobile" label="手机号"></el-table-column>
            <el-table-column align="center" prop="idcardno" label="证件号码"></el-table-column>
            <el-table-column align="center" prop="ro_peoplenum" label="同行人数"></el-table-column>
            <el-table-column align="center" prop="ro_tripmode" label="出行方式">
              <template slot-scope="scope">
                <span v-if="scope.row.ro_tripmode == 10">公共交通</span>
                <span v-if="scope.row.ro_tripmode == 20">自驾</span>
                <span v-if="scope.row.ro_tripmode == 30">其他</span>
              </template>
            </el-table-column>
            <el-table-column :formatter="formatTime" align="center" prop="ro_time" label="祭扫日期"></el-table-column>
            <el-table-column align="center" prop="ro_timeframe" label="祭扫时段"></el-table-column>
            <el-table-column align="center" prop="ro_no" label="受理编号"></el-table-column>
            <el-table-column :formatter="formatOrgan" align="center" prop="organ_name" label="预约机构"></el-table-column>
            <el-table-column align="center" prop="ro_state" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.ro_state == 0" style="color:black;">已预约</span>
                <span v-if="scope.row.ro_state == 1" style="color:red;">已取消</span>
              </template>
            </el-table-column>
            <el-table-column width="240" align="center" label="操作">
              <template v-slot="{ row }">
                <el-button class="commonBtn" title="查看" type="primary" @click="handleView(row)">查看</el-button>
                <el-button class="commonBtn" title="编辑" type="primary" @click="handleEdit(row)">编辑</el-button>
                <el-button class="commonBtn" title="删除" type="danger" @click="handleDel(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="footer">
          <el-pagination
            @current-change="handleSizeChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="listCount"
          ></el-pagination>
        </div>
      </div>
    </div>
    <template>
      <el-dialog
        @close="closeDialog"
        :title="isedit?'编辑信息':'添加信息'"
        :visible.sync="dialogVisible"
        width="40%"
      >
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left"
        >
          <el-form-item label="姓名" prop="realname">
            <el-input v-model="ruleForm.realname"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="证件类型" prop="card_type">
            <el-select v-model="ruleForm.card_type" placeholder="请选择">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码" prop="idcardno">
            <el-input v-model="ruleForm.idcardno"></el-input>
          </el-form-item>
          <el-form-item label="预约公墓" prop="organ">
            <el-select v-model="ruleForm.organ" placeholder="请选择">
              <el-option
                v-for="item in cemeterysList"
                :key="item.og_id"
                :label="item.og_name"
                :value="item.og_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出行方式" prop="tripmode">
            <el-select v-model="ruleForm.tripmode" placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="祭扫日期" prop="time">
            <el-col :span="24">
              <el-date-picker v-model="ruleForm.time" type="date" placeholder="选择日期"></el-date-picker>
            </el-col>
          </el-form-item>

          <el-form
            :inline="true"
            status-icon
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
            label-position="left"
          >
            <el-form-item label="祭扫时段" prop="startTime">
              <el-time-select
                placeholder="请选择开始时间"
                v-model="ruleForm.startTime"
                :picker-options="{
                step: '00:15',
                 maxTime:ruleForm.endTime
                        }"
              ></el-time-select>
            </el-form-item>
            <span style="margin-right:10px">至</span>
            <el-form-item>
              <el-time-select
                placeholder="请选择结束时间"
                v-model="ruleForm.endTime"
                :picker-options="{
                step: '00:15',
                minTime:ruleForm.startTime
            }"
              ></el-time-select>
            </el-form-item>
          </el-form>

          <el-form-item label-width="123" label="是否为居家隔离人员" prop="is_isolation">
            <el-radio v-model="ruleForm.is_isolation" label="1">是</el-radio>
            <el-radio v-model="ruleForm.is_isolation" label="0">否</el-radio>
          </el-form-item>

          <el-form-item label="同行人数" prop="peoplenum">
            <el-select v-model="ruleForm.peoplenum" placeholder="请选择同行人数">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
              <el-option label="3" value="3"></el-option>
            </el-select>
          </el-form-item>

          <template v-if="ruleForm.peoplenum==2||ruleForm.peoplenum==3">
            <p>同行人员信息:</p>
            <p>同行1:</p>
            <el-form-item label="姓名" prop="name1">
              <el-input v-model="ruleForm.name1"></el-input>
            </el-form-item>
            <el-form-item label="证件类型" prop="card_type1">
              <el-select v-model="ruleForm.card_type1" placeholder="请选择">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号码" prop="idno1">
              <el-input v-model="ruleForm.idno1"></el-input>
            </el-form-item>
            <el-form-item label="出行方式" prop="tripmode1">
              <el-select v-model="ruleForm.tripmode1" placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label-width="123" label="是否为居家隔离人员" prop="isolation1">
              <el-radio v-model="ruleForm.isolation1" label="1">是</el-radio>
              <el-radio v-model="ruleForm.isolation1" label="0">否</el-radio>
            </el-form-item>

            <template v-if="ruleForm.peoplenum==3">
              <p>同行2:</p>
              <el-form-item label="姓名" prop="name2">
                <el-input v-model="ruleForm.name2"></el-input>
              </el-form-item>
              <el-form-item label="证件类型" prop="card_type2">
                <el-select v-model="ruleForm.card_type2" placeholder="请选择">
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="证件号码" prop="idno2">
                <el-input v-model="ruleForm.idno2"></el-input>
              </el-form-item>
              <el-form-item label="出行方式" prop="tripmode2">
                <el-select v-model="ruleForm.tripmode2" placeholder="请选择">
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="123" label="是否为居家隔离人员" prop="isolation2">
                <el-radio v-model="ruleForm.isolation2" label="1">是</el-radio>
                <el-radio v-model="ruleForm.isolation2" label="0">否</el-radio>
              </el-form-item>
            </template>
          </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
    </template>
    <!-- 查看信息 -->
    <el-dialog title="查看信息" v-if="userItem" :visible.sync="dialogVisible1" width="679px">
      <div class="userinfo">
        <el-row :gutter="20">
          <el-col :span="4">
            <span class="textLayout">姓名</span>
          </el-col>
          <el-col :span="20">
            <div class="inputLayout">{{userItem.realname}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <span class="textLayout">手机号</span>
          </el-col>
          <el-col :span="20">
            <div class="inputLayout">{{userItem.mobile}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <span class="textLayout">证件类型</span>
          </el-col>
          <el-col :span="20">
            <div class="inputLayout">{{userItem.card_type|cardtype}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <span class="textLayout">证件号码</span>
          </el-col>
          <el-col :span="20">
            <div class="inputLayout">{{userItem.idcardno}}</div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="4">
            <span class="textLayout">预约公墓</span>
          </el-col>
          <el-col :span="20">
            <div class="inputLayout">{{userItem.organ_name}}</div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="4">
            <span class="textLayout">出行方式</span>
          </el-col>
          <el-col :span="20">
            <div class="inputLayout">{{userItem.ro_tripmode | tripmode}}</div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="4">
            <span class="textLayout">祭扫日期</span>
          </el-col>
          <el-col :span="20">
            <div class="inputLayout">2020-04-07</div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <span class="textLayout">祭扫时段</span>
          </el-col>
          <el-col :span="9">
            <div class="inputLayout">
              <i class="el-icon-time"></i>
              {{userItem.ro_timeframe}}
            </div>
          </el-col>
          <el-col :span="2">
            <div style="text-align:center;line-height:42px">至</div>
          </el-col>
          <el-col :span="9">
            <div class="inputLayout">
              <i class="el-icon-time"></i>
              {{userItem.ro_timeframe}}
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="6">
            <span class="textLayout">是否为居家隔离人员</span>
          </el-col>
          <el-col :span="18">
            <div class="inputLayout">{{userItem.is_isolation|isolation}}</div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="4">
            <span class="textLayout">同行人数</span>
          </el-col>
          <el-col :span="20">
            <div class="inputLayout">{{userItem.ro_peoplenum}}</div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="4">
            <span class="textLayout">受理编号</span>
          </el-col>
          <el-col :span="20">
            <div class="inputLayout">{{userItem.ro_no}}</div>
          </el-col>
        </el-row>

        <template v-if="userItem.ro_peoplenum>=2">
          <el-row>
            <el-col :span="24">
              <span class="textLayout">同行人员信息:</span>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="4">
              <span class="textLayout">姓名</span>
            </el-col>
            <el-col :span="20">
              <div class="inputLayout">{{userItem.ro_name1}}</div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="4">
              <span class="textLayout">证件类型</span>
            </el-col>
            <el-col :span="20">
              <div class="inputLayout">{{userItem.card_type1}}</div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="4">
              <span class="textLayout">证件号码</span>
            </el-col>
            <el-col :span="20">
              <div class="inputLayout">{{userItem.ro_idno1}}</div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="4">
              <span class="textLayout">出行方式</span>
            </el-col>
            <el-col :span="20">
              <div class="inputLayout">{{userItem.ro_tripmode1|tripmode}}</div>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="6">
              <span class="textLayout">是否为居家隔离人员</span>
            </el-col>
            <el-col :span="18">
              <div class="inputLayout">{{userItem.is_isolation1|isolation}}</div>
            </el-col>
          </el-row>

          <template v-if="userItem.ro_peoplenum==3">
            <el-row>
              <el-col :span="24">
                <span class="textLayout">同行2:</span>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="4">
                <span class="textLayout">姓名</span>
              </el-col>
              <el-col :span="20">
                <div class="inputLayout">{{userItem.ro_name2}}</div>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="4">
                <span class="textLayout">证件类型</span>
              </el-col>
              <el-col :span="20">
                <div class="inputLayout">{{userItem.card_type2|cardtype}}</div>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="4">
                <span class="textLayout">证件号码</span>
              </el-col>
              <el-col :span="20">
                <div class="inputLayout">{{userItem.ro_idno2}}</div>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="4">
                <span class="textLayout">出行方式</span>
              </el-col>
              <el-col :span="20">
                <div class="inputLayout">{{userItem.ro_tripmode2|tripmode}}</div>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="6">
                <span class="textLayout">是否为居家隔离人员</span>
              </el-col>
              <el-col :span="18">
                <div class="inputLayout">{{userItem.is_isolation1|isolation}}</div>
              </el-col>
            </el-row>
          </template>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeadSearch from "@/components/HeadSearch.vue";

import {
  getaPhoneList,
  editTel,
  getCemeterys,
  delTel
} from "../../api/phoneAppointment";
import { format, regTel, regIdCard, regName } from "../../utils/transform";
const options1 = [
  {
    value: "10",
    label: "公共交通"
  },
  {
    value: "20",
    label: "自驾"
  },
  {
    value: "30",
    label: "其他"
  }
];
const options2 = [
  {
    value: "10",
    label: "内地居民身份证"
  },
  {
    value: "20",
    label: "香港居民身份证"
  },
  {
    value: "30",
    label: "澳门居民身份证"
  },
  {
    value: "40",
    label: "台湾居民身份证"
  },
  {
    value: "50",
    label: "护照"
  },
  {
    value: "60",
    label: "军官证"
  },
  {
    value: "70",
    label: "士兵证"
  },
  {
    value: "80",
    label: "护照"
  }
];
const initruleForm = () => {
  return {
    realname: "",
    card_type: "",
    idcardno: "",
    mobile: "",
    is_isolation: "",
    organ: "",
    time: "",
    startTime: "",
    endTime: "",
    timeframe: "",
    tripmode: "",
    peoplenum: "1",
    name1: "",
    card_type1: "",
    idno1: "",
    tripmode1: "",
    isolation1: "",
    name2: "",
    card_type2: "",
    idno2: "",
    tripmode2: "",
    isolation2: ""
  };
};
export default {
  data() {
    let resMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("号码不能为空"));
      } else if (!regTel(value)) {
        return callback(new Error("请填写正确的号码"));
      } else {
        callback();
      }
    };
    let reIdcardno = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("号码不能为空"));
      } else if (!regIdCard(value)) {
        return callback(new Error("请填写正确的号码"));
      } else {
        callback();
      }
    };
    let reNames = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("名字不能为空"));
      } else if (!regName(value)) {
        return callback(new Error("请填写正确的名字"));
      } else {
        callback();
      }
    };
    let resDate = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择时间段"));
      } else if (!this.ruleForm.endTime) {
        return callback(new Error("请选择结束时间"));
      } else {
        callback();
      }
    };
    return {
      options: [
        {
          value: "10",
          label: "姓名"
        },
        {
          value: "20",
          label: "身份证号"
        },
        {
          value: "30",
          label: "手机号"
        }
      ],
      options1: [
        {
          value: "10",
          label: "公共交通"
        },
        {
          value: "20",
          label: "自驾"
        },
        {
          value: "30",
          label: "其他"
        }
      ],
      options2: [
        {
          value: "10",
          label: "内地居民身份证"
        },
        {
          value: "20",
          label: "香港居民身份证"
        },
        {
          value: "30",
          label: "澳门居民身份证"
        },
        {
          value: "40",
          label: "台湾居民身份证"
        },
        {
          value: "50",
          label: "护照"
        },
        {
          value: "60",
          label: "军官证"
        },
        {
          value: "70",
          label: "士兵证"
        },
        {
          value: "80",
          label: "护照"
        }
      ],
      userItem: "",
      dialogVisible1: false,
      isedit: false,
      radio: "1",
      type1: "",
      ruleForm: initruleForm(),
      deadline: "",
      serchinput: "",
      listCount: 0,
      pageSize: 10,
      currentPage: 1,
      value: "",
      dialogVisible: false,
      userlist: [],
      limit: 10,
      cemeterysList: [],
      orderId: "",
      rules: {
        realname: [
          { required: true, message: "请输入名字", trigger: "blur" },
          { validator: reNames, trigger: "blur" }
        ],
        idcardno: [
          { required: true, message: "请输入号码", trigger: "blur" },
          {
            validator: reIdcardno,
            trigger: "blur"
          }
        ],
        card_type: [
          { required: true, message: "请选择证件类型", trigger: "change" }
        ],
        mobile: [
          { required: true, message: "请输入号码", trigger: "blur" },
          { validator: resMobile, trigger: "blur" }
        ],
        organ: [
          { required: true, message: "请选择公墓机构", trigger: "change" }
        ],
        tripmode: [
          { required: true, message: "请选择出行方式", trigger: "change" }
        ],
        timeframe: [{ required: true, message: "日期", trigger: "blur" }],
        time: [{ required: true, message: "请选择日期", trigger: "change" }],
        is_isolation: [
          { required: true, message: "请选择是否隔离", trigger: "change" }
        ],
        startTime: [
          { required: true, message: "请选择时间段", trigger: "change" },
          { validator: resDate, trigger: "blur" }
        ],
        name1: [
          { required: true, message: "请输入名字", trigger: "blur" },
          { validator: reNames, trigger: "blur" }
        ],
        idno1: [
          { required: true, message: "请输入号码", trigger: "blur" },
          {
            validator: reIdcardno,
            trigger: "blur"
          }
        ],
        card_type1: [
          { required: true, message: "请选择证件类型", trigger: "change" }
        ],
        tripmode1: [
          { required: true, message: "请选择出行方式", trigger: "change" }
        ],
        isolation1: [
          { required: true, message: "请选择是否隔离", trigger: "change" }
        ],
        idno2: [
          { required: true, message: "请输入号码", trigger: "blur" },
          {
            validator: reIdcardno,
            trigger: "blur"
          }
        ],
        card_type2: [
          { required: true, message: "请选择证件类型", trigger: "change" }
        ],
        tripmode2: [
          { required: true, message: "请选择出行方式", trigger: "change" }
        ],
        isolation2: [
          { required: true, message: "请选择是否隔离", trigger: "change" }
        ]
      }
      // timeForm: {
      //   startTime: "",
      //   endTime: ""
      // }
    };
  },
  components: {
    HeadSearch
  },
  filters: {
    tripmode: function(value) {
      if (!value) return "";
      const result = options1.filter(item => {
        return item.value == value;
      });
      return result[0].label;
    },
    cardtype: function(value) {
      if (!value) return "";
      const result = options2.filter(item => {
        return item.value == value;
      });
      return result[0].label;
    },
    isolation: function(value) {
      if (!value) return "";
      return value == 0 ? "否" : "是";
    }
  },
  methods: {
    async memberList(offset, limit) {
      const res = await getaPhoneList({
        type: this.value,
        keyword: this.serchinput,
        offset,
        limit
      });
      console.log(res);
      if (res.error == 0) {
        (this.userlist = res.data.list), (this.listCount = res.data.total);
      } else {
        this.$message.error(res.msg);
      }
    },
    async getCemeterysList() {
      const res = await getCemeterys();
      if (res.error == 0) {
        this.cemeterysList = res.data;
      }
    },
    openDialogVisible() {
      this.isedit = false;
      this.ruleForm = initruleForm();
      this.dialogVisible = true;
    },
    clickSerch(val) {
      this.serchinput = val;
      this.memberList(0, this.limit);
    },
    selectChange(val) {
      this.value = val;
    },
    formatTime(row) {
      return format(parseInt(row.ro_time));
    },
    formatOrgan(row) {
      const data = this.cemeterysList.filter(item => {
        return row.ro_organ == item.og_id;
      });
      if (data.length == 0) {
        return;
      }
      return data[0].og_name;
    },
    handleEdit(val) {
      if (!val) {
        return;
      }
      this.isedit = true;
      this.dialogVisible = true;
      const {
        ro_id,
        realname,
        card_type,
        idcardno,
        mobile,
        is_isolation,
        ro_organ
      } = val;
      const date = val.ro_timeframe.split("~");
      this.ruleForm = {
        orderId: ro_id,
        realname,
        card_type,
        idcardno,
        mobile,
        is_isolation,
        organ: ro_organ,
        time: format(parseInt(val.ro_time)),
        startTime: date[0],
        endTime: date[1],
        tripmode: val.ro_tripmode,
        peoplenum: val.ro_peoplenum,
        name1: val.ro_name1,
        idno1: val.ro_idno1,
        tripmode1: val.ro_tripmode1,
        isolation1: val.is_isolation1,
        name2: val.ro_name2,
        idno2: val.ro_idno2,
        tripmode2: val.ro_tripmode2,
        isolation2: val.is_isolation2
      };
      this.orderId = ro_id;
    },
    handleDel(val) {
      this.$confirm("删除预约吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delTel({
            orderId: val.ro_id
          }).then(res => {
            if (res.error == 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.memberList(0, this.limit);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });

      console.log(val);
    },
    handleView(val) {
      this.dialogVisible1 = true;
      const name = this.cemeterysList.filter(item => {
        return val.ro_organ == item.og_id;
      })[0]["og_name"];
      this.userItem = { ...val, organ_name: name };
    },

    closeDialog() {
      this.ruleForm = initruleForm();
      this.$refs["ruleForm"].resetFields();
    },
    getorder() {
      const data = this.cemeterysList.filter(item => {
        return item.og_id == this.userItem.ro_organ;
      })[0]["og_name"];
      return data;
    },
    // 提交表单
    submitForm() {
      this.$refs["ruleForm"].validate(validate => {
        if (validate) {
          if (this.ruleForm.startTime == "" || this.ruleForm.endTime == "") {
            this.$message("请设置时间");
            return;
          }
          const area = this.cemeterysList.filter(item => {
            return item.og_id == this.ruleForm.organ;
          })[0]["area_id"];
          editTel({
            ...this.ruleForm,
            timeframe: this.ruleForm.startTime + "~" + this.ruleForm.endTime,
            time: new Date(this.ruleForm.time).getTime(),
            orderId: this.isedit ? this.orderId : 0,
            area
          }).then(res => {
            if (res.error == 0) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.memberList(0, this.limit);
              this.dialogVisible = false;
            } else {
              this.$message(res.msg);
            }
          });
        } else {
          this.$message("请填写信息");
        }
      });
    },
    handleSizeChange(val) {
      this.memberList((val - 1) * this.pageSize, this.pageSize);
    }
  },
  mounted() {
    this.memberList(0, this.limit);
    this.getCemeterysList();
  }
};
</script>

<style scoped lang="less">
.memberInfo {
  width: 100%;
  flex: 1;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .btn_tag {
    .add {
      background-color: #445c73;
      color: white;
      .icon-add {
        background: url("../../assets/add.png");
        height: 12px;
        width: 12px;
        display: inline-block;
      }
    }
  }
}
.content {
  margin-top: 20px;
}
.footer {
  text-align: center;
}
.userinfo {
  .inputLayout,
  .textLayout {
    height: 40px;
    line-height: 40px;
  }
  .inputLayout {
    border: 1px solid rgba(0, 0, 0, 0.14);
    border-radius: 4px;
    padding-left: 24px;
  }
}

.el-row {
  margin-bottom: 16px;
}
</style>
