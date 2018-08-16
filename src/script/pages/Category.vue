<template>
    <div class="clearfix">
        <div class="cancle"><el-button type="primary" size="small" @click="cancelChoose">取消选择</el-button></div>
        <div class="grid-content bg-purple left">
            <ul>
                <li v-for="(category, index) in categories" @mouseover="hover(index)" :key="index">
                    <a href="javascript:" @click="choose_parent_category(index)">{{ category.name }}({{ category.zhName
                        }})</a>
                </li>
            </ul>
        </div>
        <div class="grid-content bg-purple-light left" id="secondSelect">
            <p class="li-grid">
                <a href="javascript:" @click="choose_category(index)" v-for="(category, index) in children" :key="index">{{
                    category.name }}({{ category.zhName }})</a>
            </p>
        </div>
    </div>
</template>
<style lang="less" scoped>
.cancle{margin-bottom:20px;}
.bg-purple {
    ul {
        li {
            line-height: 30px;
            height: 30px;
            padding: 0 10px;
            background-color: #0085D7;
            a{
                color: #fff;
            }
        }
        li:hover {
            background-color: #20a0ff;
            cursor: pointer;
        }
    }
}
.bg-purple-light {
    border: 2px solid #0085D7;
    box-shadow: 2px 2px 0 #dcdadb;
    p {
        padding: 10px 20px;
        line-height: 26px;
        margin-bottom: 22px;
        width: 800px;
        a {
            display: inline-block;
            color: #666;
            padding: 0 10px;
            word-break: keep-all;
        }
        a:hover {
            color: #20a0ff;
        }
    }
}
</style>
<script>
export default {
    data() {
        return {
            categories: [],
            children: []
        }
    },
    created: function () {
        this.$http.get('/api/category/tree', []).then(function (response) {
            this.categories = response.data.data;
            this.hover(0);
        }, function (error) {
            console.log(error);
        });
    },
    methods: {
        hover: function (index) {
            this.children = this.categories[index].children;
        },
        choose_category: function (index) {
            this.$parent.showPopper = false; // 上一层是Popper, 隐藏掉
            this.$parent.$emit('onCategorySelected', this.children[index]);
        },
        choose_parent_category: function (index) {
            this.$parent.showPopper = false; // 上一层是Popper, 隐藏掉
            this.$parent.$emit('onCategorySelected', this.categories[index]);
        },
        cancelChoose: function () {
            this.$parent.showPopper = false; // 上一层是Popper, 隐藏掉
            this.$parent.$emit('onCategorySelected', {});
        }
    }
}
</script>
