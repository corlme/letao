$(function(){
    var currentPage = 1;
    var pageSize = 5;
   //1. 一进入页面就发送ajax请求 进行页面渲染
    render();
   function render(){
       $.ajax({
           type: "get",
           url: "/category/queryTopCategoryPaging",
           data: {
               page: currentPage,
               pageSize: pageSize
           },
           dataType: "json",
           success: function(info){
               console.log(info);
               var htmlStr = template("tpl",info);
               $("tbody").html(htmlStr);

               // 分页初始化
               $("#paginator").bootstrapPaginator({
                   // 指定版本
                   bootstrapMajorVersion:3,
                   // 总页数
                   totalPages: Math.ceil(info.total / info.size),
                   // 当前页
                   currentPage: info.page,
                   // 给页码添加点击事件
                   onPageClicked:function(a,d,c,page){
                       currentPage = page;
                       // 重新渲染页面
                       render();
                   }

               });
           }
       })
   }

   // 2.添加分类 模态框
    $("#addBtn").click(function(){
        $("#addModal").modal("show");
    });

   // 3.使用表单校验插件，实现表单校验
   $("#form").bootstrapValidator({
       //配置图标
       feedbackIcons: {
           valid: 'glyphicon glyphicon-ok',  //校验成功  valid：有效的
           invalid: 'glyphicon glyphicon-remove',   // 校验失败 invalid:无效
           validating: 'glyphicon glyphicon-refresh'  //validating:校验中
       },
       // 配置字段
       fields:{
           // 字段名
           categoryName:{
               // 校验规则
               validators:{
                   notEmpty:{
                       message:"一级分类名不能为空"
                   }
               }
           }
       }

   });

   // 4.注册表单校验成功事件，阻止默认的成功提交，通过ajax提交
    $("#form").on("success.form.bv",function( e ){
        e.preventDefault();
        // 通过ajax进行提交
        $.ajax({
            type:"post",
            url:"/category/addTopCategory",
            data: $("#form").serialize(),
            dataType:"json",
            success:function(info){
                console.log(info);
                if(info.success){
                    // 添加成功后做两件事
                    // 1.关闭模态框
                    $("#addModal").modal('hide');
                    // 2.页面重新渲染第一页，让用户看到第一页数据
                    currentPage = 1;
                    render();
                    // 3.重置表单
                    $("#form").data("bootstrapValidator").resetForm(true);
                }
            }
        })
    })

});