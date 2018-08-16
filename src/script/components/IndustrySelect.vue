<template>
    <div>
        <div class="row clearfix">
            <div class="left searchItem">
                <span class="red">商品分类：</span>
                <label for="">一级分类：</label>
                <el-select v-model="selectedFirstTree" style="margin-right: 10px;">
                    <el-option  key="" label="请选择" value=""></el-option>
                    <el-option v-for="item in firstTree"  :key="item.pid" :label="item.zhName" :value="item.pid">
                    </el-option>
                </el-select>
            </div>
            <div class="left searchItem">
                <label for="">二级分类：</label>
                <el-select v-model="selectedSecondTree" style="margin-right: 10px;">
                    <el-option  key="" label="请选择" value=""></el-option>
                    <el-option v-for="item in secondTree"  :key="item.pid" :label="item.zhName" :value="item.pid">
                    </el-option>
                </el-select>
            </div>
            <div class="left searchItem">
                <label for="">最终分类：</label>
                <el-select v-model="selectedLastTree" style="margin-right: 10px;">
                    <el-option  key="" label="请选择" value=""></el-option>
                    <el-option v-for="item in lastTree"  :key="item.pid" :label="item.zhName" :value="item.pid">
                    </el-option>
                </el-select>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    export default {
        data() {
            return {
                firstTree: [],
                secondTree: [],
                lastTree: [],
                selectedFirstTree: "",
                selectedSecondTree: "",
                selectedLastTree: "",
            }
        },
        watch: {
            selectedFirstTree(newVal, oldval) {
                this.secondTree = this.firstTree.filter(item => {if(item.pid === newVal) {return true}})[0].children;
                let that = this;
                Vue.nextTick(() => {
                    that.selectedSecondTree = ""
                    that.selectedLastTree = "";
                    that.lastTree = [];
                });
                this.sendMsgToParent();
            },
            selectedSecondTree(newVal, oldval) {
                if(newVal != '') {
                    this.lastTree = this.secondTree.filter(item => {if(item.pid === newVal) {return true}})[0].children;
                    let that = this;
                    Vue.nextTick(() => {
                        that.selectedLastTree = "";
                    })
                    this.sendMsgToParent();                    
                }
            },
            selectedLastTree(newVal, oldval) {
                this.sendMsgToParent();
            }
        },
        computed: {
            info() {
                return {
                    firstIndustry: this.selectedFirstTree,
                    secondIndustry: this.selectedSecondTree,
                    thirdIndustry: this.selectedLastTree
                }
            }
        },
        methods: {
            getCategoryTree: function () {
                this.$http.get('api/category/multilevel').then(function(response) {
                    this.firstTree = response.data.data;
                    this.selectedFirstTree = this.firstTree[0].pid;
                    this.secondTree = this.firstTree[0].children;
                    this.selectedSecondTree = "";
                    this.lastTree = this.secondTree[0].children;
                    this.selectedLastTree = "";
                    this.sendMsgToParent();
                }, function(error) {
                    console.log(error);
                });
            },
            sendMsgToParent: function() {
                let pid = this.selectedLastTree;
                if(this.selectedLastTree === '') {
                    pid = this.selectedSecondTree;
                }
                if(this.selectedSecondTree === '') {
                    pid = this.selectedFirstTree;
                }
                this.$emit('industryPid',pid);
            }
        },
        mounted() {
            this.getCategoryTree();
        }
    }
</script>
<style>

</style>
