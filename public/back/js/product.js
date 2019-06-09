$(function(){
   //1. 一进入页面就发送ajax请求 获取数据 通过模板引擎渲染
   var currentPage = 1;
   var pageSize = 5;

   render();
   function render(){
       $.ajax({
           type:"get",
           url:"/product/queryProductDetailList",
           data:{
               page:currentPage,
               pageSize:pageSize
           },
           dataType:"json",
           success:function(info){
               // console.log(info);
               var htmlStr = template("productTpl",info);
               $(".lt_content tbody").html(htmlStr);

               // 分页初始化（插件）
               // 1.引包 2.准备容器 3.初始化
               $("#paginator").bootstrapPaginator({
                   // 指定版本
                   bootstrapMajorVersion:3,
                   // 当前页
                   currentPage:info.page,
                   // 总页数
                   totalPages: Math.ceil(info.total / info.size),
                   // size:"normal", 设置按钮的大小，mini, small, normal,large

                   // 设置按钮中文
                   // 每个按钮在初始化的时候, 都会调用一次这个函数, 通过返回值进行设置文本
                   // 参数1: type  取值: page  first  last  prev  next
                   // 参数2: page  指当前这个按钮所指向的页码
                   // 参数3: current 当前页
                   itemTexts:function(  type, page, current ){
                       // console.log(arguments); //arguments:打印所有参数
                       // switch case 主要配置 type值：page  first  last  prev  next
                       switch(type){
                           case "page":
                               // return page;
                               return "第"+ page + "页";
                               // break; //这里break可以省掉 因为 return 了
                           case "first":
                               return "首页";
                           case "last":
                               return "尾页";
                           case "prev":
                               return "上一页";
                           case "next":
                               return "下一页";
                       }
                   },

                   // 配置 title 提示信息
                   tooltipTitles:function( type, page, current ){
                       switch(type){
                           case "page":
                               return "前往第" + page + "页";
                           case "first":
                               return "首页";
                           case "last":
                               return "尾页";
                           case "prev":
                               return "上一页";
                           case "next":
                               return "下一页";
                       }
                   },
                  // 使用bootstrap 提示框组件
                   useBootstrapTooltip:true,

               // 给分页按钮注册点击事件
                   onPageClicked: function(a,b,c,page){
                       currentPage = page;
                       // 页面重新渲染
                       render();
                   }
               })
           }
       })
   }

   // 2.点击 添加商品按钮 显示模态框
    $("#addBtn").click(function(){
      $("#addModal").modal("show");

      // 点击显示模态框同时 发送 ajax 请求 获取所有二级分类数据 进行下拉菜单渲染
      //  通过分页接口，模拟获取全部数据的接口
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            dataType:"json",
            success:function(info){
                console.log(info);
                var htmlStr = template("dropdownTpl",info);
                $(".dropdown-menu").html(htmlStr);
            }
        })
    });

   // 3.给dropdown-menu 下面的 a 注册点击事件（事件委托）
    $(".dropdown-menu").on("click","a",function(){
        // 获取选中的文本
        var txt = $(this).text();
        // 将文本赋值给 隐藏域
        $("#dropdownText").html(txt);

        // 设置 id 给隐藏域,将来用于提交给后台
        var id = $(this).data("id");
        $('[name="brandId"]').val(id);
    });


});