<template>
  <div class="cemeteryManage">
    <div class="box_content">
      <div class="box_box">
        <div class="header">
          <div class="btn_tag">
            <el-button @click="clickDialog" class="add">
              <i class="icon-add"></i>
              添加
            </el-button>
            <el-button class="treeShow" @click="treeListClick" v-if="treeList">树形展示</el-button>
            <el-button class="treeShow" @click="treeListClick" v-if="!treeList">表格展示</el-button>
          </div>
          <HeadSearch :selectChange="selectChange" :clickSerchBtn="clickSerch" :options='optionsList' v-if="treeList"/>
          <HeadSearch :selectChange="selectChange" :clickSerchBtn="clickSerchData" :options='optionsList' v-if="!treeList"/>
        </div>
        <div class="content" v-if="treeList">
          <el-table :data="arealist" border style="width: 100%">
            <el-table-column align="center" prop="og_id" label="编号"></el-table-column>
            <el-table-column align="center" prop="area_name" label="地区"></el-table-column>
            <el-table-column align="center" prop="og_name" label="扫墓点名称"></el-table-column>
            <el-table-column align="center" prop="og_tel" label="电话"></el-table-column>
            <el-table-column align="center" label="操作">
               <template slot-scope="scope">
                 <el-button @click="handleClick(scope.row)" class="compile">编辑</el-button>
                 <el-button class="delete" @click="deleteClick(scope.row)">删除</el-button>
               </template>
            </el-table-column>
          </el-table>
          <div class="pagination-floor">
                <el-pagination
                  @current-change="handleSizeChange"
                  :current-page.sync="currentPage"
                  :page-size="pageSize" 
                  layout="prev, pager, next, jumper"
                  :total="listCount"
                ></el-pagination>
          </div>
        </div>
         <div class="content" v-if="!treeList">
           <div class="content-list" style="float:left;width:20%;border: 1px solid #ccc;text-align:certer;">
             <p class='content-p'>地区列表</p>
               <div 
               style="width:100%;text-align:center;padding:10px 0"
               :class="numlist == index?'content_li':''"
               v-for="(item, index) in settingList"
                :key="index" 
                @click="treeClick(item,index)" >
                {{ item.ra_area }}
                
              </div>
           </div>
           <div class="content-table" style="float:right;width: 75%">
             <el-table :data="areaData" border style="width: 100%">
               <el-table-column align="center" prop="og_id" label="编号"></el-table-column>
               <el-table-column align="center" prop="area_name" label="地区"></el-table-column>
               <el-table-column align="center" prop="og_name" label="扫墓点名称"></el-table-column>
               <el-table-column align="center" prop="og_tel" label="电话"></el-table-column>
               <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" class="compile">编辑</el-button>
                    <el-button class="delete" @click="deleteClick(scope.row)">删除</el-button>
                  </template>
               </el-table-column>
             </el-table>
           </div>
          
        </div>
      </div>
    </div>

    <template>
      <el-dialog title="添加" :visible.sync="dialogVisible" width="30%">
        <el-form
          :model="ruleForm"
          status-icons
          :rules="ruleForms"
          ref="ruleFor"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left"
        >
        <el-form-item label="地区" prop="address">
            <el-select v-model="ruleForm.address" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.ra_id"
                :label="item.ra_area"
                :value="item.ra_area">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公墓名称" prop="name">
            <el-input  v-model="ruleForm.name" ></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="tel">
            <el-input v-model.number="ruleForm.tel"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('1')" v-if="flag=='1'">确 定</el-button>
          <el-button type="primary" @click="submitForm('2')" v-if="flag=='2'">确 定</el-button>
        </span>
      </el-dialog>
    </template>
    
  </div>
</template>

<script>
import HeadSearch from "@/components/HeadSearch.vue";
import { settingGlist,getCemeterys ,editCemetery,delCemetery} from "@/api/reserve.js";
// import { regTel } from "../../utils/transform.js"
export default {
  data() {
    let validcodeName=(rule,value,callback)=>{
    let reg=/^1[3|4|5|7|8][0-9]\d{8}$/
    if(!reg.test(value)){callback(new Error('请填写正确的电话号码！'))
        }else{
        callback()
        }
    };
    return {
      serchinputList:"",
      areaData:[],
      area_Ids:"",
      flagName:'',
      numlist:'',
      settingList:[],
      treeList: true,
      storageList:{},
      flag:'',
      listCount:0,
      currentPage: 1,
      pageSize: 10,
      serchinput:"",
      area_Id:"",
      arealist: [],
      dialogVisible: false,
      ruleForms: {
        name: [
            { required: true, message: '公墓名称', trigger: 'blur' },
            { min: 4,  message: '公墓名称不得少于四个字', trigger: 'blur' }
          ],
        address: [
          { required: true, message: '请选择公墓区域', trigger: 'change' }
        ],
        tel: [
          { required: true,  trigger: 'blur' ,validator: validcodeName},
        ]
      },
      ruleForm: {
        name: '',
        address:"",
        tel:""
      },
      options:[],
      optionsList: [
        { id:'1',value:'公墓名称'},
      ]
    };
  },
  watch:{
    areaData: function(newData,oldData){
      console.log(newData,oldData);
    }
  },
  components: {
    HeadSearch
  },
  mounted(){
    this.getGlist(0,this.pageSize);
    this.treeListData(0,this.pageSize);
    this.addSubmitForm();
  },
  methods: {
    handleSizeChange(val){
        this.treeListData((val-1)*this.pageSize,this.pageSize);
    },
    selectChange(val){
        this.flagName = val;
    },
    treeClick(item,index){
      this.numlist = index;
      this.area_Ids = item.ra_id;
      this.treeListData(0,this.pageSize);
    },
    async treeListData(offset, limit){
      const res = await settingGlist({
        areaId:this.area_Ids,
        keyword: this.serchinputList,
        offset,
        limit
      })
      if (res.error == 0) {
        this.areaData = res.data.list;
      } else {
        this.$message.error(res.msg);
      }
    },
    treeListClick(){
      this.treeList = !this.treeList;
      this.area_Ids = '1';
      this.treeListData(0,this.pageSize);
      this.addSubmitForm();
    },
    async getGlist(offset, limit) {
      const res = await settingGlist({
        areaId:this.area_Id,
        keyword: this.serchinput,
        offset,
        limit
      });
      if (res.error == 0) {
        this.arealist = res.data.list;
        this.listCount = res.data.total_page;
      } else {
        this.$message.error(res.msg);
      }
    },
    handleClick(data){
      this.flag = '2';
      this.storageList = data;
      this.ruleForm.name = data.og_name;
      this.ruleForm.tel = data.og_tel;
      this.ruleForm.address = data.area_name;
      this.addSubmitForm();
      this.dialogVisible = true;
    },
    async deleteClick(data){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           delCemetery({
             orgId:data.og_id
          }).then(()=>{
            this.getGlist(0,this.pageSize);
          this.$message("删除成功");
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

      console.log(data.og_id);
      
    },
    clickSerch(data) {
        console.log(data);
        this.serchinput = data;
        this.getGlist(0,this.pageSize);
    },
    clickSerchData(data){
      this.serchinputList = data;
      this.treeListData(0,this.pageSize);
    },
    async submitForm() {
      this.options.forEach(element=>{
        if(element.ra_area == this.ruleForm.address){
          this.ruleForm.address = element.ra_id;
          }
      })
      if(this.flag == '1'){
      const res = await editCemetery({
        name:this.ruleForm.name,
        address: "",
        area_id: this.ruleForm.address,
        tel:this.ruleForm.tel,
        orgId: '0'
      });
      if (res.error == 0) {
        this.$message("添加成功");
        this.dialogVisible = false;
        this.getGlist(0,this.pageSize);
      } else {
        this.$message('请填写完整信息');
      }
      }else if(this.flag=='2'){
        const res = await editCemetery({
        name:this.ruleForm.name,
        address: "",
        area_id: this.ruleForm.address,
        tel:this.ruleForm.tel,
        orgId: this.storageList.og_id
      });
      if (res.error == 0) {
        this.$message("编辑成功");
        this.dialogVisible = false;
        this.getGlist(0,this.pageSize);
        this.ruleForm = {}
      } else {
        this.$message('请填写完整信息');
      }
      }
      // 
    },
    clickDialog(){
      this.flag = '1';
      this.dialogVisible = true;
      this.ruleForm = {};
      this.addSubmitForm();
    },
    async addSubmitForm(){
      const res = await getCemeterys({});
      if (res.error == 0) {
        this.options = res.data;
        this.settingList = res.data;
      } else {
        this.$message.error(res.msg);
      }
    }
  }
};
</script>

<style scoped lang="less">
.pagination-floor {
  float: right;
  margin: 10px 10px;
}
.content-p {
  display:inline-block;
  width:100%;
  text-align: center;
  padding: 20px 0;
}
#content_li {
  display:inline-block;
  width:100%;
  text-align: center;
  padding: 10px 0;
}
.content_li {
  background: #608EB6 ;
  z-index: 999;
}
#content_li:hover {
  background: #608EB6 ;
  z-index: 999;
}
.el-select {
  width: 100%;
}
.compile {
  color: #fff;
  background-color: #4A90E2;
}
.delete {
  color: #fff;
  background-color: #DD6162;
}
.cemeteryManage {
  flex: 1;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 17px;
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
    .treeShow,
    .add {
      width: 108px;
      height: 40px;
    }
  }
}
</style>
