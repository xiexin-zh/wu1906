<template>
  <div>
    <c-r-m-list-head title="自然人管理"
                     placeholder="請輸入自然人姓名/手機/電話"
                     @on-handle="listHeadHandle"
                     @on-search="crmSearch"
                     main-title="新建自然人"
                     :has-face-id='true'
                     @on-export="exportInfos"
                     :face-id="faceId"
                     :crm-type="crmType">
    </c-r-m-list-head>
    <div v-empty="!crm.contacts.index"
         xs-empty-icon="nopermission"
         xs-empty-text="暫無權限"
         class="crm-container">
      <c-r-m-table-head ref="crmTableHead"
                        :crm-type="crmType"
                        @filter="handleFilter"
                        @handle="handleHandle"
                        @scene="handleScene"></c-r-m-table-head>
      <el-table class="n-table--border"
                id="crm-table"
                v-loading="loading"
                :data="list"
                :height="tableHeight"
                stripe
                border
                highlight-current-row
                style="width: 100%"
                :cell-style="cellStyle"
                @row-click="handleRowClick"
                @header-dragend="handleHeaderDragend"
                @selection-change="handleSelectionChange">
        <el-table-column show-overflow-tooltip
                         type="selection"
                         align="center"
                         width="55">
        </el-table-column>

      <!-- 这是表头以及数据 -->

        <el-table-column v-for="(item, index) in fieldList"
                         :key="index"
                         show-overflow-tooltip
                         :fixed="index==0"
                         :prop="item.prop"
                         :label="item.label"
                         :width="item.width"
                         :formatter="fieldFormatter">
          <template slot="header"
                    slot-scope="scope">
            <div class="table-head-name">{{scope.column.label}}</div>
          </template>

        </el-table-column>


        <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
          :disabled="scope.row.face_open=='0'"
         @click='guiji(scope.row)'
            type="text"
            size="small">
            軌跡
          </el-button>
        </template>
      </el-table-column>

      </el-table>
      <div class="p-contianer">
        <el-pagination class="p-bar"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size.sync="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 相关详情页面 -->
    <c-r-m-all-detail :visible.sync="showDview"
                      :crmType="rowType"
                      :id="rowID"
                      class="d-view">
    </c-r-m-all-detail>
    <fields-set :crmType="crmType"
                @set-success="setSave"
                :dialogVisible.sync="showFieldSet"></fields-set>
  </div>
</template>

<script>
import CRMAllDetail from '@/views/customermanagement/components/CRMAllDetail'
import table from '../mixins/table'

export default {
  /** 客户管理 的 联系人列表 */
  name: 'contactsIndex',
  components: {
    CRMAllDetail
  },
  mixins: [table],
  data() {
    return {
      crmType: 'contacts'
    }
  },
  computed: {
    faceId(){
      return this.$store.state.user.faceID
    }
  },
  watch:{

  },
  mounted() {
  // this.getMessage();
  },
  methods: {
//     getMessage(){
//       window.addEventListener('message',data=>{
//         console.log('收到',data.data);
//       alert(data.data)
//           if(data.data=='go'){

//               window.open(this.$store.state.user.faceServer+'/#/Member/memberRouterList','faceSystem');
//           }
// })
//     },
    //返回人脸系统

    guiji(data){
      if(data.face_id==''){
        this.$message({
              message: "faceId不能為空",
              type: "error"
            });
            return
      }

          // window.opener.postMessage(data.face_id,this.$store.state.user.faceServer+"/#/crm/contacts");
          // window.opener.postMessage(this.$store.state.user.faceServer + '/#/Member/memberRouterList?face_id=' + data.face_id);
          window.open('http://'+data.face_url+'/#/Member/memberRouterList?face_id=' + data.face_id, 'faceSystem');


            // 1( () => {
             // window.open(this.$store.state.user.faceServer+'/#/Member/memberRouterList','faceSystem');
            // }, 5000)




      // if(window.opener){
      //   window.opener.location.href='http://localhost:8080/#/Member/memberRouterList'

      // window.opener.focus();

      // }else{
       // window.open('http://172.21.76.252:8080/#/Member/memberRouterList?face_id='+data.face_id+"#/Member/memberRouterList");
      // }

    },
    /** 通过回调控制style */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'name' || column.property === 'customer_id') {
        return { color: '#005DF7', cursor: 'pointer' }
      } else {
        return ''
      }
    }

  },
  beforeRouteLeave(to,from,next){

this.$store.commit('setFaceId', '')
next()
  }

}
</script>

<style lang="scss" scoped>
@import '../styles/table.scss';
</style>
